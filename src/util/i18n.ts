import { ref, computed } from 'vue';
import type { LossReasonKey, MerchantType, PaymentMethod } from './miles';

export type Language = 'en' | 'ar';

export const activeLanguage = ref<Language>('en');

export const toggleLanguage = () => {
  activeLanguage.value = activeLanguage.value === 'en' ? 'ar' : 'en';
};

export const dir = computed(() => activeLanguage.value === 'ar' ? 'rtl' : 'ltr');

export const t = (enText: string, arText: string) => {
  return activeLanguage.value === 'en' ? enText : arText;
};

export const formatMerchantType = (merchantType: MerchantType) => {
  const labels: Record<MerchantType, { en: string; ar: string }> = {
    restaurant: { en: 'Restaurant', ar: 'مطعم' },
    entertainment: { en: 'Entertainment', ar: 'ترفيه' },
    supermarket: { en: 'Supermarket', ar: 'سوبر ماركت' },
    pharmacy: { en: 'Pharmacy', ar: 'صيدلية' },
  };

  return t(labels[merchantType].en, labels[merchantType].ar);
};

export const formatPaymentMethod = (paymentMethod: PaymentMethod) => {
  const labels: Record<PaymentMethod, { en: string; ar: string }> = {
    mada: { en: 'Mada', ar: 'مدى' },
    visa: { en: 'Visa', ar: 'فيزا' },
    mastercard: { en: 'Mastercard', ar: 'ماستركارد' },
    cash: { en: 'Cash', ar: 'نقد' },
  };

  return t(labels[paymentMethod].en, labels[paymentMethod].ar);
};

export const formatProfitState = (isLoss: boolean) => {
  return isLoss ? t('Loss', 'خسارة') : t('Profit', 'ربح');
};

export const formatLossReason = (reason: LossReasonKey) => {
  const labels: Record<LossReasonKey, { en: string; ar: string }> = {
    bonus_miles_loss: {
      en: 'High bonus miles caused reward cost to exceed revenue.',
      ar: 'تسببت مضاعفة الأميال في ارتفاع تكلفة المكافأة فوق الإيراد.',
    },
    reward_cost_loss: {
      en: 'Reward cost exceeded commission revenue.',
      ar: 'تجاوزت تكلفة المكافأة إيراد العمولات.',
    },
  };

  return t(labels[reason].en, labels[reason].ar);
};
