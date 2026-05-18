<script setup lang="ts">
import { useMilesEngine } from '../composables/useMilesEngine';
import { dir } from '../util/i18n';
import SummaryCards from './SummaryCards.vue';
import TransactionForm from './TransactionForm.vue';
import TransactionLedger from './TransactionLedger.vue';

const {
  addTransaction,
  undoLast,
  redoLast,
  ledger,
  totalMiles,
  totalRevenue,
  totalMilesCost,
  netProfit,
  canUndo,
  canRedo
} = useMilesEngine();

</script>

<template>
  <div class="miles-dashboard" :dir="dir">
    
    <div class="top-controls">
      <div class="undo-redo" dir="ltr">
        <button :disabled="!canUndo" @click="undoLast" class="icon-btn" aria-label="Undo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
        <button :disabled="!canRedo" @click="redoLast" class="icon-btn" aria-label="Redo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
        </button>
      </div>
    </div>

    <SummaryCards
      :total-miles="totalMiles"
      :total-revenue="totalRevenue"
      :total-miles-cost="totalMilesCost"
      :net-profit="netProfit"
    />

    <TransactionForm @submit="addTransaction" />

    <TransactionLedger :ledger="ledger" />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.miles-dashboard {
  --lux-primary: #002868; /* Deep Sapphire */
  --lux-accent: #ba0030;  /* Crimson Velvet */
  --lux-surface: rgba(255, 255, 255, 0.7);
  --lux-bg: #f8f9fc;
  --lux-text: #111827;
  --lux-muted: #6b7280;
  --lux-border: rgba(0, 40, 104, 0.08);
  --lux-danger: #e11d48;
  --lux-success: #059669;

  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  color: var(--lux-text);
  min-height: 100vh;
  margin: 0 auto;
  padding: 16px;
  background: var(--lux-bg);
  /* Subdued ambient glow */
  background-image: 
    radial-gradient(at 0% 0%, rgba(0, 40, 104, 0.04) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(186, 0, 48, 0.03) 0px, transparent 50%);
  background-attachment: fixed;
}

[dir="rtl"] {
  font-family: 'Tajawal', 'Plus Jakarta Sans', system-ui, sans-serif;
}

/* Headings use Outfit */
h1, h2, h3, .metric-value {
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.02em;
}

.top-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.undo-redo {
  display: flex;
  gap: 12px;
  background: white;
  padding: 6px;
  border-radius: 99px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid var(--lux-border);
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--lux-primary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-btn:not(:disabled):hover {
  background: var(--lux-primary);
  color: white;
  transform: scale(1.05);
}

.icon-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Base card aesthetic for children */
.lux-card {
  background: var(--lux-surface);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.02),
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  border-radius: 20px;
}
</style>
