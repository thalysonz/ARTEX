package selfupdate

import (
	"archive/zip"
	"net/url"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

// testPaths 造一个隔离的升级目录。不能直接用 ResolvePaths()——那会指向测试
// 二进制本身，一跑就把 go test 的可执行文件改名了。
func testPaths(t *testing.T) Paths {
	t.Helper()
	dir := t.TempDir()
	return Paths{
		Dir:     dir,
		Current: filepath.Join(dir, "artex"),
		New:     filepath.Join(dir, "artex.new"),
		Sum:     filepath.Join(dir, "artex.new.sha256"),
		Old:     filepath.Join(dir, "artex.old"),
		Marker:  filepath.Join(dir, "artex.upgrade.json"),
	}
}

// fakeBin 写一个可执行的壳脚本冒充 artex。smokeTest 只是用 -h 拉起它看退出码，
// 脚本完全够用，而且比编译一个真二进制快得多。
func fakeBin(t *testing.T, path, marker string, exitCode int) {
	t.Helper()
	script := "#!/bin/sh\necho " + marker + "\nexit " + itoa(exitCode) + "\n"
	if err := os.WriteFile(path, []byte(script), 0o755); err != nil {
		t.Fatalf("write fake binary %s: %v", path, err)
	}
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	return string(rune('0' + n))
}

// stage 把 bin 布置成"已暂存待换装"的样子：写好 artex.new 和它的校验和。
func stage(t *testing.T, p Paths, marker string, exitCode int) {
	t.Helper()
	fakeBin(t, p.New, marker, exitCode)
	sum, err := fileSHA256(p.New)
	if err != nil {
		t.Fatalf("compute checksum: %v", err)
	}
	if err := os.WriteFile(p.Sum, []byte(sum), 0o644); err != nil {
		t.Fatalf("write checksum: %v", err)
	}
}

func readAll(t *testing.T, path string) string {
	t.Helper()
	b, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read %s: %v", path, err)
	}
	return string(b)
}

func requireUnix(t *testing.T) {
	t.Helper()
	if runtime.GOOS == "windows" {
		t.Skip("fake binaries are sh scripts and cannot run on Windows")
	}
}

func TestCompareVersions(t *testing.T) {
	cases := []struct {
		a, b       string
		want       int
		comparable bool
	}{
		{"0.3.7", "0.3.8", -1, true},
		{"0.3.8", "0.3.7", 1, true},
		{"0.3.7", "0.3.7", 0, true},
		{"v0.3.7", "0.3.8", -1, true}, // build.sh 去掉 v，tag 带 v，两边都要认
		{"0.3.7", "v0.3.7", 0, true},
		{"0.9.0", "0.10.0", -1, true}, // 按数字比而不是字典序
		{"1.0.0", "0.99.99", 1, true},
		// 开发构建必须判为不可比较，否则会被正式版覆盖掉未提交的改动。
		{"dev", "0.3.8", 0, false},
		{"0.3.7-2-gabc1234", "0.3.8", 0, false},
		{"0.3.7-dirty", "0.3.8", 0, false},
		{"0.3", "0.3.8", 0, false},
		{"", "0.3.8", 0, false},
	}
	for _, c := range cases {
		got, ok := CompareVersions(c.a, c.b)
		if ok != c.comparable {
			t.Errorf("CompareVersions(%q,%q) comparable=%v, want %v", c.a, c.b, ok, c.comparable)
			continue
		}
		if ok && got != c.want {
			t.Errorf("CompareVersions(%q,%q)=%d, want %d", c.a, c.b, got, c.want)
		}
	}
}

func TestResolvePathsNaming(t *testing.T) {
	p, err := ResolvePaths()
	if err != nil {
		t.Fatalf("ResolvePaths: %v", err)
	}
	// 关键不变量：所有升级文件都和可执行文件同目录。落到 CWD 会让服务化运行
	// （工作目录可能是 /）时的换装彻底失效。
	for name, path := range map[string]string{"New": p.New, "Sum": p.Sum, "Old": p.Old, "Marker": p.Marker} {
		if filepath.Dir(path) != p.Dir {
			t.Errorf("%s is not in the executable directory: %s (want %s)", name, path, p.Dir)
		}
	}
	// Windows 上 .new/.old 必须保留 .exe，否则冒烟测试和换装后的执行都会失败。
	if runtime.GOOS == "windows" {
		if !strings.HasSuffix(p.New, ".exe") || !strings.HasSuffix(p.Old, ".exe") {
			t.Errorf("on Windows .new/.old must end with .exe: new=%s old=%s", p.New, p.Old)
		}
	}
}

func TestVerifyStagedRejectsTamperedBinary(t *testing.T) {
	requireUnix(t)
	p := testPaths(t)
	stage(t, p, "new", 0)

	// 校验和写好之后再改动文件，模拟下载损坏 / 被掉包。
	fakeBin(t, p.New, "tampered", 0)
	if err := verifyStaged(p); err == nil {
		t.Fatal("expected SHA256 mismatch to be rejected, but it passed")
	}
}

func TestVerifyStagedRejectsUnrunnableBinary(t *testing.T) {
	requireUnix(t)
	p := testPaths(t)
	stage(t, p, "broken", 1) // 能执行但退出码非 0

	if err := verifyStaged(p); err == nil {
		t.Fatal("expected smoke test failure to be rejected, but it passed")
	}
}

func TestApplyStagedHappyPath(t *testing.T) {
	requireUnix(t)
	p := testPaths(t)
	fakeBin(t, p.Current, "old", 0)
	stage(t, p, "new", 0)
	if err := writeMarker(p.Marker, marker{From: "0.3.7", To: "0.3.8"}); err != nil {
		t.Fatalf("write marker: %v", err)
	}

	action, st := applyStaged(p)
	if action != Restart {
		t.Fatalf("want Restart, got %v", action)
	}
	if !st.Pending {
		t.Error("state should be Pending after swap")
	}
	if !strings.Contains(readAll(t, p.Current), "new") {
		t.Error("artex should have been replaced with the new version")
	}
	if !strings.Contains(readAll(t, p.Old), "old") {
		t.Error("old version should be backed up to artex.old")
	}
	if _, err := os.Stat(p.New); !os.IsNotExist(err) {
		t.Error("artex.new should be gone after swap")
	}
	if _, err := os.Stat(p.Sum); !os.IsNotExist(err) {
		t.Error("checksum file should be cleaned up after swap")
	}
	// 标记必须留着，下一次启动（跑的是新版）靠它计数、必要时回滚。
	if _, ok := readMarker(p.Marker); !ok {
		t.Error("upgrade marker should be kept after swap")
	}
}

func TestApplyStagedKeepsCurrentWhenVerifyFails(t *testing.T) {
	requireUnix(t)
	p := testPaths(t)
	fakeBin(t, p.Current, "old", 0)
	stage(t, p, "new", 0)
	fakeBin(t, p.New, "tampered", 0) // 破坏校验和

	action, st := applyStaged(p)
	if action != Continue {
		t.Fatalf("want Continue on verification failure, got %v", action)
	}
	if !st.FailedStage {
		t.Error("state should be marked FailedStage")
	}
	if !strings.Contains(readAll(t, p.Current), "old") {
		t.Fatal("the current version must never be touched on verification failure")
	}
	if _, err := os.Stat(p.New); !os.IsNotExist(err) {
		t.Error("a staged file that failed verification should be cleaned up, otherwise the next start will try again")
	}
}

func TestSwapOverwritesPreviousBackup(t *testing.T) {
	requireUnix(t)
	p := testPaths(t)
	fakeBin(t, p.Current, "v2", 0)
	fakeBin(t, p.Old, "v1", 0) // 上一轮升级留下的备份
	stage(t, p, "v3", 0)

	if err := swap(p); err != nil {
		t.Fatalf("swap: %v", err)
	}
	if !strings.Contains(readAll(t, p.Current), "v3") {
		t.Error("should swap to v3")
	}
	if !strings.Contains(readAll(t, p.Old), "v2") {
		t.Error("backup should be updated to the just-replaced v2")
	}
}

func TestConfirmCountsAttemptsThenRollsBack(t *testing.T) {
	requireUnix(t)
	p := testPaths(t)
	fakeBin(t, p.Current, "broken-new", 0)
	fakeBin(t, p.Old, "good-old", 0)
	m := marker{From: "0.3.7", To: "0.3.8"}

	// 前 maxAttempts 次启动只累计计数，让新版有机会自己站稳。
	for i := 1; i <= maxAttempts; i++ {
		action, st := confirmOrRollback(p, m)
		if action != Continue {
			t.Fatalf("attempt %d: want Continue, got %v", i, action)
		}
		if !st.Pending {
			t.Errorf("attempt %d: state should be Pending", i)
		}
		got, ok := readMarker(p.Marker)
		if !ok || got.Attempts != i {
			t.Fatalf("after attempt %d attempts=%d (ok=%v), want %d", i, got.Attempts, ok, i)
		}
		m = got
	}

	// 再崩一次就超限，自动把旧版换回来。
	action, st := confirmOrRollback(p, m)
	if action != Restart {
		t.Fatalf("want Restart when exceeding the attempt limit, got %v", action)
	}
	if !st.RolledBack {
		t.Error("state should be marked RolledBack")
	}
	if !strings.Contains(readAll(t, p.Current), "good-old") {
		t.Fatal("should have rolled back to the old version")
	}
	if _, err := os.Stat(p.Marker); !os.IsNotExist(err) {
		t.Error("marker should be cleared after rollback, otherwise it would roll back forever")
	}
	// 起不来的那个版本留作排查，不直接删。
	if _, err := os.Stat(p.Current + ".failed"); err != nil {
		t.Error("failed version should be kept as .failed for troubleshooting")
	}
}

func TestManualRollbackIsReversible(t *testing.T) {
	requireUnix(t)
	p := testPaths(t)
	fakeBin(t, p.Current, "v2", 0)
	fakeBin(t, p.Old, "v1", 0)

	// Rollback() 走 ResolvePaths()，这里直接测底层的交换语义。
	tmp := p.Current + ".swap"
	if err := os.Rename(p.Current, tmp); err != nil {
		t.Fatal(err)
	}
	if err := os.Rename(p.Old, p.Current); err != nil {
		t.Fatal(err)
	}
	if err := os.Rename(tmp, p.Old); err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(readAll(t, p.Current), "v1") {
		t.Error("current version should be v1 after rollback")
	}
	if !strings.Contains(readAll(t, p.Old), "v2") {
		t.Error("backup should become v2 after rollback so it can be rolled back again")
	}
}

func TestParseSums(t *testing.T) {
	const (
		linuxSum = "1111111111111111111111111111111111111111111111111111111111111111"
		winSum   = "ABCDEF0000000000000000000000000000000000000000000000000000000000"
	)
	// sha256sum 输出是双空格分隔；shasum -a 256 在二进制模式下会给文件名加 *。
	raw := linuxSum + "  artex-0.3.8-linux-amd64.zip\n" +
		winSum + " *artex-0.3.8-windows-amd64.zip\n" +
		"\n" +
		"garbage line\n" + // 恰好两个字段，但第一个不是摘要
		"deadbeef  artex-0.3.8-darwin-arm64.zip\n" // 摘要长度不对

	out := parseSums(raw)
	if out["artex-0.3.8-linux-amd64.zip"] != linuxSum {
		t.Errorf("linux entry parsed incorrectly: %v", out)
	}
	// 摘要统一小写，比对时才不会因大小写误判为不匹配。
	if got := out["artex-0.3.8-windows-amd64.zip"]; got != strings.ToLower(winSum) {
		t.Errorf("wrong windows entry (* prefix should be stripped, digest lowercased): %q", got)
	}
	if len(out) != 2 {
		t.Errorf("should ignore blank lines, non-digest lines, and lines with wrong length, got %v", out)
	}
}

func TestExtractBinaryFindsNestedEntry(t *testing.T) {
	if runtime.GOOS == "windows" {
		t.Skip("the in-package base name is artex.exe on Windows; this case is built with Unix naming")
	}
	dir := t.TempDir()
	zipPath := filepath.Join(dir, "release.zip")

	f, err := os.Create(zipPath)
	if err != nil {
		t.Fatal(err)
	}
	zw := zip.NewWriter(f)
	// 真实发布包的结构：artex-<版本>-<os>-<arch>/artex，外加若干干扰文件。
	for name, body := range map[string]string{
		"artex-0.3.8-linux-amd64/README.md":           "readme",
		"artex-0.3.8-linux-amd64/skills/a.md":         "skill",
		"artex-0.3.8-linux-amd64/artex":               "#!/bin/sh\nexit 0\n",
		"artex-0.3.8-linux-amd64/config.example.json": "{}",
	} {
		w, err := zw.Create(name)
		if err != nil {
			t.Fatal(err)
		}
		if _, err := w.Write([]byte(body)); err != nil {
			t.Fatal(err)
		}
	}
	if err := zw.Close(); err != nil {
		t.Fatal(err)
	}
	f.Close()

	dst := filepath.Join(dir, "out")
	if err := extractBinary(zipPath, dst); err != nil {
		t.Fatalf("extractBinary: %v", err)
	}
	if got := readAll(t, dst); !strings.Contains(got, "exit 0") {
		t.Errorf("extracted file is not the artex executable: %q", got)
	}
	info, err := os.Stat(dst)
	if err != nil {
		t.Fatal(err)
	}
	if info.Mode().Perm()&0o111 == 0 {
		t.Error("extracted binary must have the executable bit")
	}
}

func TestExtractBinaryMissingEntry(t *testing.T) {
	dir := t.TempDir()
	zipPath := filepath.Join(dir, "release.zip")
	f, err := os.Create(zipPath)
	if err != nil {
		t.Fatal(err)
	}
	zw := zip.NewWriter(f)
	w, _ := zw.Create("artex-0.3.8-linux-amd64/README.md")
	_, _ = w.Write([]byte("readme"))
	_ = zw.Close()
	f.Close()

	if err := extractBinary(zipPath, filepath.Join(dir, "out")); err == nil {
		t.Fatal("should return an error when the package has no executable")
	}
}

func TestCheckURLRejectsNonGitHub(t *testing.T) {
	bad := []string{
		"http://github.com/x",           // 非 HTTPS
		"https://evil.com/artex.zip",    // 域名不在白名单
		"https://github.com.evil.com/x", // 后缀伪装
		"https://raw.githubusercontent.com.evil.com/x",
	}
	for _, raw := range bad {
		u := mustParse(t, raw)
		if err := checkURL(u); err == nil {
			t.Errorf("checkURL(%q) should be rejected", raw)
		}
	}
	good := []string{
		"https://api.github.com/repos/x/releases/latest",
		"https://objects.githubusercontent.com/blah",
		"https://GitHub.com/x", // 域名大小写不敏感
	}
	for _, raw := range good {
		u := mustParse(t, raw)
		if err := checkURL(u); err != nil {
			t.Errorf("checkURL(%q) should be allowed, but returned error: %v", raw, err)
		}
	}
}

func TestAssetNameMatchesBuildScript(t *testing.T) {
	// build.sh 的 package_binary 用的是 artex-<版本>-<os>-<arch>.zip，且版本号
	// 去掉了 v 前缀。这里对错一个字符，所有平台的一键更新都会找不到资产。
	if got := AssetName("v0.3.8", "linux", "amd64"); got != "artex-0.3.8-linux-amd64.zip" {
		t.Errorf("AssetName = %q", got)
	}
	if got := AssetName("0.3.8", "windows", "amd64"); got != "artex-0.3.8-windows-amd64.zip" {
		t.Errorf("AssetName = %q", got)
	}
}

func mustParse(t *testing.T, raw string) *url.URL {
	t.Helper()
	u, err := url.Parse(raw)
	if err != nil {
		t.Fatalf("parse %q: %v", raw, err)
	}
	return u
}

func TestSettleClearsMarkerAndStopsRollback(t *testing.T) {
	requireUnix(t)
	p := testPaths(t)
	fakeBin(t, p.Current, "new", 0)
	fakeBin(t, p.Old, "old", 0)
	if err := writeMarker(p.Marker, marker{From: "0.3.7", To: "0.3.8", Attempts: 2}); err != nil {
		t.Fatal(err)
	}

	settle(p)

	if _, err := os.Stat(p.Marker); !os.IsNotExist(err) {
		t.Fatal("upgrade marker must be cleared after confirming stability")
	}
	// 标记没了，后续正常重启就不会再累计次数、也不会误触发回滚。
	if _, ok := readMarker(p.Marker); ok {
		t.Error("reading the marker should fail")
	}
	// 备份要留着，用户还能手动回滚。
	if _, err := os.Stat(p.Old); err != nil {
		t.Error("previous version backup should still be kept after confirming stability")
	}
}

func TestSettleIsNoopWithoutMarker(t *testing.T) {
	requireUnix(t)
	p := testPaths(t)
	fakeBin(t, p.Current, "cur", 0)
	settle(p) // 普通启动路径，不该 panic 也不该动任何文件
	if _, err := os.Stat(p.Current); err != nil {
		t.Error("settle should not touch any files when there is no marker")
	}
}
