<script setup lang="ts">
import { t } from '../util/i18n';

defineProps<{
  totalMiles: number;
  totalRevenue: number;
  totalMilesCost: number;
  netProfit: number;
}>();
</script>

<template>
  <div class="summary-grid">
    <div class="summary-card featured miles-card">
      <p class="label">{{ t('Total Miles', 'إجمالي الأميال') }}</p>
      <p class="value">{{ totalMiles.toLocaleString() }}</p>
    </div>

    <div class="summary-card featured profit-card" :class="{ 'is-loss': netProfit < 0 }">
      <p class="label">{{ t('Net Profit', 'صافي الربح') }}</p>
      <p class="value" dir="ltr">{{ netProfit > 0 ? '+' : '' }}{{ netProfit.toFixed(2) }} SAR</p>
    </div>

    <div class="summary-card">
      <p class="label">{{ t('Total Revenue', 'إجمالي الإيرادات') }}</p>
      <p class="value" dir="ltr">{{ totalRevenue.toFixed(2) }} SAR</p>
    </div>

    <div class="summary-card">
      <p class="label">{{ t('Total Miles Cost', 'إجمالي تكلفة الأميال') }}</p>
      <p class="value" dir="ltr">{{ totalMilesCost.toFixed(2) }} SAR</p>
    </div>
  </div>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 28px;
}

.summary-card {
  min-height: 118px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px;
  border-radius: 20px;
  background: white;
  border: 1px solid var(--lux-border);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.featured {
  min-height: 132px;
}

.label {
  margin: 0;
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--lux-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.value {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.15;
  color: var(--lux-text);
}

.featured .value {
  font-size: 1.9rem;
}

.miles-card {
  background: #003ca1;
  border-color: #003ca1;
}

.miles-card .label,
.miles-card .value {
  color: white;
}

.profit-card {
  background: #fff7f9;
  border-color: rgba(186, 0, 48, 0.16);
}

.profit-card .value {
  color: var(--lux-success);
}

.profit-card.is-loss .value {
  color: var(--lux-danger);
}

@media (max-width: 420px) {
  .summary-card {
    min-height: 108px;
    padding: 16px;
  }

  .featured {
    min-height: 124px;
  }

  .featured .value {
    font-size: 1.7rem;
  }

  .value {
    font-size: 1.2rem;
  }
}
</style>
