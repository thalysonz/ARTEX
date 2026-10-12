"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { t } from "@/i18n";

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center space-y-2 text-center">
      <h1 className="font-semibold text-2xl">{t("页面不存在。")}</h1>
      <p className="text-muted-foreground">{t("找不到你要访问的页面。")}</p>
      <Link prefetch={false} replace href="/function/tasks">
        <Button variant="outline">{t("返回首页")}</Button>
      </Link>
    </div>
  );
}
