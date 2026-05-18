# AladdinMiles Engine - Bugs & Resolutions Log

This document records the UI/UX and internationalization (i18n) bugs encountered during the integration and redesign of the Miles Engine Dashboard, along with their respective solutions.

## 1. Top Header Title Desync
**Bug:** The global app header (`App.vue`) remained static ("Order Payment" / "MOBILE CHECKOUT"), even when the user navigated to the `MilesDashboard` view.
**Resolution:** Created dynamic computed properties (`dynamicEyebrow` and `dynamicTitle`) in `App.vue` that check `activeView`. If the active view is `dashboard`, the header gracefully swaps to the correct "AladdinMiles / Engine Dashboard" title.

## 2. Disconnected Language State
**Bug:** Clicking the global language switch toggle ("AR") in the `App.vue` header changed the App shell layout to RTL, but failed to translate the contents of the `MilesDashboard`.
**Resolution:** The dashboard used its own independent `activeLanguage` ref from `i18n.ts`, while the App used `activeLocale`. A `watch` hook was added inside `App.vue` to reactively sync `activeLocale` down to the dashboard's `activeLanguage.value`, ensuring total language synchronization.

## 3. Hardcoded Navigation & Ledger Details
**Bug:** 
- The bottom navigation buttons ("Dashboard", "Details", "Payment") were hardcoded in English.
- The dynamic data inside the Transaction Ledger (`merchantType`, `paymentMethod`, and `lossReason`) failed to translate into Arabic, as the translation function `t()` was receiving the exact same English database string for both language arguments (e.g., `t('restaurant', 'restaurant')`).
**Resolution:** 
- Added inline conditional logic for the bottom navigation `{{ activeLocale === 'en' ? 'Dashboard' : 'لوحة القيادة' }}`.
- Introduced a `translations` dictionary object and a `tKey()` helper function inside `TransactionLedger.vue` to correctly map system keys to their corresponding English and Arabic display strings.

## 4. RTL Negative Number Rendering (The `14.35-` Issue)
**Bug:** In RTL (Arabic) mode, negative numbers were rendering incorrectly with the minus sign on the right side of the number (e.g., `14.35-` instead of `-14.35`). This occurred because the minus symbol is a direction-neutral character in bidirectional text formatting.
**Resolution:** Applied the HTML attribute `dir="ltr"` specifically to the DOM nodes (spans/paragraphs) rendering the negative numbers. This forces the browser's rendering engine to parse the number strictly left-to-right, maintaining the correct position of the minus sign regardless of the parent layout direction.

## 5. Flipped Undo/Redo Arrows in RTL
**Bug:** Because of `dir="rtl"` applied to the dashboard container, the flexbox layout automatically reversed the order of the Undo and Redo buttons. Visually, the left-pointing Undo arrow appeared on the right, and the right-pointing Redo arrow appeared on the left, breaking standard UI intuition.
**Resolution:** Wrapped the `<div class="undo-redo">` container with `dir="ltr"`. This isolated the button group, forcing it to remain left-to-right while maintaining its flex-end alignment within the parent container. This preserved the Undo (Left) and Redo (Right) spatial logic across all languages.
