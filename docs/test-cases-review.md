# Test Cases Review — summary

Reviewed: all test files under `tests/` and `docs/test-cases.md`.

Files scanned:
- tests/catalog.spec.ts
- tests/cart.spec.ts
- tests/checkout.spec.ts
- tests/auth.spec.ts
- tests/navigation.spec.ts

Summary results
- Total implemented automated test cases found: 15
  - Catalog: CAT-001..CAT-005 (5)
  - Cart: CART-001..CART-003 (3)
  - Checkout: CHK-001..CHK-002 (2)
  - Auth: AUTH-001..AUTH-004 (4)
  - Navigation: NAV-001 (1)

Conformance to assignment requirements (per-test checklist)
- Every test has an ID and descriptive title in the Playwright `test()` name: OK.
- Module is derivable from ID prefix: OK.
- Priority is defined in `docs/test-cases.md` but not encoded in test code or annotations: ACTION — consider adding a small structured tag or comment to tests (e.g., `test('CART-001 ...', { priority: 'P0' }, ...)` or consistent `@P0` tags) to make automated runs filterable.
- Preconditions, test data, steps, expected result, test type, automation decision and traceability are documented in `docs/test-cases.md`: OK (the doc contains detailed entries per ID).
- Traceability to code is present in `docs/test-cases.md` where it references the test file and title: OK.
- No duplicate test IDs found in `tests/`: OK.
- Negative and edge cases: present for key flows (CHK-001, AUTH-003, AUTH-004, CAT-003, CART-003). Recommendation: add explicit boundary cases for quantities and out-of-stock (CART-004 noted in docs but not implemented).

Gaps and recommendations (actionable)
1. Add priority metadata to test definitions or use consistent tags
   - Why: Enables selective runs by criticality and matches assignment checks (P0/P1/P2).
   - How: Add `test.skip` logic or use Playwright project tags, e.g. `test('CART-001 ...', { tags: ['P0'] }, ...)` or keep a mapping in `docs/test-cases.md` and use filtering scripts.

2. Implement missing boundary tests that are in the plan but not automated
   - `CART-004` (quantity boundaries, out-of-stock) — plan exists in docs but not coded. Consider adding automated variants for numeric boundaries that are stable.

3. Add small header comment block to each `tests/*.spec.ts` file documenting: ID list, priority mapping, and required fixtures
   - Why: Quick reviewer-friendly traceability without opening `docs/`.

4. Ensure automation decisions include precise implementation references
   - Update `automation-strategy.md` to list the exact test file and function name for each automated case.

5. Capture test data expectations in `test-data/` or inline fixtures
   - Example: include a `README` or header that explains `test-data/catalog.json` expected keys and how tests choose `catalog.product`.

6. Make assertions more explicit where needed (spot-check)
   - Example: In `CAT-001`, a price > 0 is asserted — consider adding a visible 'Add to cart' control assertion to ensure purchasability is visible.

Per-test quick notes (only deviations or recommended improvements)
- CAT-001: OK. Suggest assert that Add-to-cart button is visible on the product page.
- CAT-002: OK.
- CAT-003: OK.
- CAT-004: OK.
- CAT-005: OK.

- CART-001: OK.
- CART-002: OK — test reload persistence is good.
- CART-003: OK.
- (CART-004 present in docs but not implemented) — add automated checks for numeric boundaries if the application enforces a numeric limit.

- CHK-001: Implemented as asserted. This is high-value for triage — next step: reproduce in WebKit and run several times (item 4).
- CHK-002: OK — long flow; good use of `test.step` and `setTimeout` for stability.

- AUTH-001..AUTH-004: OK. Suggest centralizing user creation in fixtures (already in `test-data/users.ts`) and ensuring no persisted accounts remain between runs.

- NAV-001: OK.

Conclusion & next action
- The implemented test set maps to the documented test cases in `docs/test-cases.md`. The main practical gaps are (a) missing automated boundary tests (CART-004) and (b) a lack of in-test structured priority metadata and lightweight header traceability.

Next step (per your workflow)
- I can (A) start reproducing `CHK-001` in WebKit as requested, running it repeatedly and collecting traces/screenshots; or (B) implement `CART-004` automated boundaries first; or (C) add priority tags/comments to all tests now.

Tell me which of A/B/C you want next and I'll proceed. If you want, I can start with reproducing CHK-001 in WebKit (recommended).