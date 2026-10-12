import {
  Activity,
  Ban,
  BellRing,
  Bot,
  Brain,
  Bug,
  ClipboardList,
  FolderOpen,
  FolderSync,
  LayoutDashboard,
  type LucideIcon,
  MessageSquare,
  Network,
  Plug,
  Radio,
  ScrollText,
  Settings2,
  ShieldAlert,
  Sparkles,
  Target,
  Terminal,
  Wrench,
} from "lucide-react";

import { t } from "@/i18n";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: t("功能"),
    items: [
      { id: "dashboard", title: t("仪表盘"), url: "/dashboard", icon: LayoutDashboard },
      { id: "chat", title: t("对话"), url: "/chat", icon: MessageSquare },
      { id: "tasks", title: t("任务"), url: "/function/tasks", icon: Target },
      { id: "findings", title: t("发现"), url: "/function/findings", icon: Bug },
      { id: "traffic", title: t("流量"), url: "/function/traffic", icon: Activity },
      { id: "commands", title: t("工具执行"), url: "/function/commands", icon: Terminal },
      { id: "llm-records", title: t("LLM 录制"), url: "/function/llm-records", icon: Radio },
      { id: "assets", title: t("资产"), url: "/function/assets", icon: Network },
      { id: "sync", title: t("资产同步"), url: "/function/sync", icon: FolderSync },
      { id: "workspace", title: t("工作空间"), url: "/function/workspace", icon: FolderOpen },
    ],
  },
  {
    id: 2,
    label: t("系统"),
    items: [
      { id: "llm", title: "LLM", url: "/system/llm", icon: Brain },
      { id: "agents", title: "Agent", url: "/system/agents", icon: Bot },
      { id: "mcp", title: "MCP", url: "/system/mcp", icon: Plug },
      { id: "skills", title: "Skill", url: "/system/skills", icon: Sparkles },
      { id: "tools", title: t("工具"), url: "/system/tools", icon: Wrench },
      { id: "notify", title: t("通知推送"), url: "/system/notify", icon: BellRing },
      { id: "intercept", title: t("拦截规则"), url: "/system/intercept", icon: ShieldAlert },
      { id: "asset-intercept", title: t("资产拦截"), url: "/system/intercept/assets", icon: Ban },
      { id: "approvals", title: t("审批记录"), url: "/system/intercept/approvals", icon: ClipboardList },
      { id: "logs", title: t("日志"), url: "/system/logs", icon: ScrollText },
      { id: "settings", title: t("系统配置"), url: "/system/settings", icon: Settings2 },
    ],
  },
];
