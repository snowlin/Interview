# AladdinMiles Engine

AladdinMiles Engine is a Vue 3 + TypeScript application designed to accurately calculate transaction miles, monitor revenue and costs, and display real-time profit analytics for loyalty program merchants. 

The dashboard is built with a **"Refined Fintech Luxury"** aesthetic, supporting seamless internationalization (English & Arabic RTL) and offering a robust, reactive Undo/Redo transaction history.

## 🚀 Key Features

### 1. Robust Core Engine (`useMilesEngine`)
- **Strict Business Rules**: Calculates miles strictly based on merchant types (Restaurant/Entertainment: 3 miles/SAR | Supermarket/Pharmacy: 1 mile/SAR).
- **High-Value Multipliers**: Automatically applies a `1.5x` multiplier for individual transactions over 500 SAR.
- **Micro-transaction Filtering**: Transactions under 10 SAR automatically yield 0 miles.
- **Profit & Loss Detection**: Granular calculation of Merchant Commission (15%), Customer Commission (15%), Mada Revenue bonuses (1%), and Miles Costs. It precisely detects and tags when transactions cause a deficit (e.g., `bonus_miles_loss`).

### 2. Reactive History Stack (Undo/Redo)
- Includes a fully tested, immutable history state manager.
- Users can securely undo and redo transactions. All derived metrics (Total Miles, Total Revenue, Net Profit, etc.) automatically recalculate with absolute precision.

### 3. "Refined Fintech Luxury" UI Design
- **Hero Metrics & Glassmorphism**: High-impact metrics use frosted glass cards and deep gradients to give a premium banking feel.
- **Bank Statement Ledger**: Transactions are displayed with elegant typography, utilizing distinct icons and sophisticated inline alerts for revenue deficits.
- **Fluid Micro-interactions**: Buttons and inputs feature sleek bottom-borders, hover spring-physics, and smooth transitions.

### 4. Flawless i18n & RTL Support
- Native toggle between English and Arabic (العربية).
- Deep integration ensures the entire App Shell, routing tabs, and the Miles Dashboard remain tightly synced.
- Includes granular CSS fixes to ensure LTR constraints on specific UI elements (like minus signs on negative numbers and directional Undo/Redo arrows) remain intact while the rest of the application seamlessly mirrors for RTL reading.

## 🛠 Tech Stack
- **Vue 3** (Composition API)
- **TypeScript**
- **Vitest** (100% Test Coverage on Core Engine Logic)

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run unit tests
npm run test
```

## 🧪 Testing
The core engine has 100% test coverage for its calculations and history stack management. The test suite verifies critical edge cases such as rounding precision, undo/redo state preservation, and loss-reason detection. Execute `npm run test` to view the 9 core test cases.
