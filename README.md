# Order Payment Flow

This project implements a mobile-first Vue 3 + TypeScript order payment flow with English and Arabic RTL support.

## Run Locally

```bash
yarn install
yarn dev
```

Build check:

```bash
yarn build
```

## Interaction Flow

1. User lands on the payment review page.
2. User can switch language between English and Arabic.
3. Arabic mode switches the page to RTL layout.
4. The payment page shows the order summary:
   - Product image and product name
   - Sub Total
   - VAT (15%)
   - Surcharge as a separate visible line
   - Total
   - Miles Rewarded
5. User taps `Pay now`.
6. The UI enters a simulated processing state.
7. The payment result is randomly simulated:
   - Success: show a green success message, then navigate to the order details page.
   - Failure: show a red failure message and keep the user on the payment page for retry.
8. After successful payment, the order details page shows:
   - Payment successful status
   - Product information
   - Payment milestones
   - Cost breakdown
   - Miles Rewarded

## Page Responsibilities

### `PaymentPage.vue`

This is the pre-payment review page. It focuses on the information the user needs before confirming payment:

- Product summary
- Cost breakdown
- Surcharge as a standalone line
- Miles that will be rewarded
- Payment safety note
- Simulated `Pay now` interaction

It does not show card form details because they are outside the strict order summary requirements.

### `OrderPaymentDetails.vue`

This is the post-payment order details page. It displays the completed payment state:

- Payment successful status
- Order milestone timeline
- Product summary
- Full amount calculation
- Miles rewarded
- Amount validation warning when totals do not match

## Amount Validation

`OrderPaymentDetails.vue` accepts these key props:

```vue
<OrderPaymentDetails
  :subTotal="199.99"
  :surcharge="8.08"
  :expectedTotal="239.28"
  currency="SAR"
  :tolerance="0.01"
/>
```

Validation behavior:

- `currency` defaults to `SAR`.
- `expectedTotal` is required.
- `tolerance` defaults to `0.005`.
- If any amount is invalid or the calculated total differs from `expectedTotal` beyond `tolerance`, the page shows an explicit warning.

## Internationalization

Shared copy lives in:

```text
src/util/copy.ts
```

Shared order data and amount utilities live in:

```text
src/util/order.ts
```

Arabic support includes:

- `dir="rtl"` on the app shell
- Arabic copy
- RTL layout adjustments
- Arabic-friendly font stack

## Visual Direction

The design uses a clean modern mobile style with the required brand colors:

- Deep red: `#ba0030`
- Deep blue: `#003ca1`

Red is used for:

- Primary brand emphasis
- Payment failure
- Surcharge text emphasis

Blue is used for:

- Primary payment actions
- Secure payment messaging
- Reward and progress emphasis
