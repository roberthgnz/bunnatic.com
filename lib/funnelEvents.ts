import {hasAnalyticsConsent} from '@/lib/cookieConsent';

export type FunnelEventName =
  | "landing_cta_click"
  | "crear_search_submitted"
  | "crear_preview_generated"
  | "crear_publish_clicked"
  | "signup_started"
  | "signup_completed"
  | "checkout_started"
  | "checkout_completed"
  | "onboarding_step_completed";

type FunnelPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    ga?: (...args: unknown[]) => void;
  }
}

export function trackFunnelEvent(event: FunnelEventName, payload: FunnelPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const data = { event, ...payload };
  window.dispatchEvent(new CustomEvent("funnel:event", { detail: data }));

  if (hasAnalyticsConsent() && typeof window.ga === "function") {
    const eventValue =
      typeof payload.value === "number"
        ? payload.value
        : typeof payload.revenue === "number"
          ? payload.revenue
          : undefined;

    window.ga("send", "event", "funnel", event, JSON.stringify(payload), eventValue);
  }
}
