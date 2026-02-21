/**
 * Meta (Facebook) Pixel tracking.
 * Set VITE_META_PIXEL_ID in .env with your Pixel ID.
 */

declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

const PIXEL_ID =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_META_PIXEL_ID
    ? String(import.meta.env.VITE_META_PIXEL_ID).trim()
    : "";

function isReady(): boolean {
  return typeof window !== "undefined" && !!window.fbq && !!PIXEL_ID;
}

/**
 * Injects the Meta Pixel base script and fires initial PageView.
 * Call once when the app mounts.
 */
export function initMetaPixel(): void {
  if (!PIXEL_ID || typeof document === "undefined") return;
  if (window.fbq) {
    trackPageView();
    return;
  }
  const script = document.createElement("script");
  script.textContent = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${PIXEL_ID.replace(/'/g, "\\'")}');
    fbq('track', 'PageView');
  `;
  document.head?.appendChild(script);
}

/** Track page view (e.g. on route change or initial load). */
export function trackPageView(): void {
  if (!isReady()) return;
  window.fbq!("track", "PageView");
}

/**
 * Track AddToCart.
 * @param contentIds - e.g. product id
 * @param value - numeric value (e.g. price)
 * @param currency - e.g. "EGP"
 */
export function trackAddToCart(
  contentIds: string[],
  value: number,
  currency = "EGP",
): void {
  if (!isReady()) return;
  window.fbq!("track", "AddToCart", {
    content_ids: contentIds,
    content_type: "product",
    value,
    currency,
  });
}

/** Track InitiateCheckout (user started filling checkout form). */
export function trackInitiateCheckout(value?: number, currency = "EGP"): void {
  if (!isReady()) return;
  window.fbq!("track", "InitiateCheckout", value != null ? { value, currency } : undefined);
}

/**
 * Track Purchase (order completed / sent to WhatsApp).
 * Use for conversion when user actually sends the order.
 */
export function trackPurchase(value: number, currency = "EGP"): void {
  if (!isReady()) return;
  window.fbq!("track", "Purchase", { value, currency });
}

/**
 * Track Lead (e.g. contact / WhatsApp click without full purchase).
 * Use if you prefer Lead over Purchase for WhatsApp click.
 */
export function trackLead(): void {
  if (!isReady()) return;
  window.fbq!("track", "Lead");
}
