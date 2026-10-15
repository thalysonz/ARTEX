import { t } from "@/i18n";
// 渠道字段表与配置值的解析工具。
//
// 与页面拆开是因为这一份是**数据**而不是视图：它描述每种渠道有哪些字段、
// 各自该用什么控件，以及表单文本到配置值（JSON）的双向转换。
// 单独放一个文件后，新增渠道只需要动这里，页面本身不必改。
// 渠道类型的展示名与简介。放在前端是因为它只影响文案，后端不需要知道。
export const KIND_LABEL: Record<string, string> = {
  dingtalk: t("钉钉"),
  feishu: t("飞书"),
  wecom: t("企业微信"),
  webhook: t("通用 Webhook"),
  telegram: "Telegram",
  email: t("邮件"),
};

// 各渠道的配置字段定义。
//
// 这里刻意保留一份前端字段表，而不是让后端下发 schema：后端只负责
// Validate（必填/格式），UI 需要的是布局与控件类型，两者关注的不是同一件事。
// 唯一的耦合点是 secret_keys —— 哪些字段该渲染成密码框由后端给出，
// 因为只有渠道实现自己清楚哪些值算凭据（企业微信的整个 Webhook 就是凭据，
// 而钉钉的只是其中一个 secret）。新增渠道时这里少一个条目只会让表单变空白，
// 不会静默出错（下面的 hasFields 会提示）。
export type FieldKind = "text" | "password" | "number" | "select" | "textarea" | "switch" | "kv" | "list";
export interface FieldDef {
  key: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
}
export const CHANNEL_FIELDS: Record<string, FieldDef[]> = {
  dingtalk: [
    {
      key: "webhook",
      label: t("Webhook 地址"),
      kind: "text",
      placeholder: "https://oapi.dingtalk.com/robot/send?access_token=...",
    },
    {
      key: "secret",
      label: t("加签密钥"),
      kind: "password",
      help: t("机器人安全设置选「加签」时填写；选「自定义关键词」或未开启安全设置则留空"),
    },
  ],
  feishu: [
    {
      key: "webhook",
      label: t("Webhook 地址"),
      kind: "text",
      placeholder: "https://open.feishu.cn/open-apis/bot/v2/hook/...",
    },
    {
      key: "secret",
      label: t("签名校验密钥"),
      kind: "password",
      help: t("机器人开启「签名校验」时填写，否则留空"),
    },
  ],
  wecom: [
    {
      key: "webhook",
      label: t("Webhook 地址"),
      kind: "text",
      placeholder: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=...",
    },
  ],
  webhook: [
    { key: "url", label: t("目标 URL"), kind: "text", placeholder: "https://your-endpoint.example.com/hook" },
    {
      key: "method",
      label: t("请求方法"),
      kind: "select",
      options: [
        { value: "POST", label: t("POST（带请求体）") },
        { value: "PUT", label: t("PUT（带请求体）") },
        { value: "PATCH", label: t("PATCH（带请求体）") },
        { value: "GET", label: t("GET（不带请求体）") },
      ],
    },
    {
      key: "headers",
      label: t("自定义请求头"),
      kind: "kv",
      help: t("每行 KEY=VALUE，例如 Authorization=Bearer xxx"),
    },
    {
      key: "body_template",
      label: t("请求体模板"),
      kind: "textarea",
      help: t(
        "留空用内置默认模板。变量：{{.Title}} {{.Batch}} {{.Count}} {{.HomeURL}} {{.SentAt}}，以及 range .Items 下的 .Name/.VulnClass/.Severity/.Summary/.Assets/.DetailURL/.StatusLabel。插入字符串请用 {{json .Xxx}} 而不是 {{.Xxx}}，否则标题里的引号会破坏 JSON。",
      ),
    },
  ],
  telegram: [
    { key: "bot_token", label: "Bot Token", kind: "password", placeholder: "123456:ABC-DEF..." },
    { key: "chat_id", label: "Chat ID", kind: "text", placeholder: "-1001234567890" },
    {
      key: "base_url",
      label: t("API 地址"),
      kind: "text",
      placeholder: "https://api.telegram.org",
      help: t("留空用官方地址；自建 Bot API 反代时填写"),
    },
  ],
  email: [
    { key: "host", label: t("SMTP 服务器"), kind: "text", placeholder: "smtp.example.com" },
    {
      key: "port",
      label: t("端口"),
      kind: "number",
      placeholder: "587",
      help: t("587 走 STARTTLS；465 请把「隐式 TLS」打开"),
    },
    { key: "username", label: t("账号"), kind: "text" },
    { key: "password", label: t("密码 / 授权码"), kind: "password" },
    { key: "from", label: t("发件人"), kind: "text", placeholder: "artex@example.com" },
    { key: "to", label: t("收件人"), kind: "list", help: t("多个地址用逗号分隔") },
    {
      key: "tls",
      label: t("隐式 TLS"),
      kind: "switch",
      help: t("465 端口打开；587 保持关闭（会自动 STARTTLS）"),
    },
  ],
};

export const SEVERITY_OPTIONS = [
  { value: "", label: t("不限") },
  { value: "low", label: t("低危及以上") },
  { value: "medium", label: t("中危及以上") },
  { value: "high", label: t("高危及以上") },
  { value: "critical", label: t("仅严重") },
];

export type ChannelForm = {
  name: string;
  kind: string;
  mode: "realtime" | "digest";
  enabled: boolean;
  ratePerMin: string;
  config: Record<string, unknown>;
  minSeverity: string;
  includeText: string;
  excludeText: string;
  taskIDsText: string;
  assetIDsText: string;
  onStatusChange: boolean;
};

export const emptyForm = (kind: string): ChannelForm => ({
  name: "",
  kind,
  mode: "realtime",
  enabled: true,
  ratePerMin: "",
  config: {},
  minSeverity: "",
  includeText: "",
  excludeText: "",
  taskIDsText: "",
  assetIDsText: "",
  onStatusChange: false,
});

// parseKV 解析「每行 KEY=VALUE」的文本域。
export function parseKV(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const ln = line.trim();
    if (!ln) continue;
    const i = ln.indexOf("=");
    if (i > 0) out[ln.slice(0, i).trim()] = ln.slice(i + 1).trim();
  }
  return out;
}
// parseIDs 解析逗号/空白分隔的 id 列表。
export function parseIDs(text: string): number[] {
  return text
    .split(/[\s,，]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n) && n > 0);
}
// parseKeywords 解析行/逗号分隔的关键词列表（漏洞类型名可能含空格，所以按行或逗号切）。
export function parseKeywords(text: string): string[] {
  return text
    .split(/[\n,，]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
