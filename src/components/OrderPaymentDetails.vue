<template>
  <div class="order-payment-details">
    <h3>Payment Details</h3>
    
    <div class="detail-row">
      <span>Sub Total:</span>
      <span>{{ formatCurrency(subTotal) }}</span>
    </div>

    <div class="detail-row">
      <span>VAT (15%):</span>
      <span>{{ formatCurrency(calculatedVat) }}</span>
    </div>

    <div class="detail-row">
      <span>Surcharge:</span>
      <span>{{ formatCurrency(surcharge) }}</span>
    </div>

    <div class="detail-row total-row">
      <span>Total:</span>
      <span :class="{ 'error-text': hasDiscrepancy }">
        {{ formatCurrency(calculatedTotal) }}
      </span>
    </div>

    <!-- Discrepancy error message -->
    <div v-if="hasDiscrepancy" class="error-message">
      ⚠️ <strong>Calculation Discrepancy:</strong> 
      The automatically calculated total ({{ formatCurrency(calculatedTotal) }}) 
      does not match the expected total ({{ formatCurrency(expectedTotal!) }}). Please check the data source.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Define component Props
interface Props {
  subTotal: number;
  surcharge: number;
  expectedTotal?: number; // The final expected total from the system or backend, used for comparison with local calculations
}

const props = defineProps<Props>();

// VAT rate constant
const VAT_RATE = 0.15;

// Calculate VAT amount
const calculatedVat = computed(() => {
  return props.subTotal * VAT_RATE;
});

// Calculate final total
const calculatedTotal = computed(() => {
  return props.subTotal + calculatedVat.value + props.surcharge;
});

// Determine if there is a calculation discrepancy
const hasDiscrepancy = computed(() => {
  if (props.expectedTotal === undefined || props.expectedTotal === null) {
    return false;
  }
  // Introduce a 0.005 tolerance to avoid precision issues with JavaScript floating point calculations (e.g. 0.1 + 0.2)
  return Math.abs(calculatedTotal.value - props.expectedTotal) > 0.005;
});

// Currency formatting utility function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
</script>

<style scoped>
.order-payment-details {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  background-color: #f8fafc;
  font-family: system-ui, -apple-system, sans-serif;
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1e293b;
  font-size: 1.25rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #475569;
  font-size: 0.95rem;
}

.total-row {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #cbd5e1;
  font-weight: bold;
  font-size: 1.15rem;
  color: #0f172a;
}

.error-text {
  color: #ef4444;
}

.error-message {
  margin-top: 20px;
  padding: 12px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 6px;
  font-size: 0.85rem;
  line-height: 1.5;
}
</style>
