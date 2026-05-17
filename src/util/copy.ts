import type { Locale } from "./order";

export interface AppCopy {
  appEyebrow: string;
  appTitle: string;
  summaryTab: string;
  paymentTab: string;
  languageLabel: string;
  back: string;
  receipt: string;
  title: string;
  success: string;
  paidWith: string;
  productLabel: string;
  productName: string;
  productMeta: string;
  milestones: string;
  steps: string[];
  summary: string;
  totalDue: string;
  subTotal: string;
  vat: string;
  surcharge: string;
  formula: string;
  rewardLabel: string;
  rewardNote: string;
  checkoutTitle: string;
  checkoutEyebrow: string;
  confirmPay: string;
  paymentProcessing: string;
  paymentSuccessNotice: string;
  paymentFailureNotice: string;
  walletNote: string;
  securityNote: string;
  processing: string;
}

export const dictionary: Record<Locale, AppCopy> = {
  en: {
    appEyebrow: "Mobile checkout",
    appTitle: "Order Payment",
    summaryTab: "Summary",
    paymentTab: "Pay",
    languageLabel: "Choose language",
    back: "Back to orders",
    receipt: "Secure receipt",
    title: "Payment Summary",
    success: "Payment successful",
    paidWith: "Paid with saved card ending in 4829",
    productLabel: "Travel item",
    productName: "AeroFlex Carry-On Suitcase",
    productMeta: "Matte navy · Cabin size · 2-year coverage",
    milestones: "Payment milestones",
    steps: ["Order placed", "Payment verified", "Miles issued"],
    summary: "Cost breakdown",
    totalDue: "Total paid",
    subTotal: "Sub Total",
    vat: "VAT (15%)",
    surcharge: "Surcharge",
    formula: "Total = Sub Total + VAT + Surcharge",
    rewardLabel: "Miles Rewarded",
    rewardNote: "Added to your loyalty wallet instantly",
    checkoutTitle: "Review Payment",
    checkoutEyebrow: "Payment checkout",
    confirmPay: "Pay now",
    paymentProcessing: "Processing payment...",
    paymentSuccessNotice: "Payment successful. Opening your order details...",
    paymentFailureNotice: "Payment failed. Please try again.",
    walletNote: "Miles will be issued after confirmation.",
    securityNote: "3D Secure enabled · encrypted payment session",
    processing: "Ready to process",
  },
  ar: {
    appEyebrow: "دفع عبر الجوال",
    appTitle: "دفع الطلب",
    summaryTab: "الملخص",
    paymentTab: "الدفع",
    languageLabel: "اختيار اللغة",
    back: "العودة إلى الطلبات",
    receipt: "إيصال آمن",
    title: "ملخص الدفع",
    success: "تم الدفع بنجاح",
    paidWith: "تم الدفع ببطاقة محفوظة تنتهي بـ 4829",
    productLabel: "منتج سفر",
    productName: "حقيبة سفر AeroFlex",
    productMeta: "أزرق داكن · مقاس مقصورة · ضمان سنتان",
    milestones: "مراحل الدفع",
    steps: ["تم إنشاء الطلب", "تم التحقق من الدفع", "تم إصدار الأميال"],
    summary: "تفاصيل التكلفة",
    totalDue: "الإجمالي المدفوع",
    subTotal: "المجموع الفرعي",
    vat: "ضريبة القيمة المضافة (15%)",
    surcharge: "رسوم إضافية",
    formula: "الإجمالي = المجموع الفرعي + الضريبة + الرسوم الإضافية",
    rewardLabel: "الأميال المكتسبة",
    rewardNote: "أضيفت فوراً إلى محفظة الولاء الخاصة بك",
    checkoutTitle: "مراجعة الدفع",
    checkoutEyebrow: "الدفع",
    confirmPay: "ادفع الآن",
    paymentProcessing: "جار معالجة الدفع...",
    paymentSuccessNotice: "تم الدفع بنجاح. جار فتح تفاصيل الطلب...",
    paymentFailureNotice: "فشل الدفع. يرجى المحاولة مرة أخرى.",
    walletNote: "سيتم إصدار الأميال بعد التأكيد.",
    securityNote: "3D Secure مفعل · جلسة دفع مشفرة",
    processing: "جاهز للمعالجة",
  },
};
