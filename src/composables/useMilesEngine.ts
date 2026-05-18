import { ref, computed } from 'vue';
import { calculateTransaction, type TransactionInput, type LedgerEntry } from '../util/miles';
import { roundMoney } from '../util/miles';

export function useMilesEngine() {
  const ledger = ref<LedgerEntry[]>([]);
  const undoneStack = ref<LedgerEntry[]>([]);

  const addTransaction = (input: TransactionInput) => {
    const entry = calculateTransaction(
      input,
      crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      new Date().toISOString()
    );
    
    ledger.value.push(entry);
    undoneStack.value = [];
  };

  const undoLast = () => {
    if (ledger.value.length > 0) {
      const last = ledger.value.pop()!;
      undoneStack.value.push(last);
    }
  };

  const redoLast = () => {
    if (undoneStack.value.length > 0) {
      const toRedo = undoneStack.value.pop()!;
      ledger.value.push(toRedo);
    }
  };

  const totalMiles = computed(() => {
    return ledger.value.reduce((sum, entry) => sum + entry.miles, 0);
  });

  const totalSpend = computed(() => {
    return roundMoney(ledger.value.reduce((sum, entry) => sum + entry.amount, 0));
  });

  const totalRevenue = computed(() => {
    return roundMoney(ledger.value.reduce((sum, entry) => sum + entry.revenue, 0));
  });

  const totalMilesCost = computed(() => {
    return roundMoney(ledger.value.reduce((sum, entry) => sum + entry.milesCost, 0));
  });

  const netProfit = computed(() => {
    return roundMoney(ledger.value.reduce((sum, entry) => sum + entry.netProfit, 0));
  });

  const canUndo = computed(() => ledger.value.length > 0);
  const canRedo = computed(() => undoneStack.value.length > 0);

  return {
    ledger,
    undoneStack, // Exposed for testability if needed
    addTransaction,
    undoLast,
    redoLast,
    totalMiles,
    totalSpend,
    totalRevenue,
    totalMilesCost,
    netProfit,
    canUndo,
    canRedo
  };
}
