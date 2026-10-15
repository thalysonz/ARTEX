import { t } from "@/i18n";
import type { NewAssetType } from "@/lib/types";

const ASSET_TYPE_LABELS: Record<NewAssetType, string> = {
  app: t("应用"),
  endpoint: t("接口"),
  ip: "IP",
  root_domain: t("根域名"),
  service: t("服务"),
  subdomain: t("子域名"),
};

const TASK_ASSET_SOURCE_LABELS: Record<string, string> = {
  agent: t("Agent 发现"),
  anchor: t("黑板锚点"),
  api: t("资产 API"),
  company: t("企业关联"),
  legacy: t("历史关联"),
  manual: t("人工加入"),
  system: t("系统关联"),
  task: t("任务初始化"),
};

export function taskAssetTypeLabel(type: NewAssetType): string {
  return ASSET_TYPE_LABELS[type];
}

export function taskAssetSourceLabel(source: string): string {
  return TASK_ASSET_SOURCE_LABELS[source] ?? source;
}
