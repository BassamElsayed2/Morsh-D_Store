import { useTranslation } from "react-i18next";

export const PromoBanner = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const text = isArabic
    ? "🛒 اشتري 2 و خد الشحن مجاني 🛒"
    : "🛒 Buy 2 and get FREE shipping 🛒";

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 w-full overflow-hidden bg-primary/20 text-primary border-b border-primary/40 py-2 md:py-2.5 text-sm md:text-base font-bold uppercase tracking-wider"
      aria-live="polite"
    >
      <div className="promo-marquee flex whitespace-nowrap">
        <span className="inline-block px-8">{text}</span>
        <span className="inline-block px-8" aria-hidden>
          {text}
        </span>
        <span className="inline-block px-8" aria-hidden>
          {text}
        </span>
        <span className="inline-block px-8" aria-hidden>
          {text}
        </span>
        <span className="inline-block px-8" aria-hidden>
          {text}
        </span>
      </div>
    </div>
  );
};
