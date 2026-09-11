# Test Plan

## Objective
Provide a clear, testable plan to validate Toolshop application functionality, stability, compatibility, and readiness for release.

## Scope
- Functional flows: catalog, product details, cart, checkout, authentication, navigation.
- Cross-browser: Chromium, Firefox, WebKit; mobile Chromium.
- Automation of P0/P1 regression scenarios; manual/exploratory for complex UX.

## Out of scope
- Performance/load testing
- Accessibility full audits (high-level checks only)
- Backend non-functional tests not reachable via UI

## Application under test
Toolshop (web) — product catalog, shopping cart, checkout, authentication, and user flows per `README.md`.

## Test approach
- Automated Playwright tests for regression and critical paths.
- Manual exploratory sessions for UX, edge cases, and intermittent behaviors.
- Data-driven tests for checkout permutations.

## Functional testing
- Catalog browsing
- Product details correctness
- Add/remove from cart
- Update quantities and totals
- Login/logout and account behavior
- Checkout and order confirmation

## Negative testing
- Invalid inputs (quantities, promo codes)
- Unauthorized access to protected routes
- Invalid payment details (synthetic data)
- Missing mandatory fields during checkout

## Boundary/edge testing
- Quantity 0, 1, large numbers
- Empty cart behaviors
- Partial network interruption during checkout

## Exploratory testing
- Session: checkout retry flows
- Session: cart concurrency (two tabs)
- Session: localization/formatting checks

## Compatibility testing
- Desktop browsers: Chromium, Firefox, WebKit
- Mobile viewport: mobile-chromium project
- OS neutral (macOS/Linux/Windows CI where available)

## Mobile testing
- Mobile viewport for critical flows
- Touch interactions where applicable
- Responsive layout checks

## Automation strategy
- Automate P0 (critical) and P1 (high) scenarios first.
- Use Page Object Model for stable locators and actions.
- Keep tests deterministic: network waitForResponse when validating remote actions.

## Test environment
- Node >=22 (as specified)
- Playwright browsers installed via `npx playwright install`
- CI: reproducible `npm ci` with `package-lock.json`
- Environment variables in `.env` (ignored in repo) with `.env.example`

## Test data strategy
- Use `test-data/` JSON fixtures for product and checkout permutations.
- Synthetic user accounts generated at runtime where needed.
- No real PII or payment data in repository.

## Entry criteria
- Application deployed or accessible locally at `baseURL`.
- Dependencies installed (`npm ci`) and browsers installed.
- Test data fixtures present.

## Exit criteria
- All P0 tests pass or have documented, reproducible failure reasons.
- No open critical defects blocking release.
- Evidence (screenshots/traces) captured for failures.

## Defect management
- Log defects with ID, title, steps, severity, and evidence.
- Link failing test IDs to defects in `observations.md`.

## Reporting/evidence
- HTML report (`playwright show-report`) per run.
- Screenshots and traces retained for failures.
- Test run summary in `README.md` final results.

## Risks
- Third-party service flakiness
- Race conditions in UI
- Browser-specific rendering differences

## Assumptions
- Tests run against a stable test environment or local server.
- No production credentials are used.

## Limitations
- Some UX flows may remain manual due to complexity.
- Limited device matrix (only mobile Chromium emulation).

## Deliverables
- `docs/test-plan.md` (this file)
- `docs/test-plan.xlsx` (test case matrix)
- Automated test suite in `tests/`
- Final execution report and evidence

## Future improvements
- Broaden device matrix, integrate CI matrix runs
- Add synthetic payment gateway stubs for more checkout coverage
- Add accessibility automation checks

---

Appendix: Test case matrix (exported to `docs/test-plan.xlsx`) — include columns:
- ID | Title | Module | Priority | Preconditions | Test data | Steps | Expected result | Type | Automation decision | Automation notes | Traceability

