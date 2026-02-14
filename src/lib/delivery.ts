/** سعر التوصيل: طنطا 45 جنيه، أي مكان آخر 70 جنيه */
export const DELIVERY_TANTA = 45;
export const DELIVERY_OTHER = 70;

/**
 * حساب سعر التوصيل حسب المدينة.
 * طنطا (أو Tanta) = 45، غير ذلك = 70
 */
export function getDeliveryFee(city: string): number {
  const normalized = (city || "").trim();
  if (!normalized) return DELIVERY_OTHER;
  const isTanta =
    normalized.toLowerCase().includes("tanta") ||
    normalized.includes("طنطا");
  return isTanta ? DELIVERY_TANTA : DELIVERY_OTHER;
}
