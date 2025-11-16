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
  es: {
    translation: {
      title: "EDICIÓN ARCADE",
      subtitle: "COLECCIÓN RETRO GAMING",
      selectSize: "SELECCIONAR TALLA",
      addToCart: "INSERTAR MONEDA",
      price: "$29.99",
      description: "Camiseta de calidad premium con diseño exclusivo arcade retro. 100% algodón, gráficos serigrafiados.",
      features: {
        quality: "Algodón Premium",
        design: "Diseño Exclusivo",
        comfort: "Ultra Cómoda"
      },
      sizes: {
        s: "PEQUEÑA",
        m: "MEDIANA",
        l: "GRANDE",
        xl: "X-GRANDE",
        xxl: "XX-GRANDE"
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
