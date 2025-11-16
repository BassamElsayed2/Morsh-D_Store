import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: "ARCADE EDITION",
      subtitle: "RETRO GAMING COLLECTION",
      selectSize: "SELECT SIZE",
      addToCart: "INSERT COIN",
      price: "$29.99",
      description: "Premium quality t-shirt featuring exclusive retro arcade design. 100% cotton, screen-printed graphics.",
      brandName: "MORSH-D",
      features: {
        quality: "Premium Cotton",
        design: "Exclusive Design",
        comfort: "Ultra Comfortable"
      },
      sizes: {
        s: "SMALL",
        m: "MEDIUM",
        l: "LARGE",
        xl: "X-LARGE",
        xxl: "XX-LARGE"
      }
    }
  },
  ar: {
    translation: {
      title: "إصدار أركيد",
      subtitle: "مجموعة الألعاب الكلاسيكية",
      selectSize: "اختر المقاس",
      addToCart: "أدخل العملة",
      price: "$29.99",
      description: "قميص عالي الجودة يحتوي على تصميم أركيد حصري. 100% قطن، طباعة شاشة احترافية.",
      brandName: "مورش-دي",
      features: {
        quality: "قطن فاخر",
        design: "تصميم حصري",
        comfort: "مريح للغاية"
      },
      sizes: {
        s: "صغير",
        m: "وسط",
        l: "كبير",
        xl: "كبير جداً",
        xxl: "كبير جداً جداً"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
