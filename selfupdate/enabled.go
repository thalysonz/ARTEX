package selfupdate

// Enabled is a compile-time kill switch for the whole self-update path.
//
// It is false in this fork on purpose: the release source (Repo) is a third-party
// GitHub repository, and the SHA256SUMS file is served from the same place as the
// binary, so the checksum does not protect against whoever controls that repo. The
// staged binary is also executed during verification (smokeTest). With this off:
//
//   - main never runs Bootstrap/Settle, so no staged artex.new is ever executed or
//     swapped in, and no rollback happens;
//   - /api/update/check answers locally without contacting GitHub;
//   - /api/update/apply and /api/update/rollback are refused.
//
// Being a const (not an env var or setting), it cannot be turned back on from the
// UI or the environment. Rebuild from audited source to upgrade instead.
const Enabled = false

// DisabledReason is shown to the user wherever an update action is refused.
const DisabledReason = "Self-update is disabled in this build. Rebuild the image from audited source to upgrade."
