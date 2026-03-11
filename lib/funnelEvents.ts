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
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackFunnelEvent(event: FunnelEventName, payload: FunnelPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const data = { event, ...payload };
  window.dispatchEvent(new CustomEvent("funnel:event", { detail: data }));
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(data);
  }
}
