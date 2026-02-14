/**
 * بيانات مصر فقط: الدولة، المحافظات (State)، والمدن (City)
 */

export interface LocaleOption {
  en: string;
  ar: string;
}

export const EGYPT_COUNTRY: LocaleOption = { en: "Egypt", ar: "مصر" };

export interface EgyptCity extends LocaleOption {}

export interface EgyptState extends LocaleOption {
  cities: EgyptCity[];
}

/** محافظات ومدن مصر */
export const EGYPT_STATES: EgyptState[] = [
  {
    en: "Cairo",
    ar: "القاهرة",
    cities: [
      { en: "Cairo", ar: "القاهرة" },
      { en: "Nasr City", ar: "مدينة نصر" },
      { en: "Heliopolis", ar: "هليوبوليس" },
      { en: "Maadi", ar: "المعادي" },
      { en: "Dokki", ar: "الدقي" },
      { en: "Giza", ar: "الجيزة" },
      { en: "6th October", ar: "السادس من أكتوبر" },
      { en: "Shorouk", ar: "الشروق" },
      { en: "New Cairo", ar: "القاهرة الجديدة" },
      { en: "Badr", ar: "بدر" },
    ],
  },
  {
    en: "Giza",
    ar: "الجيزة",
    cities: [
      { en: "Giza", ar: "الجيزة" },
      { en: "6th October", ar: "السادس من أكتوبر" },
      { en: "Sheikh Zayed", ar: "الشيخ زايد" },
      { en: "Haram", ar: "الهرم" },
      { en: "Faisal", ar: "فيصل" },
      { en: "Imbaba", ar: "إمبابة" },
      { en: "Agouza", ar: "العجوزة" },
    ],
  },
  {
    en: "Alexandria",
    ar: "الإسكندرية",
    cities: [
      { en: "Alexandria", ar: "الإسكندرية" },
      { en: "Borg El Arab", ar: "برج العرب" },
      { en: "Montaza", ar: "المنتزه" },
      { en: "Smouha", ar: "سموحة" },
      { en: "Miami", ar: "ميامي" },
      { en: "Sidi Gaber", ar: "سيدي جابر" },
    ],
  },
  {
    en: "Gharbiya",
    ar: "الغربية",
    cities: [
      { en: "Tanta", ar: "طنطا" },
      { en: "El Mahalla El Kubra", ar: "المحلة الكبرى" },
      { en: "Kafr El Zayat", ar: "كفر الزيات" },
      { en: "Zefta", ar: "زفتى" },
      { en: "Samanoud", ar: "سمنود" },
      { en: "Basyoun", ar: "بسيون" },
      { en: "Kotoor", ar: "قطور" },
    ],
  },
  {
    en: "Dakahlia",
    ar: "الدقهلية",
    cities: [
      { en: "Mansoura", ar: "المنصورة" },
      { en: "Talkha", ar: "طلخا" },
      { en: "Mit Ghamr", ar: "ميت غمر" },
      { en: "Belqas", ar: "بلقاس" },
      { en: "Dekernes", ar: "دكرنس" },
    ],
  },
  {
    en: "Beheira",
    ar: "البحيرة",
    cities: [
      { en: "Damanhur", ar: "دمنهور" },
      { en: "Kafr El Dawwar", ar: "كفر الدوار" },
      { en: "Rashid", ar: "رشيد" },
      { en: "Edku", ar: "إدكو" },
      { en: "Abu El Matamir", ar: "أبو المطامير" },
    ],
  },
  {
    en: "Menofia",
    ar: "المنوفية",
    cities: [
      { en: "Shibin El Kom", ar: "شبين الكوم" },
      { en: "Menouf", ar: "منوف" },
      { en: "Ashmoun", ar: "أشمون" },
      { en: "Quesna", ar: "قويسنا" },
      { en: "Sadat City", ar: "مدينة السادات" },
    ],
  },
  {
    en: "Sharqia",
    ar: "الشرقية",
    cities: [
      { en: "Zagazig", ar: "الزقازيق" },
      { en: "10th of Ramadan", ar: "العاشر من رمضان" },
      { en: "Belbeis", ar: "بلبيس" },
      { en: "Minya El Qamh", ar: "منيا القمح" },
      { en: "Faquus", ar: "فاقوس" },
    ],
  },
  {
    en: "Qaliubiya",
    ar: "القليوبية",
    cities: [
      { en: "Banha", ar: "بنها" },
      { en: "Qalyub", ar: "قليوب" },
      { en: "Shubra El Kheima", ar: "شبرا الخيمة" },
      { en: "Khanka", ar: "الخانكة" },
      { en: "Obour", ar: "العاشر من رمضان" },
    ],
  },
  {
    en: "Ismailia",
    ar: "الإسماعيلية",
    cities: [
      { en: "Ismailia", ar: "الإسماعيلية" },
      { en: "Fayed", ar: "فايد" },
      { en: "Qantara", ar: "القنطرة" },
      { en: "Abu Suweir", ar: "أبو صوير" },
    ],
  },
  {
    en: "Suez",
    ar: "السويس",
    cities: [
      { en: "Suez", ar: "السويس" },
      { en: "Ain Sokhna", ar: "العين السخنة" },
      { en: "Faisal", ar: "فيصل" },
    ],
  },
  {
    en: "Port Said",
    ar: "بورسعيد",
    cities: [
      { en: "Port Said", ar: "بورسعيد" },
      { en: "Port Fouad", ar: "بورفؤاد" },
    ],
  },
  {
    en: "Damietta",
    ar: "دمياط",
    cities: [
      { en: "Damietta", ar: "دمياط" },
      { en: "Ras El Bar", ar: "رأس البر" },
      { en: "Kafr Saad", ar: "كفر سعد" },
    ],
  },
  {
    en: "Red Sea",
    ar: "البحر الأحمر",
    cities: [
      { en: "Hurghada", ar: "الغردقة" },
      { en: "Marsa Alam", ar: "مرسى علم" },
      { en: "Safaga", ar: "سفاجا" },
      { en: "El Qoseir", ar: "القصير" },
    ],
  },
  {
    en: "Fayoum",
    ar: "الفيوم",
    cities: [
      { en: "Fayoum", ar: "الفيوم" },
      { en: "Tamiya", ar: "طامية" },
      { en: "Senouras", ar: "سنورس" },
    ],
  },
  {
    en: "Beni Suef",
    ar: "بني سويف",
    cities: [
      { en: "Beni Suef", ar: "بني سويف" },
      { en: "Nasser", ar: "ناصر" },
      { en: "Biba", ar: "ببا" },
    ],
  },
  {
    en: "Minya",
    ar: "المنيا",
    cities: [
      { en: "Minya", ar: "المنيا" },
      { en: "Maghagha", ar: "مغاغة" },
      { en: "Samalut", ar: "سمالوط" },
      { en: "Malawi", ar: "ملوي" },
    ],
  },
  {
    en: "Assiut",
    ar: "أسيوط",
    cities: [
      { en: "Assiut", ar: "أسيوط" },
      { en: "Dayrout", ar: "ديروط" },
      { en: "Manfalut", ar: "منفلوط" },
      { en: "Abnub", ar: "أبنوب" },
    ],
  },
  {
    en: "Sohag",
    ar: "سوهاج",
    cities: [
      { en: "Sohag", ar: "سوهاج" },
      { en: "Akhmim", ar: "أخميم" },
      { en: "Girga", ar: "جرجا" },
      { en: "Tema", ar: "طما" },
    ],
  },
  {
    en: "Qena",
    ar: "قنا",
    cities: [
      { en: "Qena", ar: "قنا" },
      { en: "Luxor", ar: "الأقصر" },
      { en: "Qus", ar: "قوص" },
      { en: "Naqada", ar: "نقادة" },
    ],
  },
  {
    en: "Luxor",
    ar: "الأقصر",
    cities: [
      { en: "Luxor", ar: "الأقصر" },
      { en: "Esna", ar: "إسنا" },
      { en: "Armant", ar: "أرمنت" },
    ],
  },
  {
    en: "Aswan",
    ar: "أسوان",
    cities: [
      { en: "Aswan", ar: "أسوان" },
      { en: "Kom Ombo", ar: "كوم أمبو" },
      { en: "Edfu", ar: "إدفو" },
    ],
  },
  {
    en: "Kafr El Sheikh",
    ar: "كفر الشيخ",
    cities: [
      { en: "Kafr El Sheikh", ar: "كفر الشيخ" },
      { en: "Desouk", ar: "دسوق" },
      { en: "Bila", ar: "بيلا" },
      { en: "Fuwa", ar: "فوه" },
    ],
  },
  {
    en: "North Sinai",
    ar: "شمال سيناء",
    cities: [
      { en: "El Arish", ar: "العريش" },
      { en: "Sheikh Zuweid", ar: "الشيخ زويد" },
      { en: "Rafah", ar: "رفح" },
    ],
  },
  {
    en: "South Sinai",
    ar: "جنوب سيناء",
    cities: [
      { en: "Sharm El Sheikh", ar: "شرم الشيخ" },
      { en: "Dahab", ar: "دهب" },
      { en: "Nuweiba", ar: "نويبع" },
      { en: "Saint Catherine", ar: "سانت كاترين" },
    ],
  },
  {
    en: "New Valley",
    ar: "الوادي الجديد",
    cities: [
      { en: "Kharga", ar: "الخارجة" },
      { en: "Dakhla", ar: "الداخلة" },
      { en: "Farafra", ar: "الفرافرة" },
    ],
  },
  {
    en: "Matrouh",
    ar: "مطروح",
    cities: [
      { en: "Marsa Matrouh", ar: "مرسى مطروح" },
      { en: "El Alamein", ar: "العلمين" },
      { en: "Siwa", ar: "سيوة" },
    ],
  },
];

export function getCitiesByState(stateEn: string): EgyptCity[] {
  const state = EGYPT_STATES.find((s) => s.en === stateEn);
  return state?.cities ?? [];
}
