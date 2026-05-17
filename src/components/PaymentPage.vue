<template>
  <section class="screen pay-screen" :class="{ rtl: locale === 'ar' }" :aria-label="copy.checkoutTitle">
    <section class="pay-hero">
      <div>
        <p>{{ copy.checkoutEyebrow }}</p>
        <h2>{{ copy.checkoutTitle }}</h2>
      </div>
      <strong>{{ formatCurrency(total, locale) }}</strong>
    </section>

    <section class="mini-product">
      <img :src="order.product.image" :alt="copy.productName" />
      <div>
        <span>{{ order.product.sku }}</span>
        <h3>{{ copy.productName }}</h3>
      </div>
    </section>

    <section class="pay-breakdown" :aria-label="copy.summary">
      <div>
        <span>{{ copy.subTotal }}</span>
        <strong>{{ formatCurrency(order.subTotal, locale) }}</strong>
      </div>
      <div>
        <span>{{ copy.vat }}</span>
        <strong>{{ formatCurrency(vat, locale) }}</strong>
      </div>
      <div class="surcharge-line">
        <span>{{ copy.surcharge }}</span>
        <strong>{{ formatCurrency(order.surcharge, locale) }}</strong>
      </div>
      <div class="total-line">
        <span>{{ copy.totalDue }}</span>
        <strong>{{ formatCurrency(total, locale) }}</strong>
      </div>
      <p>{{ copy.formula }}</p>
    </section>

    <section class="miles-panel" :aria-label="copy.rewardLabel">
      <div>
        <p>{{ copy.rewardLabel }}</p>
        <strong>{{ formatNumber(order.milesRewarded, locale) }}</strong>
      </div>
      <span>{{ copy.rewardNote }}</span>
    </section>

    <footer class="payment-notes">
      <p>{{ copy.securityNote }}</p>
      <span>{{ copy.walletNote }}</span>
    </footer>

    <div v-if="paymentStatus !== 'idle'" class="payment-feedback" :class="paymentStatus" role="status">
      {{ feedbackMessage }}
    </div>

    <button class="pay-button" type="button" :disabled="paymentStatus === 'processing'" @click="simulatePayment">
      <span>{{ buttonLabel }}</span>
      <strong>{{ formatCurrency(total, locale) }}</strong>
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { AppCopy } from "../util/copy";
import { formatCurrency, formatNumber, getTotal, getVat, order, type Locale } from "../util/order";

const emit = defineEmits<{
  (event: "pay-now"): void;
}>();

type PaymentStatus = "idle" | "processing" | "success" | "failed";

const props = defineProps<{
  locale: Locale;
  copy: AppCopy;
}>();

const paymentStatus = ref<PaymentStatus>("idle");
const vat = getVat();
const total = getTotal();

const feedbackMessage = computed(() => {
  if (paymentStatus.value === "processing") return props.copy.paymentProcessing;
  if (paymentStatus.value === "success") return props.copy.paymentSuccessNotice;
  if (paymentStatus.value === "failed") return props.copy.paymentFailureNotice;
  return "";
});

const buttonLabel = computed(() =>
  paymentStatus.value === "processing" ? props.copy.paymentProcessing : props.copy.confirmPay,
);

function simulatePayment() {
  paymentStatus.value = "processing";

  window.setTimeout(() => {
    const isSuccess = Math.random() >= 0.5;
    paymentStatus.value = isSuccess ? "success" : "failed";

    if (isSuccess) {
      window.setTimeout(() => emit("pay-now"), 850);
    }
  }, 850);
}
</script>

<style scoped>
.pay-screen {
  display: grid;
  gap: 16px;
}

.pay-screen.rtl {
  text-align: right;
}

.pay-hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: end;
  padding: 20px;
  border-radius: 26px;
  color: #fff;
  background: var(--red);
}

.pay-hero p {
  margin: 0 0 5px;
  opacity: 0.78;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.pay-hero h2 {
  margin: 0;
  font-size: 1.55rem;
  line-height: 1.05;
}

.rtl .pay-hero h2 {
  line-height: 1.3;
}

.pay-hero strong {
  font-size: 1.45rem;
  white-space: nowrap;
}

.mini-product,
.pay-breakdown,
.miles-panel {
  border: 1px solid var(--line);
  border-radius: 24px;
  background: #fff;
}

.miles-panel p {
  margin: 0 0 4px;
  color: var(--muted);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.mini-product {
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px;
}

.mini-product img {
  width: 58px;
  border-radius: 16px;
  background: var(--soft-blue);
}

.mini-product span {
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
}

.mini-product h3 {
  margin: 4px 0 0;
  font-size: 0.98rem;
}

.pay-breakdown {
  display: grid;
  gap: 11px;
  padding: 16px;
}

.pay-breakdown div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: var(--muted);
  font-size: 0.9rem;
}

.pay-breakdown strong {
  color: var(--ink);
}

.pay-breakdown .surcharge-line {
  padding: 11px;
  border: 1px solid rgba(0, 60, 161, 0.16);
  border-radius: 16px;
  color: var(--red);
  background: #f8fafc;
  font-weight: 900;
}

.pay-breakdown .surcharge-line strong {
  color: var(--red);
}

.total-line {
  padding-top: 11px;
  border-top: 1px dashed #d7dce5;
}

.total-line span,
.total-line strong {
  color: var(--ink);
  font-size: 1.05rem;
  font-weight: 800;
}

.pay-breakdown p {
  margin: 0;
  padding: 10px 12px;
  border-radius: 14px;
  color: var(--blue);
  background: var(--soft-blue);
  font-size: 0.76rem;
  font-weight: 800;
}

.miles-panel {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  padding: 16px 18px;
  background: var(--soft-blue);
}

.miles-panel strong {
  display: block;
  color: var(--blue);
  font-size: 1.75rem;
  line-height: 1;
}

.miles-panel > span {
  max-width: 150px;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.35;
  text-align: end;
}

.payment-feedback {
  padding: 13px 14px;
  border-radius: 16px;
  color: var(--blue);
  background: var(--soft-blue);
  font-size: 0.86rem;
  font-weight: 900;
  line-height: 1.35;
  text-align: center;
}

.payment-feedback.success {
  color: #027a48;
  background: #ecfdf3;
}

.payment-feedback.failed {
  color: var(--red);
  background: var(--soft-red);
}

.pay-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  width: 100%;
  border: 0;
  border-radius: 20px;
  padding: 17px 18px;
  color: #fff;
  background: var(--blue);
  box-shadow: 0 18px 36px rgba(0, 60, 161, 0.24);
  cursor: pointer;
}

.pay-button:disabled {
  cursor: wait;
  opacity: 0.76;
}

.pay-button span,
.pay-button strong {
  font-size: 1rem;
  font-weight: 900;
}

.payment-notes {
  display: grid;
  gap: 6px;
  color: var(--muted);
  text-align: center;
  font-size: 0.78rem;
  line-height: 1.4;
}

.payment-notes p {
  margin: 0;
  color: var(--blue);
  font-weight: 900;
}

.payment-notes span {
  display: block;
}

.rtl .pay-hero,
.rtl .pay-breakdown div,
.rtl .pay-button,
.rtl .miles-panel {
  flex-direction: row-reverse;
}

.rtl .mini-product {
  grid-template-columns: 1fr 58px;
}

.rtl .mini-product img {
  grid-column: 2;
}

.rtl .mini-product div {
  grid-column: 1;
  grid-row: 1;
}

.rtl .pay-hero p,
.rtl .miles-panel p {
  letter-spacing: 0;
}

.rtl .payment-notes {
  text-align: right;
}
</style>
