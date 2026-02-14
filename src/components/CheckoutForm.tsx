import { useState, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getDeliveryFee } from "@/lib/delivery";
import { EGYPT_COUNTRY, EGYPT_STATES, getCitiesByState } from "@/data/egypt";

interface CheckoutFormProps {
  cartSubtotal?: number;
  onSubmit: (formData: FormData) => void;
  onClose: () => void;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  governorate: string;
  city: string;
  apartment: string;
  paymentMethod: string;
}

const STORAGE_KEY = "morsh-d-checkout-form";

export const CheckoutForm = ({ cartSubtotal = 0, onSubmit, onClose }: CheckoutFormProps) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Load form data from sessionStorage on mount
  const [formData, setFormData] = useState<FormData>(() => {
    const defaults: FormData = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: EGYPT_COUNTRY.en,
      governorate: "",
      city: "",
      apartment: "",
      paymentMethod: "cash",
    };
    try {
      const savedData = sessionStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData) as Partial<FormData>;
        return { ...defaults, ...parsed, country: parsed.country ?? EGYPT_COUNTRY.en };
      }
    } catch (error) {
      console.error("Error loading form data from sessionStorage:", error);
    }
    return defaults;
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const deliveryFee = useMemo(
    () => getDeliveryFee(formData.city),
    [formData.city],
  );
  const totalWithDelivery = cartSubtotal + deliveryFee;

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving form data to sessionStorage:", error);
    }
  }, [formData]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        if (field === "governorate") next.city = "";
        return next;
      });
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = isArabic ? "الاسم الأول مطلوب" : "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = isArabic ? "الاسم الأخير مطلوب" : "Last name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isArabic ? "البريد الإلكتروني غير صالح" : "Invalid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = isArabic ? "رقم الهاتف مطلوب" : "Phone number is required";
    } else if (!/^[0-9+\s()-]{10,}$/.test(formData.phone)) {
      newErrors.phone = isArabic ? "رقم هاتف غير صالح" : "Invalid phone number";
    }

    if (!formData.governorate) {
      newErrors.governorate = isArabic ? "المحافظة مطلوبة" : "Governorate is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = isArabic ? "المدينة مطلوبة" : "City is required";
    }

    if (!formData.apartment.trim()) {
      newErrors.apartment = isArabic ? "العنوان مطلوب" : "Address is required";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = isArabic ? "طريقة الدفع مطلوبة" : "Payment method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isArabic]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        onSubmit(formData);
      }
    },
    [formData, validateForm, onSubmit]
  );

  const handleClearSavedData = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: EGYPT_COUNTRY.en,
        governorate: "",
        city: "",
        apartment: "",
        paymentMethod: "cash",
      });
      setErrors({});
    } catch (error) {
      console.error("Error clearing saved data:", error);
    }
  }, []);

  // Check if there is saved data
  const hasSavedData = formData.firstName || formData.lastName || formData.phone;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg neon-border pixel-corners">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-10">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold neon-glow">
              {isArabic ? "📦 معلومات الشحن" : "📦 Shipping Information"}
            </h2>
            {hasSavedData && (
              <p className="text-xs text-muted-foreground mt-1">
                {isArabic ? "💾 البيانات محفوظة تلقائياً" : "💾 Data saved automatically"}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">
                {isArabic ? "الاسم الأول" : "First Name"} <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`w-full bg-background border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.firstName ? "border-destructive ring-1 ring-destructive" : "border-border"
                }`}
                placeholder={isArabic ? "أدخل الاسم الأول..." : "Enter first name..."}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                {isArabic ? "الاسم الأخير" : "Last Name"} <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`w-full bg-background border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.lastName ? "border-destructive ring-1 ring-destructive" : "border-border"
                }`}
                placeholder={isArabic ? "أدخل الاسم الأخير..." : "Enter last name..."}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold mb-2">
              {isArabic ? "البريد الإلكتروني" : "Email"} <span className="text-muted-foreground text-xs">({isArabic ? "اختياري" : "optional"})</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full bg-background border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.email ? "border-destructive ring-1 ring-destructive" : "border-border"
              }`}
              placeholder={isArabic ? "example@email.com" : "example@email.com"}
              dir="ltr"
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold mb-2">
              {isArabic ? "رقم الهاتف" : "Phone Number"} <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`w-full bg-background border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.phone ? "border-destructive ring-1 ring-destructive" : "border-border"
              }`}
              placeholder={isArabic ? "01XXXXXXXXX" : "01XXXXXXXXX"}
              dir="ltr"
            />
            {errors.phone && (
              <p className="text-xs text-destructive mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Country - مصر فقط */}
          <div>
            <label className="block text-sm font-bold mb-2">
              {isArabic ? "الدولة" : "Country"}
            </label>
            <input
              type="text"
              readOnly
              value={isArabic ? EGYPT_COUNTRY.ar : EGYPT_COUNTRY.en}
              className="w-full bg-muted/50 border rounded px-3 py-2 outline-none cursor-not-allowed text-muted-foreground"
            />
          </div>

          {/* State (المحافظة) */}
          <div>
            <label className="block text-sm font-bold mb-2">
              {isArabic ? "المحافظة" : "State / Governorate"} <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.governorate}
              onChange={(e) => handleInputChange("governorate", e.target.value)}
              className={`w-full bg-background border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.governorate ? "border-destructive ring-1 ring-destructive" : "border-border"
              }`}
            >
              <option value="">
                {isArabic ? "اختر المحافظة..." : "Select state..."}
              </option>
              {EGYPT_STATES.map((state) => (
                <option key={state.en} value={state.en}>
                  {isArabic ? state.ar : state.en}
                </option>
              ))}
            </select>
            {errors.governorate && (
              <p className="text-xs text-destructive mt-1">{errors.governorate}</p>
            )}
          </div>

          {/* City - من الداتا حسب المحافظة */}
          <div>
            <label className="block text-sm font-bold mb-2">
              {isArabic ? "المدينة" : "City"} <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              disabled={!formData.governorate}
              className={`w-full bg-background border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.city ? "border-destructive ring-1 ring-destructive" : "border-border"
              }`}
            >
              <option value="">
                {formData.governorate
                  ? (isArabic ? "اختر المدينة..." : "Select city...")
                  : (isArabic ? "اختر المحافظة أولاً" : "Select state first")}
              </option>
              {getCitiesByState(formData.governorate).map((city) => (
                <option key={city.en} value={city.en}>
                  {isArabic ? city.ar : city.en}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-xs text-destructive mt-1">{errors.city}</p>
            )}
          </div>

          {/* Delivery & Total Summary */}
          {formData.city.trim() && (
            <div className="neon-border pixel-corners bg-card/50 p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isArabic ? "سعر التوصيل:" : "Delivery:"}
                </span>
                <span className="font-bold">
                  {deliveryFee} {isArabic ? "جنيه" : "EGP"}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-bold">
                <span>{isArabic ? "الإجمالي النهائي:" : "Total with delivery:"}</span>
                <span className="text-accent">{totalWithDelivery} {isArabic ? "جنيه" : "EGP"}</span>
              </div>
            </div>
          )}

          {/* Apartment / Street Address */}
          <div>
            <label className="block text-sm font-bold mb-2">
              {isArabic ? "العنوان بالتفصيل" : "Detailed Address"} <span className="text-destructive">*</span>
            </label>
            <textarea
              value={formData.apartment}
              onChange={(e) => handleInputChange("apartment", e.target.value)}
              rows={3}
              className={`w-full bg-background border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                errors.apartment ? "border-destructive ring-1 ring-destructive" : "border-border"
              }`}
              placeholder={isArabic ? "رقم الشقة، رقم المبنى، اسم الشارع..." : "Apartment, Building, Street..."}
            />
            {errors.apartment && (
              <p className="text-xs text-destructive mt-1">{errors.apartment}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-bold mb-2">
              {isArabic ? "طريقة الدفع" : "Payment Method"} <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Cash on Delivery */}
              <label
                className={`neon-border pixel-corners p-4 cursor-pointer transition-all hover:scale-105 ${
                  formData.paymentMethod === "cash"
                    ? "bg-primary/20 border-primary ring-2 ring-primary"
                    : "bg-card/50 hover:bg-card/70"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === "cash"}
                  onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMethod === "cash"
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}>
                    {formData.paymentMethod === "cash" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-background"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm md:text-base">
                      💵 {isArabic ? "الدفع عند الاستلام" : "Cash on Delivery"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isArabic ? "ادفع عند وصول الطلب" : "Pay when order arrives"}
                    </p>
                  </div>
                </div>
              </label>

              {/* InstaPay */}
              <label
                className={`neon-border pixel-corners p-4 cursor-pointer transition-all hover:scale-105 ${
                  formData.paymentMethod === "instapay"
                    ? "bg-primary/20 border-primary ring-2 ring-primary"
                    : "bg-card/50 hover:bg-card/70"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="instapay"
                  checked={formData.paymentMethod === "instapay"}
                  onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMethod === "instapay"
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}>
                    {formData.paymentMethod === "instapay" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-background"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm md:text-base">
                      📱 {isArabic ? "انستاباي" : "InstaPay"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isArabic ? "دفع فوري وآمن" : "Instant & secure payment"}
                    </p>
                  </div>
                </div>
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="text-xs text-destructive mt-1">{errors.paymentMethod}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            {hasSavedData && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleClearSavedData}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                {isArabic ? "🗑️ مسح البيانات المحفوظة" : "🗑️ Clear Saved Data"}
              </Button>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 pixel-corners"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                className="flex-1 arcade-button bg-secondary text-secondary-foreground hover:bg-secondary/90 pixel-corners"
              >
                {isArabic ? "تأكيد وإرسال الطلب" : "Confirm & Send Order"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
