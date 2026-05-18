<template>
  <section class="screen summary-screen" :class="{ rtl: locale === 'ar' }" :aria-label="copy.title">
    <section class="success-panel" :aria-label="copy.success">
      <div class="success-mark" aria-hidden="true">✓</div>
      <div>
        <p>{{ copy.success }}</p>
        <strong>{{ formatCurrency(total, locale, currency) }}</strong>
        <span>{{ copy.paidWith }}</span>
      </div>
    </section>

    <section class="product-strip" :aria-label="copy.productLabel">
      <img :src="order.product.image" :alt="copy.productName" />
      <div class="product-copy">
        <p>{{ copy.productLabel }}</p>
        <h2>{{ copy.productName }}</h2>
        <span>{{ copy.productMeta }}</span>
      </div>
      <strong>{{ formatCurrency(subTotal, locale, currency) }}</strong>
    </section>

    <section class="milestones" :aria-label="copy.milestones">
      <div
        v-for="(step, index) in copy.steps"
        :key="step"
        class="milestone"
        :class="{ current: index === copy.steps.length - 1 }"
      >
        <span aria-hidden="true"></span>
        <p>{{ step }}</p>
      </div>
    </section>

    <section class="summary-card" :aria-label="copy.summary">
      <div class="summary-heading">
        <div>
          <p>{{ copy.summary }}</p>
          <h2>{{ copy.totalDue }}</h2>
        </div>
        <strong :class="{ mismatch: amountIssues.length > 0 }">{{ formatCurrency(total, locale, currency) }}</strong>
      </div>

      <dl class="amount-list">
        <div>
          <dt>{{ copy.subTotal }}</dt>
          <dd>{{ formatCurrency(subTotal, locale, currency) }}</dd>
        </div>
        <div>
          <dt>{{ copy.vat }}</dt>
          <dd>{{ formatCurrency(vat, locale, currency) }}</dd>
        </div>
        <div class="surcharge-row">
          <dt>{{ copy.surcharge }}</dt>
          <dd>{{ formatCurrency(surcharge, locale, currency) }}</dd>
        </div>
      </dl>

      <div v-if="amountIssues.length > 0" class="total-alert" role="alert">
        <strong>Amount check needs attention</strong>
        <ul>
          <li v-for="issue in amountIssues" :key="issue">{{ issue }}</li>
        </ul>
      </div>

      <div class="formula">
        <span>{{ copy.formula }}</span>
        <strong>
          {{ formatCurrency(subTotal, locale, currency) }} + {{ formatCurrency(vat, locale, currency) }} +
          {{ formatCurrency(surcharge, locale, currency) }}
        </strong>
      </div>
    </section>

    <section class="reward-panel" :aria-label="copy.rewardLabel">
      <div>
        <p>{{ copy.rewardLabel }}</p>
        <strong>{{ formatNumber(order.milesRewarded, locale) }}</strong>
      </div>
      <span>{{ copy.rewardNote }}</span>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { AppCopy } from "../util/copy";
import { dictionary } from "../util/copy";
import { formatCurrency, formatNumber, order, VAT_RATE, type Locale } from "../util/order";

const props = withDefaults(
  defineProps<{
    subTotal: number;
    surcharge: number;
    expectedTotal: number;
    currency?: string;
    tolerance?: number;
    locale?: Locale;
    copy?: AppCopy;
  }>(),
  {
    currency: "SAR",
    tolerance: 0.005,
    locale: "en",
  },
);

const locale = computed(() => props.locale);
const copy = computed(() => props.copy ?? dictionary[props.locale]);
const subTotal = computed(() => props.subTotal);
const surcharge = computed(() => props.surcharge);
const currency = computed(() => props.currency);
const vat = computed(() => props.subTotal * VAT_RATE);
const total = computed(() => props.subTotal + vat.value + props.surcharge);
const isValidAmount = (amount: number) => Number.isFinite(amount) && amount >= 0;
const missingExpectedTotal = computed(
  () => props.expectedTotal === undefined || props.expectedTotal === null || Number.isNaN(props.expectedTotal),
);
const hasDiscrepancy = computed(
  () => !missingExpectedTotal.value && Math.abs(total.value - props.expectedTotal) > props.tolerance,
);
const formattedExpectedTotal = computed(() =>
  missingExpectedTotal.value ? "" : formatCurrency(props.expectedTotal, props.locale, props.currency),
);
const amountIssues = computed(() => {
  const issues: string[] = [];

  if (!isValidAmount(props.subTotal)) {
    issues.push("Sub Total must be a valid non-negative amount.");
  }

  if (!isValidAmount(props.surcharge)) {
    issues.push("Surcharge must be a valid non-negative amount.");
  }

  if (!Number.isFinite(props.tolerance) || props.tolerance < 0) {
    issues.push("Tolerance must be a valid non-negative number.");
  }

  if (missingExpectedTotal.value) {
    issues.push("expectedTotal is required to validate the payment total.");
  } else if (!isValidAmount(props.expectedTotal)) {
    issues.push("expectedTotal must be a valid non-negative amount.");
  } else if (hasDiscrepancy.value) {
    issues.push(
      `Expected ${formattedExpectedTotal.value}, calculated ${formatCurrency(
        total.value,
        props.locale,
        props.currency,
      )}. Difference exceeds tolerance ${props.tolerance}.`,
    );
  }

  return issues;
});
</script>

<style scoped>
.screen {
  display: grid;
  gap: 16px;
}

.screen.rtl {
  text-align: right;
}

.success-panel {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 14px;
  align-items: center;
  padding: 24px;
  color: #fff;
  border-radius: 26px;
  background: linear-gradient(135deg, var(--blue) 0%, #002868 100%);
  box-shadow: 0 12px 36px rgba(0, 60, 161, 0.25);
}

.success-panel::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at top left, rgba(255,255,255,0.15) 0%, transparent 60%);
  pointer-events: none;
}

.rtl .success-panel {
  grid-template-columns: 1fr 64px;
}

.rtl .success-mark {
  grid-column: 2;
  grid-row: 1;
}

.rtl .success-panel > div:last-child {
  grid-column: 1;
  grid-row: 1;
}

.success-mark {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: 50%;
  color: var(--blue);
  background: #fff;
  font-size: 1.2rem;
  font-weight: 900;
}

.success-panel p {
  margin: 0 0 6px;
  opacity: 0.84;
  font-size: 0.86rem;
}

.success-panel strong {
  display: block;
  font-family: 'Outfit', sans-serif;
  font-size: clamp(1.8rem, 9vw, 2.75rem);
  font-weight: 800;
  line-height: 1;
}

.rtl .success-panel strong {
  line-height: 1.25;
}

.success-panel span {
  display: block;
  margin-top: 8px;
  opacity: 0.82;
  font-size: 0.82rem;
}

.product-strip,
.summary-card,
.reward-panel {
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 25, 79, 0.04);
}

.product-strip {
  display: grid;
  grid-template-columns: 78px 1fr auto;
  gap: 13px;
  align-items: center;
  padding: 12px;
  border-radius: 22px;
}

.product-strip img {
  width: 78px;
  aspect-ratio: 1;
  border-radius: 18px;
  background: var(--soft-blue);
}

.product-copy {
  min-width: 0;
}

.product-copy p,
.summary-heading p,
.reward-panel p {
  margin: 0 0 4px;
  color: var(--muted);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.product-copy h2 {
  margin: 0;
  font-family: 'Outfit', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.2;
}

.product-copy span {
  display: block;
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.35;
}

.product-strip > strong {
  align-self: start;
  color: var(--blue);
  font-family: 'Outfit', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  white-space: nowrap;
}

.rtl .product-strip {
  grid-template-columns: auto 1fr 78px;
}

.rtl .product-strip img {
  grid-column: 3;
  grid-row: 1;
}

.rtl .product-copy {
  grid-column: 2;
  grid-row: 1;
}

.rtl .product-strip > strong {
  grid-column: 1;
  grid-row: 1;
}

.milestones {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 12px 0 0;
}

.milestones::before {
  position: absolute;
  top: 19px;
  inset-inline: 16%;
  height: 2px;
  content: "";
  background: var(--blue);
}

.rtl .milestones::before {
  background: var(--blue);
}

.milestone {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 8px;
  text-align: center;
}

.milestone span {
  width: 16px;
  height: 16px;
  border: 3px solid #fff;
  border-radius: 50%;
  background: var(--blue);
  box-shadow: 0 0 0 2px rgba(0, 60, 161, 0.18);
}

.milestone.current span {
  background: var(--red);
  box-shadow: 0 0 0 2px rgba(186, 0, 48, 0.2);
}

.milestone p {
  margin: 0;
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1.25;
}

.summary-card {
  padding: 18px;
  border-radius: 24px;
}

.summary-heading {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: start;
  padding-bottom: 14px;
  border-bottom: 1px dashed #d7dce5;
}

.summary-heading h2 {
  margin: 0;
  font-family: 'Outfit', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
}

.summary-heading strong {
  color: var(--ink);
  font-family: 'Outfit', sans-serif;
  font-size: 1.35rem;
  font-weight: 800;
  white-space: nowrap;
}

.summary-heading strong.mismatch {
  color: #b42318;
}

.amount-list {
  display: grid;
  gap: 12px;
  margin: 16px 0;
}

.amount-list div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.amount-list dt {
  color: var(--muted);
  font-size: 0.9rem;
}

.amount-list dd {
  margin: 0;
  font-family: 'Outfit', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
}

.surcharge-row {
  padding: 12px;
  border: 1px solid rgba(0, 60, 161, 0.16);
  border-radius: 16px;
  background: #f8fafc;
}

.surcharge-row dt {
  color: var(--red);
  font-weight: 900;
}

.surcharge-row dd {
  color: var(--red);
}

.total-alert {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid rgba(180, 35, 24, 0.18);
  border-radius: 16px;
  color: #b42318;
  background: #fff3f1;
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.45;
}

.total-alert strong {
  color: #912018;
}

.total-alert ul {
  display: grid;
  gap: 4px;
  margin: 0;
  padding-inline-start: 18px;
}

.formula {
  display: grid;
  gap: 7px;
  padding: 12px;
  border-radius: 16px;
  color: #173261;
  background: var(--soft-blue);
  font-size: 0.78rem;
  line-height: 1.4;
}

.formula strong {
  color: var(--blue);
}

.reward-panel {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  padding: 16px 18px;
  border-radius: 24px;
  background: var(--soft-blue);
}

.rtl .reward-panel {
  background: var(--soft-blue);
  flex-direction: row-reverse;
}

.reward-panel strong {
  display: block;
  color: var(--blue);
  font-family: 'Outfit', sans-serif;
  font-size: 1.85rem;
  font-weight: 800;
  line-height: 1;
}

.reward-panel span {
  max-width: 142px;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.35;
  text-align: end;
}

@media (max-width: 370px) {
  .product-strip {
    grid-template-columns: 68px 1fr;
  }

  .product-strip img {
    width: 68px;
  }

  .product-strip > strong {
    grid-column: 2;
    grid-row: 2;
  }

  .rtl .product-strip {
    grid-template-columns: 1fr 68px;
  }

  .rtl .product-strip img {
    grid-column: 2;
  }

  .rtl .product-copy {
    grid-column: 1;
  }

  .rtl .product-strip > strong {
    grid-column: 1;
    grid-row: 2;
  }
}
</style>
