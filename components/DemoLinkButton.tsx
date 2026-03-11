"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { trackFunnelEvent } from "@/lib/funnelEvents";

type DemoLinkButtonProps = {
  className?: string;
  label?: string;
};

export default function DemoLinkButton({ className, label }: DemoLinkButtonProps) {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const paramsText = searchParams.toString();

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];
  const hasLocale = locale === "es" || locale === "ca";
  const targetPath = hasLocale ? `/${locale}/crear` : "/crear";
  const source = `${pathname}${paramsText ? `?${paramsText}` : ""}`;
  const defaultLabel = locale === "ca" ? "Provar demo gratuïta" : "Probar demo gratis";

  return (
    <Link
      href={`${targetPath}?source=${encodeURIComponent(source)}`}
      onClick={() => trackFunnelEvent("landing_cta_click", { placement: "demo_link_button", locale: hasLocale ? locale : "es" })}
      className={cn(className)}
    >
      {label ?? defaultLabel}
    </Link>
  );
}
