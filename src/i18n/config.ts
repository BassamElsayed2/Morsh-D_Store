import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      title: "DEMENTE BLACK ZIPUP JACKET",
      subtitle: "RETRO CLOTHING COLLECTION",
      selectSize: "SELECT SIZE",
      addToCart: "INSERT COIN",
      new: "NEW!",
      price: "1200 EGP",
      description:
        "Streetwear Premium zipup jacket , Slightly cropped , and boxy fit",
      brandName: "MORSH-D",
      features: {
        quality: "Premium Cotton",
        design: "Exclusive Design",
        comfort: "Ultra Comfortable",
      },
      sizes: {
        m: "MEDIUM",
        l: "LARGE",
        xl: "X-LARGE",
        xxl: "XX-LARGE",
      },
    },
  },
  ar: {
    translation: {
      title: "جاكيت ديمينتي الأسود بسوستة",
      subtitle: "مجموعة الملابس الكلاسيكية",
      selectSize: "اختر المقاس",
      addToCart: "أدخل العملة",
      new: "جديد!",
      price: "1200 ج.م",
      description: "جاكيت ديمينتي الأسود بسوستة , مغلف , ومريح",
      brandName: "Morsh-D",
      features: {
        quality: "قطن فاخر",
        design: "تصميم حصري",
        comfort: "مريح للغاية",
      },
      sizes: {
        m: "M",
        l: "Large",
        xl: "XL",
        xxl: "XXL",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
