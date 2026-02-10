import { memo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export const LanguageSwitcher = memo(() => {
  const { i18n } = useTranslation();

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  }, [i18n]);

  useEffect(() => {
    const isArabic = i18n.language === "ar";
    requestAnimationFrame(() => {
      const root = document.documentElement;
      root.dir = isArabic ? "rtl" : "ltr";
      root.lang = i18n.language;
    });
  }, [i18n.language]);

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="arcade-button bg-card text-primary font-bold uppercase tracking-wider min-w-[52px]"
    >
      {i18n.language === "en" ? "عربي" : "EN"}
    </Button>
  );
});

LanguageSwitcher.displayName = "LanguageSwitcher";
