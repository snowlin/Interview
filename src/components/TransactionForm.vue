<script setup lang="ts">
import { ref } from 'vue';
import { t } from '../util/i18n';
import type { MerchantType, PaymentMethod, TransactionInput } from '../util/miles';

const emit = defineEmits<{
  (e: 'submit', transaction: TransactionInput): void
}>();

const amount = ref<number | ''>('');
const merchantType = ref<MerchantType>('restaurant');
const paymentMethod = ref<PaymentMethod>('visa');

const handleSubmit = () => {
  if (amount.value && amount.value > 0) {
    emit('submit', {
      amount: Number(amount.value),
      merchantType: merchantType.value,
      paymentMethod: paymentMethod.value
    });
    amount.value = '';
  }
};
</script>

<template>
  <div class="lux-card form-section">
    <h2>{{ t('Add Transaction', 'إضافة معاملة') }}</h2>
    <form @submit.prevent="handleSubmit" class="transaction-form">
      <div class="form-group amount-group">
        <label>{{ t('Amount', 'المبلغ') }}</label>
        <div class="input-wrapper">
          <span class="currency">SAR</span>
          <input type="number" v-model="amount" min="1" step="0.01" required placeholder="0.00" class="lux-input" />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>{{ t('Merchant Type', 'نوع التاجر') }}</label>
          <div class="select-wrapper">
            <select v-model="merchantType" class="lux-select">
              <option value="restaurant">{{ t('Restaurant', 'مطعم') }}</option>
              <option value="entertainment">{{ t('Entertainment', 'ترفيه') }}</option>
              <option value="supermarket">{{ t('Supermarket', 'سوبر ماركت') }}</option>
              <option value="pharmacy">{{ t('Pharmacy', 'صيدلية') }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('Payment', 'الدفع') }}</label>
          <div class="select-wrapper">
            <select v-model="paymentMethod" class="lux-select">
              <option value="visa">{{ t('Visa', 'فيزا') }}</option>
              <option value="mastercard">{{ t('MasterCard', 'ماستركارد') }}</option>
              <option value="mada">{{ t('Mada', 'مدى') }}</option>
              <option value="cash">{{ t('Cash', 'نقد') }}</option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit" class="lux-btn-primary">
        <span>{{ t('Add Transaction', 'إضافة معاملة') }}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </form>
  </div>
</template>

<style scoped>
.form-section {
  padding: 24px;
  margin-bottom: 32px;
}

.form-section h2 {
  margin-top: 0;
  font-size: 1.1rem;
  color: var(--lux-primary);
  margin-bottom: 24px;
  font-weight: 700;
}

.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--lux-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency {
  position: absolute;
  left: 0;
  color: var(--lux-muted);
  font-weight: 600;
  font-size: 1.1rem;
}

[dir="rtl"] .currency {
  left: auto;
  right: 0;
}

.lux-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid var(--lux-border);
  background: transparent;
  padding: 8px 0 8px 48px;
  font-size: 2rem;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  color: var(--lux-text);
  transition: border-color 0.3s;
  outline: none;
}

[dir="rtl"] .lux-input {
  padding: 8px 48px 8px 0;
}

.lux-input:focus {
  border-bottom-color: var(--lux-primary);
}

.lux-input::placeholder {
  color: #d1d5db;
}

.select-wrapper {
  position: relative;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--lux-border);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.select-wrapper:focus-within {
  border-color: var(--lux-primary);
  box-shadow: 0 0 0 3px rgba(0, 40, 104, 0.1);
}

.lux-select {
  width: 100%;
  appearance: none;
  background: transparent;
  border: none;
  padding: 12px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--lux-text);
  outline: none;
  cursor: pointer;
}

.select-wrapper::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 6px;
  background-color: var(--lux-muted);
  clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  pointer-events: none;
}

[dir="rtl"] .select-wrapper::after {
  right: auto;
  left: 16px;
}

.lux-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--lux-primary), #0047b3);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 16px -4px rgba(0, 40, 104, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 8px;
}

.lux-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px -4px rgba(0, 40, 104, 0.4);
}

.lux-btn-primary:active {
  transform: translateY(0);
}
</style>
