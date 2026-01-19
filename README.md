# 🛒 Shopping Cart – Automated Testing Project

This repository contains an automated test suite for a **Shopping Cart application**, covering both **API** and **UI** layers.

The goal of this project is to demonstrate:
- solid test coverage
- clean test architecture
- parameterization and reusability
- edge case handling and boundary conditions
- ability to identify and document bugs clearly

---

## 🧰 Tech Stack

- **Playwright** — API & UI test automation
- **TypeScript**
- **Node.js 18+**
- **Faker** — dynamic test data generation
- **Playwright Test Runner & HTML Reporter**

---

## 📂 Project Structure

```text
e2e/
├── helpers/            # API helper functions (createCart, addItem, getCart, removeItem, applyDiscount)
├── pages/              # Page Object Models (UI abstraction)
├── tests/
│   ├── api/            # API tests
│   └── ui/             # UI tests
├── playwright.config.ts
├── package.json
└── README.md
✅ Test Coverage Overview
🔹 API Testing
Covered endpoints and scenarios:

Health Check
GET /health

verifies service availability

Cart Management
POST /cart

cart creation

GET /cart/:cartId

empty cart state

correct totals initialization

Cart Items
POST /cart/:cartId/items

✅ valid item addition

❌ invalid data:

negative price

zero / negative quantity

missing required fields

empty name

DELETE /cart/:cartId/items/:itemId

✅ item removal

❌ unknown itemId

❌ unknown cartId

Discounts
POST /cart/:cartId/discount

✅ valid discount codes:

SAVE10

SAVE20

HALF

❌ invalid discount code

discount calculation accuracy

totals remain unchanged on failure

🔹 UI Testing (Optional)
Covered UI flows using tags and Page Object Model:

Form validation (HTML5 constraints)

Adding items through the UI

Removing items through the UI

Applying discount codes through the UI

Correct display of:

subtotal

discount

total

Dynamic data is generated using faker to avoid hardcoded values.

🧪 Parameterization & Tags
Tests are parameterized where it improves readability and coverage:

discount codes (SAVE10, SAVE20, HALF)

invalid item payloads (multiple invalid inputs in a single negative test)

Tests are organized and filtered using Playwright tags:

@api — API tests

@ui — UI tests

@negative — negative scenarios

@smoke — critical baseline flows

▶️ How to Run the Project
Prerequisites
Docker + Docker Compose (recommended)
or

Node.js 18+ (local run)

Option A: Run the application with Docker (recommended)
From the project directory:
docker-compose up --build
The application will be available at:
http://localhost:3000
To stop and remove containers:

docker-compose down
Option B: Run the application locally (without Docker)
npm install
npm start
🧪 How to Run Tests
Install dependencies
npm install
Run all tests

npm test
Run tests by tag
npm run test:api         # only API tests
npm run test:ui          # only UI tests
npm run test:smoke       # smoke suite
npm run test:negative    # negative scenarios only
Headed / Debug
npm run test:headed
npm run test:debug
HTML Report
npm run report
⚠️ Edge Cases & Boundary Conditions Considered
Boundary values for numeric inputs:

negative / zero values for price and quantity

minimal valid quantity (1)

Missing required fields for item creation

Invalid identifiers (unknown cartId / itemId)

Invalid discount codes

State consistency after failed operations:

cart totals remain unchanged on invalid requests

cart remains empty after multiple invalid add attempts

## 📌 Assumptions Made During Testing

- The API may return either `200` or `201` for successful `POST` operations (cart creation, item addition, discount application), therefore tests accept both statuses.
- `DELETE` operations may return either `200` or `204` on successful item removal, depending on implementation.
- For invalid input data, the API may respond with `400` or `422`; tests are written to handle both cases.
- Requests with unknown `cartId` or `itemId` may return `400` or `404`, depending on error handling logic.
- UI form validation relies on native HTML5 constraints (`required`, `min`, input type validation).
- UI tests assume a clean cart state on page load, as the cart is initialized automatically when the page is opened.

🐞 Bug Reports
BUG-1: Add Item form resets values inconsistently
Area: UI — Add Item form
Severity: Medium

Steps to reproduce
Open the Shopping Cart page

Fill in Item Name, Price, and Quantity

Click Add to Cart

Actual result
Item Name and Price fields are cleared

Quantity field is always reset to 1, regardless of the previous value

Expected result
Either all fields should reset consistently
or

Previously entered values should be preserved to allow faster item entry

Impact
Breaks user flow when adding multiple items

Can lead to unintended quantity values

BUG-2: Blocking alert after applying discount
Area: UI — Discount application
Severity: Low

Description
After applying a valid discount code, a blocking browser alert is shown:
alert("Discount code applied!")

Impact
Interrupts UI automation flow (requires dialog handling)

Not user-friendly for frequent operations

📊 Test Results Summary
✅ API test suite: PASS

✅ UI test suite: PASS

🔍 Bugs identified and documented with reproduction steps

🧪 Positive, negative, edge-case and boundary-condition scenarios covered

🧱 Clean separation of concerns (helpers / pages / tests)

📝 Notes
API tests use small reusable helpers to reduce duplication while keeping assertions inside test bodies.
UI tests use Page Object Model for stability and maintainability.
Tags (@api, @ui, @smoke, @negative) allow quick and targeted execution.
