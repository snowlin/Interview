<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { t } from '../util/i18n';
import type { LedgerEntry } from '../util/miles';

const props = defineProps<{
  ledger: LedgerEntry[];
}>();

const pageSize = 2;
const currentPage = ref(1);

const translations: Record<string, [string, string]> = {
  restaurant: ['Restaurant', 'مطعم'],
  entertainment: ['Entertainment', 'ترفيه'],
  supermarket: ['Supermarket', 'سوبر ماركت'],
  pharmacy: ['Pharmacy', 'صيدلية'],
  mada: ['Mada', 'مدى'],
  visa: ['Visa', 'فيزا'],
  mastercard: ['MasterCard', 'ماستركارد'],
  cash: ['Cash', 'نقد'],
  bonus_miles_loss: ['Bonus miles cost exceeds commission', 'تكلفة أميال المكافأة تتجاوز العمولة'],
  base_miles_loss: ['Base miles cost exceeds commission', 'تكلفة الأميال الأساسية تتجاوز العمولة'],
};

const tKey = (key: string) => {
  if (translations[key]) {
    return t(translations[key][0], translations[key][1]);
  }
  return key;
};

const reversedLedger = computed(() => props.ledger.slice().reverse());
const totalPages = computed(() => Math.max(1, Math.ceil(reversedLedger.value.length / pageSize)));
const pagedLedger = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return reversedLedger.value.slice(start, start + pageSize);
});

watch(
  () => props.ledger.length,
  () => {
    currentPage.value = 1;
  }
);

function goPrevPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
}

function goNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
}
</script>

<template>
  <div class="lux-card ledger-section">
    <div class="ledger-header">
      <div>
        <h2>{{ t('Recent Transactions', 'المعاملات الأخيرة') }}</h2>
        <p class="ledger-subtitle">
          {{ t('Browse the latest activity page by page', 'تصفح أحدث العمليات صفحة بصفحة') }}
        </p>
      </div>
      <span v-if="ledger.length" class="ledger-count">{{ ledger.length }}</span>
    </div>
    
    <div class="transaction-list">
      <div v-if="ledger.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <p>{{ t('No transactions yet.', 'لا توجد معاملات بعد.') }}</p>
      </div>
      
      <div 
        v-for="(tx, index) in pagedLedger" 
        :key="tx.id" 
        class="tx-row"
      >
        <div class="tx-main">
          <div class="tx-icon">
            <svg v-if="tx.merchantType === 'restaurant'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
            <svg v-else-if="tx.merchantType === 'supermarket'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <svg v-else-if="tx.merchantType === 'pharmacy'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 16v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3"></path><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"></path><rect x="9" y="11" width="6" height="10" rx="2"></rect><path d="M12 14v4"></path><path d="M10 16h4"></path></svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          
          <div class="tx-info">
            <span class="tx-merchant">{{ tKey(tx.merchantType) }}</span>
            <span class="tx-meta">{{ tKey(tx.paymentMethod) }} • {{ new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
          </div>

          <div class="tx-financials">
            <span class="tx-amount">{{ tx.amount.toFixed(2) }} <span class="currency">SAR</span></span>
          </div>
        </div>

        <div class="tx-metrics">
          <div class="metric-box amount-box">
            <span class="metric-label">{{ t('Amount', 'المبلغ') }}</span>
            <strong class="metric-value" dir="ltr">{{ tx.amount.toFixed(2) }} SAR</strong>
          </div>
          <div class="metric-box">
            <span class="metric-label">{{ t('Miles', 'الأميال') }}</span>
            <strong class="metric-value">{{ tx.miles }}</strong>
          </div>
          <div class="metric-box">
            <span class="metric-label">{{ t('Miles Cost', 'تكلفة الأميال') }}</span>
            <strong class="metric-value" dir="ltr">{{ tx.milesCost.toFixed(2) }} SAR</strong>
          </div>
          <div class="metric-box" :class="{ 'loss-box': tx.netProfit < 0, 'profit-box': tx.netProfit >= 0 }">
            <span class="metric-label">{{ t('Net Profit', 'صافي الربح') }}</span>
            <strong class="metric-value" dir="ltr">
              {{ tx.netProfit > 0 ? '+' : '' }}{{ tx.netProfit.toFixed(2) }} SAR
            </strong>
          </div>
        </div>
        
        <div v-if="tx.isLoss && tx.lossReason" class="loss-alert">
          <div class="loss-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div class="loss-content">
            <span class="loss-title">{{ t('Revenue Deficit', 'عجز في الإيرادات') }} (<span dir="ltr">{{ tx.netProfit.toFixed(2) }} SAR</span>)</span>
            <span class="loss-desc">{{ tKey(tx.lossReason || '') }}</span>
          </div>
        </div>
        
        <div v-if="index !== pagedLedger.length - 1" class="row-divider"></div>
      </div>
    </div>

    <div v-if="ledger.length > pageSize" class="pagination-bar" dir="ltr">
      <button
        type="button"
        class="page-btn"
        :disabled="currentPage === 1"
        @click="goPrevPage"
      >
        {{ t('Prev', 'السابق') }}
      </button>
      <p class="page-indicator">
        {{ t('Page', 'الصفحة') }} {{ currentPage }} / {{ totalPages }}
      </p>
      <button
        type="button"
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="goNextPage"
      >
        {{ t('Next', 'التالي') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.ledger-section {
  padding: 24px;
}

.ledger-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.ledger-section h2 {
  margin-top: 0;
  font-size: 1.1rem;
  color: var(--lux-primary);
  margin-bottom: 4px;
  font-weight: 700;
}

.ledger-subtitle {
  margin: 0;
  color: var(--lux-muted);
  font-size: 0.83rem;
  line-height: 1.4;
}

.ledger-count {
  flex-shrink: 0;
  min-width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(0, 60, 161, 0.08);
  color: var(--lux-primary);
  font-weight: 800;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: var(--lux-muted);
}

.empty-icon {
  margin-bottom: 12px;
  opacity: 0.5;
}

.transaction-list {
  display: flex;
  flex-direction: column;
}

.tx-row {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
}

.tx-row:first-child {
  padding-top: 0;
}

.tx-row:last-child {
  padding-bottom: 0;
}

.row-divider {
  height: 1px;
  background: var(--lux-border);
  margin-top: 16px;
}

.tx-main {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
}

.tx-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(0, 40, 104, 0.05);
  color: var(--lux-primary);
}

.tx-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tx-merchant {
  font-weight: 600;
  color: var(--lux-text);
  text-transform: capitalize;
}

.tx-meta {
  font-size: 0.8rem;
  color: var(--lux-muted);
  text-transform: capitalize;
}

.tx-financials {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.tx-amount {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--lux-text);
}

.tx-amount .currency {
  font-size: 0.8rem;
  color: var(--lux-muted);
}

.tx-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.metric-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid var(--lux-border);
}

.amount-box {
  background: rgba(0, 60, 161, 0.05);
}

.metric-label {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--lux-muted);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.metric-value {
  font-size: 1rem;
  color: var(--lux-text);
  line-height: 1.2;
}

.profit-box .metric-value {
  color: var(--lux-success);
}

.loss-box {
  background: #fff4f6;
  border-color: rgba(186, 0, 48, 0.18);
}

.loss-box .metric-value {
  color: var(--lux-danger);
}

/* Elegant Loss Alert */
.loss-alert {
  display: flex;
  gap: 12px;
  margin-top: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff0f2;
  border-left: 3px solid var(--lux-danger);
}

[dir="rtl"] .loss-alert {
  border-left: none;
  border-right: 3px solid var(--lux-danger);
}

.loss-icon {
  color: var(--lux-danger);
  margin-top: 2px;
}

.loss-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.loss-title {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--lux-danger);
}

.loss-desc {
  font-size: 0.8rem;
  color: #9f1239;
  line-height: 1.4;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--lux-border);
}

.page-btn {
  min-width: 88px;
  min-height: 42px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: rgba(0, 60, 161, 0.08);
  color: var(--lux-primary);
  font-weight: 800;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease, opacity 160ms ease;
}

.page-btn:disabled {
  opacity: 0.42;
  cursor: not-allowed;
}

.page-btn:not(:disabled):active {
  background: var(--lux-primary);
  color: white;
}

.page-indicator {
  margin: 0;
  color: var(--lux-muted);
  font-size: 0.84rem;
  font-weight: 700;
  text-align: center;
}

@media (max-width: 420px) {
  .tx-main {
    gap: 12px;
  }

  .tx-icon {
    width: 42px;
    height: 42px;
  }

  .metric-box {
    padding: 10px;
  }

  .metric-value {
    font-size: 0.92rem;
  }

  .pagination-bar {
    gap: 8px;
  }

  .page-btn {
    min-width: 78px;
  }
}
</style>
