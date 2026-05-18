export type MerchantType =
  | "restaurant"
  | "entertainment"
  | "supermarket"
  | "pharmacy";

export type PaymentMethod =
  | "mada"
  | "visa"
  | "mastercard"
  | "cash";

export type LossReasonKey =
  | "bonus_miles_loss"
  | "reward_cost_loss";

export interface TransactionInput {
  amount: number;
  merchantType: MerchantType;
  paymentMethod: PaymentMethod;
}

export interface LedgerEntry {
  id: string;
  amount: number;
  merchantType: MerchantType;
  paymentMethod: PaymentMethod;
  milesRate: number;
  customerPaid: number;
  merchantCommission: number;
  customerCommission: number;
  madaRevenue: number;
  revenue: number;
  miles: number;
  milesCost: number;
  netProfit: number;
  isLoss: boolean;
  lossReason: LossReasonKey | null;
  createdAt: string;
}

export const roundMoney = (value: number) => Math.round(value * 100) / 100;
export const floorMiles = (value: number) => Math.floor(value);

export function calculateTransaction(input: TransactionInput, id: string, createdAt: string): LedgerEntry {
  const amount = input.amount;
  
  // 1. Get milesRate
  let milesRate = 0;
  if (input.merchantType === "restaurant" || input.merchantType === "entertainment") {
    milesRate = 3;
  } else if (input.merchantType === "supermarket" || input.merchantType === "pharmacy") {
    milesRate = 1;
  }

  // 2. Calculate revenue
  const merchantCommission = amount * 0.15;
  const customerCommission = amount * 0.15;
  const customerPaid = amount * 1.15;
  const madaRevenue = input.paymentMethod === "mada" ? customerPaid * 0.01 : 0;
  const revenue = merchantCommission + customerCommission + madaRevenue;

  // 3. Calculate miles
  let miles = 0;
  if (amount >= 10) {
    let baseMiles = amount * milesRate;
    if (amount >= 500) {
      baseMiles *= 1.5;
    }
    miles = floorMiles(baseMiles);
  }

  // 4. Calculate costs and profit
  const milesCost = miles * 0.0756;
  const netProfit = revenue - milesCost;

  // 5. Determine loss
  const isLoss = netProfit < 0;
  let lossReason: LossReasonKey | null = null;
  
  if (isLoss) {
    if (amount >= 500) {
      lossReason = "bonus_miles_loss";
    } else {
      lossReason = "reward_cost_loss";
    }
  }

  return {
    id,
    amount: roundMoney(amount),
    merchantType: input.merchantType,
    paymentMethod: input.paymentMethod,
    milesRate,
    customerPaid: roundMoney(customerPaid),
    merchantCommission: roundMoney(merchantCommission),
    customerCommission: roundMoney(customerCommission),
    madaRevenue: roundMoney(madaRevenue),
    revenue: roundMoney(revenue),
    miles,
    milesCost: roundMoney(milesCost),
    netProfit: roundMoney(netProfit),
    isLoss,
    lossReason,
    createdAt,
  };
}
