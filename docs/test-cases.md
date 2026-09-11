# Toolshop test design

Design baseline: 11 September 2026. Application: <https://practicesoftwaretesting.com/>. Original design retained and reconciled with live MCP exploration on 11 September 2026. All 15 selected cases are implemented; execution evidence is tracked separately. CHK-001 has a documented live-site revision. No design-first Git history is claimed.

## Current application and scope

Initial live exploration in headless Chromium found Toolshop v5.0 (footer build 2026-09-09), a catalog with search/reset, ascending and descending price sorting, a **Pliers** category, product cards, and Home, Categories, Contact and Sign in navigation. **Combination Pliers** was purchasable, and its detail page identified category Pliers, unit price, description and quantity controls; another product was out of stock. Registration and login forms were available. Registration currently includes first/last name, date of birth, country, postal code, **house number**, street, city, state, phone, email and password. The password rules require at least eight characters with upper/lowercase, a number and a special character. Country/postal-code/house-number changes may populate address fields, so tests verify the final synthetic address before submitting.

Product prices, IDs, stock, counts and user-created public data can change. Tests use configured product names and compare the prices rendered during that test; they do not depend on the observed price or catalog count. Cart and checkout specifics are now confirmed in observations.md, including guest identity validation and two-stage order confirmation.

The scope contains **24 cases: 15 automated, 8 manual, 1 not applicable**. P0 protects purchase and authentication, P1 protects frequent discovery/cart behavior and validation, and P2 covers less frequent navigation, compatibility and exploration. The manual cases remain designed coverage, not claims that a manual run passed.

## Shared preconditions and data

Unless a case overrides these conditions, open a fresh browser context in English against the configured base URL, begin signed out with no local cart, and allow the public application and API to load. Each case is independent; it must not consume another case's account or cart. A cart prerequisite is established in that case's own fixture. Tests select the configured purchasable product by name and capture its current price. Missing or unavailable fixture products are reported as a data/environment limitation, not silently skipped or replaced by an arbitrary product.

Reusable test data:

- `test-data/catalog.json`: primary product **Combination Pliers**, search term **pliers**, a distinctive synthetic unmatched term, category **Pliers**, and sort choices. Expected prices and quantities are computed from the current UI and configured quantity, with currency arithmetic rounded to cents.
- `test-data/users.json`: fictitious profile and deliberately invalid login identity. Candidate-owned disposable email addresses and passwords are generated at runtime or read from local environment variables. Committed files contain no usable password, token or authenticated browser state.
- `test-data/checkout.json`: fictitious billing address and a payment method supported by the practice site. No real customer or payment information is used.
- [Manual data](#manual-data): small input sets for manual checks, stored here so they are reproducible without inventing automation-only fixtures.

Desktop automation runs in Chromium, Firefox and WebKit. The same critical test IDs run in a mobile-oriented Chromium viewport using an `@mobile` tag; this is viewport coverage, not a claim of testing a physical phone or Safari on iOS. Cases identify their strategy entry by the same ID. Planned test titles start with their ID so reports are traceable.

## Catalog

### CAT-001 — Catalog exposes purchasable products

- **Module / priority / type:** Catalog; P1; positive, regression.
- **Preconditions / data:** Shared clean-context preconditions; `test-data/catalog.json`, configured primary product.
- **Steps:** 1. Open Home. 2. Locate the primary product card. 3. Read its name and displayed price. 4. Open that card.
- **Expected result:** The catalog has product cards; the selected card has its configured name and a valid positive price. Its detail page identifies the same product and provides a purchase control. The test does not require an exact catalog size or hardcoded price.
- **Automation decision:** Automate; inexpensive availability and catalog-to-product identity check catches a broken entry point.
- **Traceability:** [Strategy CAT-001](automation-strategy.md#cat-001); `tests/catalog.spec.ts` — `CAT-001 catalog exposes purchasable products`.

### CAT-002 — Keyword search returns matching products

- **Module / priority / type:** Catalog; P1; positive, regression.
- **Preconditions / data:** Clean Home; `test-data/catalog.json`, search term `pliers`.
- **Steps:** 1. Enter the configured keyword. 2. Submit search. 3. Inspect the resulting product names.
- **Expected result:** Search results are nonempty and all visible result names contain the keyword without regard to case. The query remains visible. Assertions wait for the submitted query's results rather than inspecting the previous list.
- **Automation decision:** Automate; frequent, deterministic discovery behavior with a clear semantic oracle.
- **Traceability:** [Strategy CAT-002](automation-strategy.md#cat-002); `tests/catalog.spec.ts` — `CAT-002 keyword search returns matching products`.

### CAT-003 — No-match search can be reset

- **Module / priority / type:** Catalog; P1; negative, regression.
- **Preconditions / data:** Clean Home; `test-data/catalog.json`, configured unmatched term and primary product.
- **Steps:** 1. Submit the unmatched term. 2. Check the empty result state. 3. Click Reset. 4. Inspect the query and catalog.
- **Expected result:** The application displays its no-results state and no product cards for that query. Reset clears the search and restores products including the primary product; the user is not stranded in an empty catalog.
- **Automation decision:** Automate; combines an important negative result with the recovery action users need.
- **Traceability:** [Strategy CAT-003](automation-strategy.md#cat-003); `tests/catalog.spec.ts` — `CAT-003 no-match search can be reset`.

### CAT-004 — Category filter restricts results

- **Module / priority / type:** Catalog; P1; positive, regression.
- **Preconditions / data:** Clean Home without search; `test-data/catalog.json`, category `Pliers`.
- **Steps:** 1. Select the Pliers category filter. 2. Wait for filtered results. 3. Inspect their names and open a result to verify its category identity where shown.
- **Expected result:** The selected filter is checked, results are nonempty, and returned products belong to Pliers. A request/query check can support synchronization but does not replace the visible product assertion.
- **Automation decision:** Automate; category discovery has high repeat value and a stable configured category.
- **Traceability:** [Strategy CAT-004](automation-strategy.md#cat-004); `tests/catalog.spec.ts` — `CAT-004 category filter restricts results`.

### CAT-005 — Price sort orders visible results

- **Module / priority / type:** Catalog; P1; positive, regression.
- **Preconditions / data:** Clean Home; `test-data/catalog.json`, ascending and descending price options; at least two available cards.
- **Steps:** 1. Select ascending price order. 2. Read all visible card prices. 3. Select descending price order. 4. Read the updated prices.
- **Expected result:** Each list has at least two prices; ascending prices are nondecreasing and descending prices are nonincreasing. Equal prices are allowed. This verifies the visible page, not every page of the catalog.
- **Automation decision:** Automate; numeric ordering is stable to assert even when individual prices change.
- **Traceability:** [Strategy CAT-005](automation-strategy.md#cat-005); `tests/catalog.spec.ts` — `CAT-005 price sort orders visible results`.

### CAT-006 — Combined filters and pagination remain understandable

- **Module / priority / type:** Catalog; P2; exploratory, usability.
- **Preconditions / data:** Clean Home; `test-data/catalog.json` and [manual catalog data](#manual-data).
- **Steps:** 1. Combine keyword, category, an available brand and a displayed price range. 2. Change sorting. 3. Navigate pages if results span pages. 4. Clear one filter at a time, then reset the search.
- **Expected result:** Results satisfy the active visible constraints, sorting is preserved while paging, selected filters remain understandable, and clearing controls restores matching products. Note exactly which controls Reset clears rather than assuming it clears every filter.
- **Automation decision:** Manual; the combinatorial space and public brand/range changes make a focused exploratory charter more valuable than many brittle examples.
- **Execution status (11 September 2026):** Not executed as a complete charter. Catalog controls were inspected during automation work, but that partial exploration is not a CAT-006 pass.
- **Traceability:** [Strategy CAT-006](automation-strategy.md#cat-006); manual evidence belongs in `docs/observations.md`.

## Product and cart

### CART-001 — Product details add the selected item to cart

- **Module / priority / type:** Product / cart; P0; positive, regression.
- **Preconditions / data:** Clean Home and empty cart; `test-data/catalog.json`, primary product, quantity 1.
- **Steps:** 1. Open the configured product. 2. Capture its title and unit price. 3. Add one unit. 4. Open the cart through the cart control.
- **Expected result:** Addition succeeds and the cart contains the selected product at quantity 1. Its unit price and line total match the captured product price; the cart badge reflects one unit.
- **Automation decision:** Automate, including `@mobile`; this is the essential purchase entry point.
- **Traceability:** [Strategy CART-001](automation-strategy.md#cart-001); `tests/cart.spec.ts` — `CART-001 product details add the selected item to cart`.

### CART-002 — Quantity changes recalculate the cart total

- **Module / priority / type:** Cart; P0; boundary, regression.
- **Preconditions / data:** Independent cart fixture with one primary-product unit; `test-data/catalog.json`, target quantity 2.
- **Steps:** 1. Open the cart and capture unit price. 2. Change quantity from 1 to 2 and commit the edit using the observed UI behavior. 3. Inspect line total, cart total and quantity.
- **Expected result:** The persisted quantity is 2, the line total is unit price × 2, and the single-line cart total equals that line total. Calculations use cents to avoid binary floating-point mismatches.
- **Automation decision:** Automate, including `@mobile`; incorrect totals directly affect purchase confidence and expose update/synchronization errors.
- **Traceability:** [Strategy CART-002](automation-strategy.md#cart-002); `tests/cart.spec.ts` — `CART-002 quantity changes recalculate the cart total`.

### CART-003 — Removing the last item empties the cart

- **Module / priority / type:** Cart; P1; positive, boundary.
- **Preconditions / data:** Independent cart fixture containing only the primary product; `test-data/catalog.json`.
- **Steps:** 1. Remove the product from the cart. 2. Inspect the cart and checkout action. 3. Reopen the cart or reload to verify persisted removal.
- **Expected result:** The removed product stays absent and the empty-cart message appears. Checkout cannot advance with an empty cart, and the cart badge no longer indicates a retained product.
- **Automation decision:** Automate; catches stale cart state and protects the common edit-before-purchase path.
- **Traceability:** [Strategy CART-003](automation-strategy.md#cart-003); `tests/cart.spec.ts` — `CART-003 removing the last item empties the cart`.

### CART-004 — Quantity boundaries and out-of-stock behavior

- **Module / priority / type:** Product / cart; P1; negative, boundary, exploratory.
- **Preconditions / data:** Fresh context; configured purchasable product plus a currently visible out-of-stock product if available; [manual quantity data](#manual-data).
- **Steps:** 1. Exercise the product quantity control at its minimum and displayed maximum. 2. Try zero, negative, decimal, empty and unusually large cart quantities. 3. Inspect totals and validation after each edit. 4. Attempt to add an explicitly out-of-stock product using its normal UI.
- **Expected result:** Accepted quantities are positive integers within advertised limits; invalid entries cannot create negative/invalid totals or a purchasable invalid line. An explicitly unavailable product cannot be successfully added. Record observed limits and any discrepancy; do not invent a stock maximum.
- **Automation decision:** Manual; supported limits and stock are mutable, so first characterize the behavior before locking a boundary contract into automation.
- **Execution status (11 September 2026):** Not executed as a complete charter. Automated quantity 1 → 2 and last-item removal coverage does not execute the listed boundaries or out-of-stock probes.
- **Traceability:** [Strategy CART-004](automation-strategy.md#cart-004); manual evidence belongs in `docs/observations.md`.

## Authentication

### AUTH-001 — Register a disposable synthetic customer

- **Module / priority / type:** Registration; P0; positive, regression.
- **Preconditions / data:** Signed out; `test-data/users.json` profile; a unique candidate-owned disposable email and runtime password meeting the current form rules. No shared seeded account.
- **Steps:** 1. Navigate from Sign in to registration. 2. Fill the synthetic first/last name, birth date, country, postal code, house number, street, city, state, phone, email and runtime password. 3. Verify address fields after any lookup/autofill, then submit registration. 4. Sign in with those same newly created credentials.
- **Expected result:** Registration succeeds without field errors; the new credentials authenticate and the account page identifies the synthetic customer. Success is established by an actual login, not only by a redirect.
- **Automation decision:** Automate; registration is business-critical and uniqueness makes setup repeatable without depending on a shared account.
- **Traceability:** [Strategy AUTH-001](automation-strategy.md#auth-001); `tests/auth.spec.ts` — `AUTH-001 register a disposable synthetic customer`.

### AUTH-002 — Customer can sign in and sign out

- **Module / priority / type:** Authentication; P0; positive, regression.
- **Preconditions / data:** Independently provisioned disposable synthetic customer, signed out in a fresh context; `test-data/users.json` and runtime credentials.
- **Steps:** 1. Sign in with that customer's valid credentials. 2. Verify the account identity. 3. Use the account menu to sign out. 4. Open a protected account route again.
- **Expected result:** Valid login shows the expected synthetic customer. Sign out restores the anonymous state; reopening the account route requires authentication and does not expose the previous account view.
- **Automation decision:** Automate, including `@mobile`; session transitions affect every signed-in purchase.
- **Traceability:** [Strategy AUTH-002](automation-strategy.md#auth-002); `tests/auth.spec.ts` — `AUTH-002 customer can sign in and sign out`.

### AUTH-003 — Invalid credentials are rejected

- **Module / priority / type:** Authentication; P1; negative.
- **Preconditions / data:** Signed-out fresh context; `test-data/users.json`, unregistered synthetic identity and runtime incorrect password.
- **Steps:** 1. Open Sign in. 2. Submit the invalid credentials once. 3. Inspect the error and session state.
- **Expected result:** A visible authentication error explains that login failed. The user remains signed out and cannot access the account page. This is a single negative attempt, not a lockout or brute-force test.
- **Automation decision:** Automate; cheap deterministic negative coverage protects the authentication boundary.
- **Traceability:** [Strategy AUTH-003](automation-strategy.md#auth-003); `tests/auth.spec.ts` — `AUTH-003 invalid credentials are rejected`.

### AUTH-004 — Registration requires mandatory fields

- **Module / priority / type:** Registration; P1; negative.
- **Preconditions / data:** Signed out; empty registration form; `test-data/users.json` identifies the profile fields used by the positive case.
- **Steps:** 1. Open registration. 2. Submit with mandatory fields blank. 3. Inspect representative identity and credential field validation.
- **Expected result:** Registration remains incomplete; visible required-field errors appear for empty mandatory fields and no account-success state is shown. Assertions target the current required controls rather than every incidental message.
- **Automation decision:** Automate; fast validation coverage complements the valid-registration case without generating an account.
- **Traceability:** [Strategy AUTH-004](automation-strategy.md#auth-004); `tests/auth.spec.ts` — `AUTH-004 registration requires mandatory fields`.

### AUTH-005 — Registration boundaries and duplicate identity

- **Module / priority / type:** Registration; P1; negative, boundary, exploratory.
- **Preconditions / data:** Signed out; `test-data/users.json`, separately provisioned synthetic account for duplicate email, and [manual registration data](#manual-data).
- **Steps:** 1. Try malformed email, an obviously weak password and a future birth date individually. 2. Correct the input and inspect recovery. 3. Attempt registration once with the disposable account's existing email. 4. Inspect validation association and entered-data preservation.
- **Expected result:** Invalid data cannot create a valid customer; errors explain the relevant condition. Duplicate identity is rejected without replacing the existing account. Corrections can clear validation without unnecessarily losing unrelated data. Compare password validation with the displayed minimum-eight-character, uppercase/lowercase, number and special-character rules; record the age rule before claiming a specific age boundary.
- **Automation decision:** Manual; required-field and happy-path coverage are already automated, while evolving validation rules deserve focused characterization.
- **Execution status (11 September 2026):** Partially explored, not passed. Required-field copy and contradictory password-length guidance were observed; malformed email, future birth date, recovery, and duplicate-identity checks remain unrun.
- **Traceability:** [Strategy AUTH-005](automation-strategy.md#auth-005); manual evidence belongs in `docs/observations.md`.

## Checkout

### CHK-001 — Guest checkout requires customer identity

- **Module / priority / type:** Checkout; P0; negative, regression.
- **Revision:** MCP inspection on 11 September 2026 invalidated mandatory sign-in: Continue as Guest is explicitly supported. See observations.md; ID retained.
- **Preconditions / data:** Signed out with an independent one-product cart; test-data/catalog.json.
- **Steps:** 1. Review cart and proceed. 2. Verify login/registration choices. 3. Select Continue as Guest and submit without identity. 4. Inspect required errors and payment gate. 5. Reload and verify retained cart.
- **Expected result:** Email, first name and last name are required; blank guest identity cannot advance to payment or order confirmation. Cart identity, quantity and totals persist.
- **Automation decision:** Automate, including @mobile; validates the supported checkout identity gate.
- **Traceability:** Strategy CHK-001; tests/checkout.spec.ts — CHK-001 guest checkout requires customer identity.

### CHK-002 — Customer completes a synthetic checkout

- **Module / priority / type:** Checkout; P0; positive, regression.
- **Preconditions / data:** Independent disposable synthetic account and primary-product cart; `test-data/users.json`, `test-data/catalog.json`, `test-data/checkout.json`; supported practice payment method confirmed during exploration.
- **Steps:** 1. Review cart identity, quantity and total. 2. Proceed through the signed-in checkout step. 3. Fill or verify synthetic billing details. 4. Select the supported practice payment method and complete its required synthetic fields. 5. Confirm payment/order using the visible controls.
- **Expected result:** Payment succeeds in the practice application and the final order/invoice confirmation is visible with a nonempty order reference. The test follows every required confirmation step; a successful payment banner alone is not sufficient proof of order completion.
- **Automation decision:** Automate, including `@mobile`; this is the highest-value end-to-end purchase flow and validates the joined modules.
- **Traceability:** [Strategy CHK-002](automation-strategy.md#chk-002); `tests/checkout.spec.ts` — `CHK-002 customer completes a synthetic checkout`.

### CHK-003 — Checkout validation and back-navigation preserve intent

- **Module / priority / type:** Checkout; P1; negative, usability, exploratory.
- **Preconditions / data:** Independent signed-in synthetic account and cart; `test-data/checkout.json` and [manual checkout data](#manual-data).
- **Steps:** 1. Clear a required address field and attempt to continue. 2. Correct the address. 3. Omit a required payment selection/field and attempt confirmation. 4. Return to earlier supported steps, alter quantity if allowed, and continue again.
- **Expected result:** Invalid input blocks advancement with relevant validation. Corrected input allows progression. Cart identity/quantity and totals remain consistent with the user's last accepted edits; moving backwards must not silently submit an order or duplicate it.
- **Automation decision:** Manual; branching stepper behavior and method-specific validation need exploration before selecting stable additional regression paths.
- **Execution status (11 September 2026):** Not executed. CHK-001/002 do not cover the address correction, payment omission, and supported back-navigation sequence in this charter.
- **Traceability:** [Strategy CHK-003](automation-strategy.md#chk-003); manual evidence belongs in `docs/observations.md`.

## Navigation, compatibility and exploration

### NAV-001 — Customer can return from a product to the catalog

- **Module / priority / type:** Navigation; P1; regression, usability.
- **Preconditions / data:** Fresh context; `test-data/catalog.json`, primary product.
- **Steps:** 1. Open the product from Home. 2. Use the available Home/logo navigation to return. 3. On mobile, expand the navigation menu when needed. 4. Inspect the restored catalog.
- **Expected result:** Navigation is operable, returns to the catalog route, and displays products including the configured primary product. A URL assertion alone is insufficient; the destination must be usable.
- **Automation decision:** Automate, including `@mobile`; protects a basic recovery route and mobile navigation toggle at low maintenance cost.
- **Traceability:** [Strategy NAV-001](automation-strategy.md#nav-001); `tests/navigation.spec.ts` — `NAV-001 customer can return from a product to the catalog`.

### NAV-002 — Contact and language navigation are usable

- **Module / priority / type:** Navigation; P2; usability, exploratory.
- **Preconditions / data:** Fresh anonymous context; [manual navigation data](#manual-data).
- **Steps:** 1. Open Contact and inspect labels and required controls without sending a message. 2. Return Home using the site navigation. 3. Switch to another displayed language if a language control exists. 4. Inspect key navigation and restore English.
- **Expected result:** Contact opens a usable form; Home returns to the catalog. Where supported, the language selection updates core labels without broken navigation. Record partial translation or an unavailable language control rather than claiming a localization audit.
- **Automation decision:** Manual; secondary to purchase risk and translation correctness requires human review.
- **Execution status (11 September 2026):** Not executed. No complete Contact and language-switch review was recorded.
- **Traceability:** [Strategy NAV-002](automation-strategy.md#nav-002); manual evidence belongs in `docs/observations.md`.

### COMP-001 — Critical flow remains usable across viewport and zoom changes

- **Module / priority / type:** Compatibility; P1; compatibility, usability.
- **Preconditions / data:** Desktop Chromium/Firefox/WebKit plus a mobile viewport; synthetic product/account/checkout data from the three JSON files; [manual viewport data](#manual-data).
- **Steps:** 1. Repeat product selection, cart editing and checkout at narrow portrait and landscape sizes. 2. On desktop, apply 200% browser zoom. 3. Inspect navigation, dialogs, form errors, totals and the final checkout action. 4. Use a physical touch device if one is available, recording its model/browser.
- **Expected result:** Essential controls and text remain reachable without overlapping or clipped checkout actions. Reflow preserves entered data and focus. Automated mobile checks support the happy path; they do not substitute for real-device or visual inspection.
- **Automation decision:** Manual supplement; functional browser coverage is automated by projects, while visual/touch/orientation behavior requires human evaluation.
- **Execution status (11 September 2026):** Partially executed, not passed as the full charter. Pixel 5 emulation at 390 × 844 was exercised; landscape, 200% zoom, and a physical touch device were not tested.
- **Traceability:** [Strategy COMP-001](automation-strategy.md#comp-001); related automated critical IDs are CART-001, CART-002, AUTH-002, CHK-001, CHK-002 and NAV-001.

### A11Y-001 — Keyboard users can discover and purchase a product

- **Module / priority / type:** Accessibility; P1; usability, exploratory.
- **Preconditions / data:** Desktop browser, keyboard and available screen reader; synthetic data from the three JSON files; no personal account information.
- **Steps:** 1. Navigate Home, search and a product using Tab/Shift+Tab/Enter/Space as appropriate. 2. Add a product and edit the cart. 3. Navigate sign-in and checkout forms. 4. Trigger one required-field error and inspect its label, focus and screen-reader announcement. 5. Inspect focus visibility and contrast of key actions.
- **Expected result:** The critical journey has logical visible focus, named controls, no keyboard trap and understandable form errors. Record specific failures with element and reproduction detail. This charter is not a full WCAG conformance assessment.
- **Automation decision:** Manual; human keyboard/screen-reader evaluation has more value here than asserting only that elements exist.
- **Execution status (11 September 2026):** Partially explored, not passed. Accessibility inspection found the unnamed cart-removal control (OBS-001); the full keyboard purchase journey and screen-reader checks remain unrun.
- **Traceability:** [Strategy A11Y-001](automation-strategy.md#a11y-001); manual evidence belongs in `docs/observations.md`.

### EXP-001 — Session and network interruptions have recoverable outcomes

- **Module / priority / type:** Cross-module resilience; P2; exploratory, negative.
- **Preconditions / data:** A disposable synthetic account and cart; three JSON data files; browser developer tools. Time-box to 20 minutes and keep request volume low.
- **Steps:** 1. Refresh after a cart edit and after reaching a checkout step. 2. Open a second tab and observe session/cart synchronization. 3. Briefly switch the browser offline before a read or cart update, then restore connectivity. 4. Observe expired/logged-out session recovery before confirming any order.
- **Expected result:** Accepted changes are not silently lost, failures are visible, and recovery leaves understandable cart/session state without duplicate orders. Record unexpected behavior as an observation with evidence rather than guessing an undocumented synchronization guarantee.
- **Automation decision:** Manual; interrupted-network/session behavior has uncertain contracts on the shared public service and merits a bounded exploratory charter.
- **Execution status (11 September 2026):** Not executed. Incidental public-site timeouts are documented separately and do not count as the controlled interruption/recovery charter.
- **Traceability:** [Strategy EXP-001](automation-strategy.md#exp-001); manual evidence belongs in `docs/observations.md`.

### N/A-001 — Real payment settlement and delivery

- **Module / priority / type:** External fulfillment; P2; compatibility / not applicable.
- **Preconditions / data:** None; no real payment, customer or delivery data may be used.
- **Steps:** 1. Confirm the target is the Toolshop practice application. 2. Limit checkout to its synthetic method and stop at the practice order confirmation. 3. Record real settlement and delivery as outside this environment's scope.
- **Expected result:** No real payment or fulfillment transaction is attempted. The practice application's completion is covered by CHK-002; it provides no evidence about banking or physical delivery.
- **Automation decision:** Not applicable; real payment/fulfillment is outside the practice system and prohibited data scope.
- **Traceability:** [Strategy N/A-001](automation-strategy.md#na-001); no spec.

## Manual data

| Area | Reproducible input set / selection rule |
| --- | --- |
| Catalog | Keyword `pliers`; category `Pliers`; one brand currently displayed; a price range that includes the primary product's current price, then a nonoverlapping range; use actual page controls if present. |
| Quantity | `0`, `-1`, `1`, `2`, `1.5`, empty, `999`, and the advertised min/max and one beyond each when visible. Do not infer a valid stock limit from 999. |
| Registration | Malformed email `qa-invalid`; weak-password input `short` only for rejected validation; a birth date one year in the future; duplicate email from a disposable account created for this session. Valid passwords remain runtime-only. |
| Checkout | One required billing field empty; no payment method selected; one required method-specific field empty when supported. Reuse the valid synthetic profile for recovery. |
| Navigation | English plus one other language actually displayed; do not submit the Contact form. |
| Viewport | Mobile portrait 390 × 844, mobile landscape 844 × 390, desktop 1280 × 720 at normal zoom and 200% browser zoom. Record actual tested dimensions and browser versions. |

## Execution and change control

The design records intended coverage, not execution results. Record live discoveries and limitations in `docs/observations.md`; use the HTML report as the automated execution record. If the live UI lacks a planned control or required step, document the closest supported behavior and update this design, strategy and README consistently before implementing a replacement. Do not count skipped/unrun/manual scenarios as automated passes.

The first meaningful repository commit must include this document and the initial strategy with no Playwright test files. Subsequent changes preserve IDs so reviewers can follow design → implementation → report.


