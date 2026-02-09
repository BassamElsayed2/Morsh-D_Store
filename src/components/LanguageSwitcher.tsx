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
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="arcade-button bg-card text-primary font-bold uppercase tracking-wider"
    >
      {i18n.language === "en" ? "عربي" : "EN"}
    </Button>
  );
});

LanguageSwitcher.displayName = "LanguageSwitcher";
