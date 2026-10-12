import type { Messages } from "../types";
import agentsIntercept from "./agents-intercept";
import common from "./common";
import dashboardChat from "./dashboard-chat";
import findingsAssets from "./findings-assets";
import shell from "./shell";
import systemConfig from "./system-config";
import taskDetail from "./task-detail";
import tasks from "./tasks";

// Later parts win on duplicate keys; keep shared wording in common.ts.
export const MESSAGES: Messages = {
  ...common,
  ...tasks,
  ...taskDetail,
  ...systemConfig,
  ...agentsIntercept,
  ...findingsAssets,
  ...dashboardChat,
  ...shell,
};
