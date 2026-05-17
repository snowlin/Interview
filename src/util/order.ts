export type Locale = "en" | "ar";

export interface OrderModel {
  currency: string;
  subTotal: number;
  surcharge: number;
  milesRewarded: number;
  product: {
    image: string;
    sku: string;
  };
}

export const VAT_RATE = 0.15;

export const order: OrderModel = {
  currency: "SAR",
  subTotal: 184,
  surcharge: 12.5,
  milesRewarded: 1240,
  product: {
    sku: "AF-CO-4829",
    image:
      "data:image/svg+xml,%3Csvg width='240' height='240' viewBox='0 0 240 240' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='240' height='240' rx='36' fill='%23EAF1FF'/%3E%3Cpath d='M79 76c0-13.255 10.745-24 24-24h34c13.255 0 24 10.745 24 24v17H79V76Z' stroke='%23003CA1' stroke-width='12'/%3E%3Crect x='57' y='83' width='126' height='124' rx='23' fill='%23003CA1'/%3E%3Cpath d='M80 113h80M80 141h80M93 167h54' stroke='white' stroke-opacity='.52' stroke-width='8' stroke-linecap='round'/%3E%3Ccircle cx='83' cy='210' r='9' fill='%23BA0030'/%3E%3Ccircle cx='157' cy='210' r='9' fill='%23BA0030'/%3E%3Cpath d='M184 90c19 12 23 36 10 55' stroke='%23BA0030' stroke-width='10' stroke-linecap='round'/%3E%3C/svg%3E",
  },
};

export function getVat(subTotal = order.subTotal) {
  return subTotal * VAT_RATE;
}

export function getTotal(currentOrder = order) {
  return currentOrder.subTotal + getVat(currentOrder.subTotal) + currentOrder.surcharge;
}

export function formatCurrency(amount: number, locale: Locale, currency = order.currency) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(amount: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-US").format(amount);
}
