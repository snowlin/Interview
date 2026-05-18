<template>
  <main class="app-shell" :dir="direction" :lang="activeLocale">
    <div class="frame-wrap">
      <section class="phone-frame">
        <header class="app-header">
          <button class="back-button" type="button" :aria-label="copy.back" @click="goBack">
            <span aria-hidden="true">{{ isRtl ? ">" : "<" }}</span>
          </button>

          <div class="title-stack">
            <p>{{ dynamicEyebrow }}</p>
            <h1>{{ dynamicTitle }}</h1>
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

        <div class="page-content">
          <Transition name="page-fade" mode="out-in">
            <MilesDashboard
              v-if="activeView === 'dashboard'"
              key="dashboard"
            />
            <PaymentPage
              v-else-if="activeView === 'payment'"
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
        </div>
      </section>

      <nav class="app-tabbar" dir="ltr">
        <button
          :class="{ active: activeView === 'payment' }"
          :aria-label="activeLocale === 'en' ? 'Payment' : 'الدفع'"
          @click="activeView = 'payment'"
        >
          {{ activeLocale === 'en' ? 'Pay' : 'الدفع' }}
        </button>
        <button
          :class="{ active: activeView === 'summary' }"
          :aria-label="activeLocale === 'en' ? 'Details' : 'التفاصيل'"
          @click="activeView = 'summary'"
        >
          {{ activeLocale === 'en' ? 'Info' : 'التفاصيل' }}
        </button>
        <button
          :class="{ active: activeView === 'dashboard' }"
          :aria-label="activeLocale === 'en' ? 'Dashboard' : 'لوحة القيادة'"
          @click="activeView = 'dashboard'"
        >
          {{ activeLocale === 'en' ? 'Miles' : 'الأميال' }}
        </button>
      </nav>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { dictionary } from "./util/copy";
import { getTotal, order, type Locale } from "./util/order";
import { activeLanguage } from "./util/i18n";
import OrderPaymentDetails from "./components/OrderPaymentDetails.vue";
import PaymentPage from "./components/PaymentPage.vue";
import MilesDashboard from "./components/MilesDashboard.vue";

type ViewName = "summary" | "payment" | "dashboard";

const localeOptions: Array<{ code: Locale; label: string }> = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

const activeLocale = ref<Locale>("en");
const activeView = ref<ViewName>("dashboard");

watch(activeLocale, (newVal) => {
  activeLanguage.value = newVal as 'en' | 'ar';
}, { immediate: true });

const copy = computed(() => dictionary[activeLocale.value]);
const isRtl = computed(() => activeLocale.value === "ar");
const direction = computed(() => (isRtl.value ? "rtl" : "ltr"));
const expectedTotal = getTotal(order);

const dynamicEyebrow = computed(() => {
  if (activeView.value === 'dashboard') {
    return activeLocale.value === 'en' ? 'ALADDINMILES' : 'أميال علاء الدين';
  }
  return copy.value.appEyebrow;
});

const dynamicTitle = computed(() => {
  if (activeView.value === 'dashboard') {
    return activeLocale.value === 'en' ? 'Engine Dashboard' : 'لوحة المحرك';
  }
  return copy.value.appTitle;
});

function showOrderDetails() {
  activeView.value = "summary";
}

function goBack() {
  if (activeView.value === "summary") {
    activeView.value = "payment";
  } else if (activeView.value === "dashboard") {
    activeView.value = "payment";
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&family=Plus+Jakarta+Sans:wght@400;600;800&family=Tajawal:wght@400;700;800&display=swap');

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
  font-family: "Plus Jakarta Sans", Avenir Next, Nunito Sans, Segoe UI, sans-serif;
}

.app-shell[dir="rtl"] {
  font-family: "Tajawal", Geeza Pro, Noto Kufi Arabic, Noto Sans Arabic, Tahoma, sans-serif;
  text-align: right;
}

.frame-wrap {
  width: min(100%, 430px);
}

.phone-frame {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: min(900px, calc(100vh - 48px));
  overflow: hidden;
  padding: 18px;
  border: 1px solid rgba(0, 60, 161, 0.08);
  border-radius: 36px;
  background: var(--paper);
  box-shadow: 
    0 40px 80px -10px rgba(0, 60, 161, 0.12),
    0 20px 40px -10px rgba(0, 60, 161, 0.06);
}

/* Removed faux phone hardware lines to favor software UI aesthetic */

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

.page-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin: 0 -4px;
  padding: 10px 4px 112px;
  scrollbar-width: thin;
}

.page-content::-webkit-scrollbar {
  width: 6px;
}

.page-content::-webkit-scrollbar-thumb {
  background: rgba(105, 117, 134, 0.36);
  border-radius: 999px;
}

.app-tabbar {
  position: fixed;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  z-index: 30;
  display: flex;
  gap: 8px;
  width: min(calc(100vw - 28px), 430px);
  padding: 8px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(0, 60, 161, 0.1);
  border-radius: 22px;
  box-shadow: 0 14px 34px rgba(0, 25, 79, 0.16);
}

.app-tabbar button {
  flex: 1;
  min-height: 46px;
  border: 0;
  border-radius: 16px;
  background: transparent;
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease, transform 160ms ease;
}

.app-tabbar button:active {
  transform: scale(0.98);
}

.app-tabbar button.active {
  color: #fff;
  background: var(--blue);
  box-shadow: 0 8px 18px rgba(0, 60, 161, 0.18);
}

@media (max-width: 370px) {
  .app-shell {
    padding: 0;
  }

  .frame-wrap {
    width: 100%;
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

  .page-content {
    padding-bottom: 104px;
  }

  .app-tabbar {
    bottom: 12px;
    gap: 6px;
    padding: 6px;
    width: calc(100vw - 16px);
  }

  .app-tabbar button {
    min-height: 44px;
    font-size: 0.78rem;
  }
}
</style>
