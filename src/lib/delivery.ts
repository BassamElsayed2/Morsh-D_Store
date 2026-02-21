/** سعر التوصيل: طنطا 45 جنيه، أي مكان آخر 70 جنيه */
export const DELIVERY_TANTA = 45;
export const DELIVERY_OTHER = 70;

/**
 * حساب سعر التوصيل حسب المدينة وعدد القطع.
 * لو في السلة أكثر من قطعة واحدة → الشحن مجاني.
 * طنطا (أو Tanta) = 45، غير ذلك = 70
 */
export function getDeliveryFee(city: string, totalItems = 0): number {
  if (totalItems > 1) return 0;
  const normalized = (city || "").trim();
  if (!normalized) return DELIVERY_OTHER;
  const isTanta =
    normalized.toLowerCase().includes("tanta") ||
    normalized.includes("طنطا");
  return isTanta ? DELIVERY_TANTA : DELIVERY_OTHER;
}
