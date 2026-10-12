import { t } from "@/i18n";

import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "ARTEX",
  version: packageJson.version,
  copyright: `© ${currentYear}, ARTEX.`,
  meta: {
    title: `ARTEX — ${t("自主渗透测试控制台")}`,
    description: t("LLM 驱动的自主渗透测试系统控制台"),
  },
};
