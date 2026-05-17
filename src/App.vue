<template>
  <main class="app-shell" :dir="direction" :lang="activeLocale">
    <section class="phone-frame">
      <header class="app-header">
        <button class="back-button" type="button" :aria-label="copy.back" @click="goBack">
          <span aria-hidden="true">{{ isRtl ? ">" : "<" }}</span>
        </button>

        <div class="title-stack">
          <p>{{ copy.appEyebrow }}</p>
          <h1>{{ copy.appTitle }}</h1>
        </div>

        <div class="locale-switch" role="group" :aria-label="copy.languageLabel">
          <button
            v-for="option in localeOptions"
            :key="option.code"
            type="button"
            :class="{ active: activeLocale === option.code }"
            @click="activeLocale = option.code"
          >
            {{ option.label }}
          </button>
        </div>
      </header>

      <Transition name="page-fade" mode="out-in">
        <PaymentPage
          v-if="activeView === 'payment'"
          key="payment"
          :locale="activeLocale"
          :copy="copy"
          @pay-now="showOrderDetails"
        />
        <OrderPaymentDetails
          v-else
          key="summary"
          :sub-total="order.subTotal"
          :surcharge="order.surcharge"
          :expected-total="expectedTotal"
          currency="SAR"
          :tolerance="0.01"
          :locale="activeLocale"
          :copy="copy"
        />
      </Transition>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { dictionary } from "./util/copy";
import { getTotal, order, type Locale } from "./util/order";
import OrderPaymentDetails from "./components/OrderPaymentDetails.vue";
import PaymentPage from "./components/PaymentPage.vue";

type ViewName = "summary" | "payment";

const localeOptions: Array<{ code: Locale; label: string }> = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

const activeLocale = ref<Locale>("en");
const activeView = ref<ViewName>("payment");

const copy = computed(() => dictionary[activeLocale.value]);
const isRtl = computed(() => activeLocale.value === "ar");
const direction = computed(() => (isRtl.value ? "rtl" : "ltr"));
const expectedTotal = getTotal(order);

function showOrderDetails() {
  activeView.value = "summary";
}

function goBack() {
  if (activeView.value === "summary") {
    activeView.value = "payment";
  }
}
</script>

<style>
html {
  background: #f4f7fb;
}

body {
  margin: 0;
}

* {
  box-sizing: border-box;
}

button,
input,
textarea,
select {
  font: inherit;
}
</style>

<style scoped>
.app-shell {
  --red: #ba0030;
  --blue: #003ca1;
  --ink: #101828;
  --muted: #697586;
  --line: #e6e9ef;
  --paper: #fbfcff;
  --soft-blue: #edf4ff;
  --soft-red: #fff1f4;

  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px 14px;
  color: var(--ink);
  background: #f4f7fb;
  font-family: Avenir Next, Nunito Sans, Segoe UI, sans-serif;
}

.app-shell[dir="rtl"] {
  font-family: Geeza Pro, Noto Kufi Arabic, Noto Sans Arabic, Tahoma, sans-serif;
  text-align: right;
}

.phone-frame {
  position: relative;
  width: min(100%, 430px);
  min-height: min(900px, calc(100vh - 48px));
  overflow: hidden;
  padding: 18px;
  border: 1px solid rgba(0, 60, 161, 0.1);
  border-radius: 30px;
  background: var(--paper);
  box-shadow: 0 26px 80px rgba(0, 25, 79, 0.16);
}

.phone-frame::before,
.phone-frame::after {
  position: absolute;
  inset-inline: 28px;
  height: 3px;
  border-radius: 999px;
  content: "";
}

.phone-frame::before {
  top: 0;
  background: var(--red);
}

.phone-frame::after {
  bottom: 0;
  background: var(--blue);
}

.app-header {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

[dir="rtl"] .app-header {
  grid-template-columns: auto 1fr 42px;
}

[dir="rtl"] .back-button {
  grid-column: 3;
}

[dir="rtl"] .title-stack {
  grid-column: 2;
  grid-row: 1;
}

[dir="rtl"] .locale-switch {
  grid-column: 1;
  grid-row: 1;
}

.back-button {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  color: var(--blue);
  background: var(--soft-blue);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.title-stack {
  min-width: 0;
}

.title-stack p {
  margin: 0 0 4px;
  color: var(--muted);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

[dir="rtl"] .title-stack p {
  letter-spacing: 0;
}

.title-stack h1 {
  margin: 0;
  font-size: 1.18rem;
  line-height: 1.15;
}

.locale-switch {
  display: flex;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
}

.locale-switch button {
  border: 0;
  border-radius: 999px;
  color: var(--muted);
  background: transparent;
  font-weight: 900;
  cursor: pointer;
}

.locale-switch button {
  min-width: 38px;
  padding: 8px 9px;
}

.locale-switch .active {
  color: #fff;
  background: var(--blue);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 370px) {
  .app-shell {
    padding: 0;
  }

  .phone-frame {
    min-height: 100vh;
    border-radius: 0;
  }

  .app-header {
    grid-template-columns: 38px 1fr;
  }

  [dir="rtl"] .app-header {
    grid-template-columns: 1fr 38px;
  }

  [dir="rtl"] .back-button {
    grid-column: 2;
  }

  [dir="rtl"] .title-stack {
    grid-column: 1;
  }

  .locale-switch {
    grid-column: 1 / -1;
    justify-self: end;
  }

  [dir="rtl"] .locale-switch {
    justify-self: start;
  }
}
</style>
