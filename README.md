# Toolshop Playwright QA Automation

A risk-based **Playwright + TypeScript** QA automation framework for the public [Practice Software Testing – Toolshop](https://practicesoftwaretesting.com/) application.

This repository was developed as part of an **Associate QA Automation Engineer take-home assessment**. The focus is not simply on the number of automated tests, but on demonstrating practical QA engineering judgment through:

* Risk-based test design
* Appropriate automation decisions
* Stable locator strategies
* Page Object Model architecture
* Isolated and synthetic test data
* Cross-browser execution
* Failure evidence and reporting
* Manual/exploratory coverage
* Clear test documentation and traceability

---

## 1. Application Under Test

**Application:** Practice Software Testing – Toolshop
**URL:** https://practicesoftwaretesting.com/

The application is a publicly hosted practice environment and may change independently of this repository. Product availability, stock, catalog content, form behavior, response times, and generated data may therefore vary.

The framework avoids relying on hardcoded generated IDs and uses business-level assertions wherever practical.

---

## 2. Coverage Summary

The test-design pack contains **24 scenarios**:

| Coverage             |  Count |
| -------------------- | -----: |
| Automated            |     15 |
| Manual / Exploratory |      8 |
| Not Applicable       |      1 |
| **Total**            | **24** |

### Automated scenarios

| Area           | IDs                     | Coverage                                                                 |
| -------------- | ----------------------- | ------------------------------------------------------------------------ |
| Catalog        | `CAT-001` – `CAT-005`   | Product availability, search, reset, category filtering, price sorting   |
| Cart           | `CART-001` – `CART-003` | Add to cart, quantity/total calculation, removal and empty-cart behavior |
| Authentication | `AUTH-001` – `AUTH-004` | Registration, login/logout, invalid login and required-field validation  |
| Checkout       | `CHK-001` – `CHK-002`   | Guest identity validation and synthetic signed-in checkout               |
| Navigation     | `NAV-001`               | Returning from product details to the catalog                            |

The complete test design, automation strategy, observations, execution notes, and Excel QA pack are available under [`docs/`](docs/).

The Markdown test design and Excel workbook were reconciled on **11 September 2026**.

---

# 3. Technology Stack

| Component        | Version / Configuration      |
| ---------------- | ---------------------------- |
| Node.js          | `>= 22`                      |
| npm              | Included with Node.js        |
| TypeScript       | Project configured           |
| Playwright Test  | `1.63.0`                     |
| Desktop browsers | Chromium, Firefox, WebKit    |
| Mobile coverage  | Chromium + Pixel 5 emulation |
| Mobile viewport  | `390 × 844`                  |
| Desktop viewport | `1440 × 1000`                |

The project was locally prepared using Node.js 24.x / npm 11.x, while `package.json` supports Node.js **22 or newer**.

---

# 4. Project Structure

```text
Kupesh QA/
│
├── .agents/
│   └── skills/
│       ├── playwright-qa/
│       ├── bug-investigation/
│       ├── test-data-fixtures/
│       └── assignment-review/
│
├── docs/
│   ├── test-cases.md
│   ├── test-cases.xlsx
│   ├── automation-strategy.md
│   ├── observations.md
│   ├── session-report.md
│   └── submission-review.md
│
├── fixtures/
│   └── test.ts
│
├── pages/
│   ├── AuthPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── HomePage.ts
│   ├── Navigation.ts
│   └── ProductPage.ts
│
├── test-data/
│   ├── catalog.json
│   ├── checkout.json
│   ├── users.json
│   └── users.ts
│
├── tests/
│   ├── auth.spec.ts
│   ├── cart.spec.ts
│   ├── catalog.spec.ts
│   ├── checkout.spec.ts
│   └── navigation.spec.ts
│
├── scripts/
│   ├── generate_matrix_report.js
│   ├── generate_report_pdf.js
│   └── run_project_with_pdf.js
│
├── utils/
│   └── money.ts
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

### Folder responsibilities

| Folder            | Responsibility                                           |
| ----------------- | -------------------------------------------------------- |
| `tests/`          | Business-facing automated scenarios                      |
| `pages/`          | Page Objects, selectors and reusable UI interactions     |
| `fixtures/`       | Reusable and isolated test setup                         |
| `test-data/`      | Synthetic users and external test data                   |
| `scripts/`        | Test execution and report-generation helpers             |
| `utils/`          | Focused shared utilities                                 |
| `docs/`           | Test design, strategy, observations and QA documentation |
| `.agents/skills/` | Optional AI-assisted development/review instructions     |

The `.agents/skills/` directory is **not required to execute the Playwright suite**.

---

# 5. Start From Zero

The commands below assume **Windows PowerShell**.

## 5.1 Install Node.js

Install a current Node.js LTS release from the official Node.js website.

After installation, restart VS Code and PowerShell so the updated `PATH` is available.

Verify:

```powershell
node -v
npm -v
npx -v
```

Example development environment:

```text
node v24.21.0
npm  11.19.0
npx  11.19.0
```

If `node` is not recognized, verify that the following directory exists and is included in the Windows `PATH`:

```text
C:\Program Files\nodejs\
```

---

## 5.2 Clone or Open the Repository

Clone the repository:

```powershell
git clone <repository-url>
cd "Kupesh QA"
```

If the project already exists locally, open the project folder in VS Code and verify the terminal is at the repository root:

```powershell
pwd
```

The root directory should contain:

```text
package.json
playwright.config.ts
tests/
pages/
docs/
```

---

## 5.3 Install Dependencies

For a clean reviewer installation:

```powershell
npm ci
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`.

For normal local development:

```powershell
npm install
```

Do not commit:

```text
node_modules/
```

---

## 5.4 Install Playwright Browsers

Install all required browser engines:

```powershell
npm run browsers:install
```

Equivalent:

```powershell
npx playwright install chromium firefox webkit
```

Verify the Playwright version:

```powershell
npx playwright --version
```

Expected:

```text
Version 1.63.0
```

---

## 5.5 Verify TypeScript

Run:

```powershell
npm run typecheck
```

This executes:

```text
tsc --noEmit
```

A successful run should complete without TypeScript errors.

---

## 5.6 Verify Test Discovery

Optional but recommended:

```powershell
npx playwright test --list
```

This confirms that Playwright can discover the configured tests and projects without launching the browsers.

---

# 6. Running the Tests

## Chromium

Headless:

```powershell
npm run test:chromium
```

Equivalent:

```powershell
npx playwright test --project=chromium
```

Headed:

```powershell
npx playwright test --project=chromium --headed
```

---

## Run a Specific Spec

Catalog:

```powershell
npx playwright test tests/catalog.spec.ts --project=chromium --headed
```

Authentication:

```powershell
npx playwright test tests/auth.spec.ts --project=chromium --headed
```

Cart:

```powershell
npx playwright test tests/cart.spec.ts --project=chromium --headed
```

Checkout:

```powershell
npx playwright test tests/checkout.spec.ts --project=chromium --headed
```

Navigation:

```powershell
npx playwright test tests/navigation.spec.ts --project=chromium --headed
```

---

## Run a Specific Test

For example:

```powershell
npx playwright test --project=chromium --headed -g "CAT-001"
```

Or:

```powershell
npx playwright test tests/auth.spec.ts --project=chromium --headed -g "AUTH-001"
```

---

## Firefox

```powershell
npm run test:firefox
```

## WebKit

```powershell
npm run test:webkit
```

## Mobile Chromium

```powershell
npm run test:mobile
```

The mobile project uses **Pixel 5 emulation** at `390 × 844`.

Current `@mobile` critical flows include:

* `AUTH-002`
* `CART-001`
* `CART-002`
* `CHK-001`
* `CHK-002`
* `NAV-001`

This represents browser/device emulation and should not be interpreted as physical-device testing or real iOS Safari testing.

---

# 7. Full Browser Matrix

Run the complete configured matrix with:

```powershell
npm test
```

The configured matrix contains:

| Project                   |  Tests |
| ------------------------- | -----: |
| Chromium                  |     15 |
| Firefox                   |     15 |
| WebKit                    |     15 |
| Mobile Chromium           |      6 |
| **Configured executions** | **51** |

The suite uses:

* **1 worker**
* **1 retry**

The retry does not increase the designed/configured test count.

A test is classified as **flaky** when the first attempt fails and the retry passes. If both attempts fail, the test remains failed.

The single-worker configuration is intentional because the tests target a shared public service where parallel execution could increase state contention and environmental instability.

---

# 8. Recommended Execution Order

For development and debugging, start with individual projects rather than immediately executing the complete matrix.

```powershell
npm run typecheck

npm run test:chromium

npm run test:firefox

npm run test:webkit

npm run test:mobile
```

Once the individual projects are understood and stable:

```powershell
npm test
```

When investigating a failure, rerun the affected spec or test ID before rerunning the complete suite.

---

# 9. Headed, UI and Debug Modes

## Headed mode

```powershell
npm run test:headed
```

## Playwright UI mode

```powershell
npm run test:ui
```

UI mode is useful during development for selecting tests, inspecting execution steps and rerunning scenarios.

## Debug mode

```powershell
npm run test:debug
```

Or debug a specific test:

```powershell
npx playwright test tests/auth.spec.ts --project=chromium -g "AUTH-001" --debug
```

---

# 10. Framework Architecture

## Page Object Model

The framework uses Page Objects to separate UI implementation details from business-facing test scenarios.

Implemented Page Objects include:

* `HomePage`
* `ProductPage`
* `CartPage`
* `AuthPage`
* `CheckoutPage`
* `Navigation`

The framework intentionally avoids creating unnecessary Page Objects purely to increase the number of classes.

---

## Locator Strategy

The preferred locator hierarchy is:

1. `getByRole()`
2. `getByLabel()`
3. `getByTestId()`
4. `getByPlaceholder()`
5. Scoped text locators
6. Robust CSS selectors only where semantic hooks are unavailable

The configured Playwright test ID attribute is:

```text
data-test
```

One documented exception exists for cart removal because the live application currently exposes an unnamed, non-semantic anchor. This is documented as `OBS-001`.

---

## Synchronization Strategy

The framework relies on Playwright's built-in auto-waiting and web-first assertions.

Fixed sleeps such as:

```typescript
waitForTimeout(...)
```

are intentionally avoided.

For example, authentication navigation waits for `domcontentloaded` and then verifies that the actual login fields are available and editable.

This avoids unnecessarily waiting for unrelated third-party resources.

---

# 11. Test Isolation and Test Data

Each test receives an independent Playwright browser context.

Tests do not rely on another test creating state beforehand.

## Synthetic Users

`test-data/users.ts` generates disposable identities at runtime using a format similar to:

```text
qa.<timestamp>.<uuid>@example.com
```

Passwords are generated in memory and are not stored in committed JSON files.

## Checkout Data

Checkout data is fictional and uses the application's **Cash on Delivery** option.

No real payment card information or sensitive customer information is used.

## Product Data

The primary configured product is currently:

```text
Combination Pliers
```

The framework reads the current price from the live UI and compares monetary values using integer cents rather than relying on a historical hardcoded price.

## Public-Service Cleanup

The practice application does not currently expose a confirmed safe cleanup mechanism for disposable accounts/orders created by the tests.

This limitation is documented rather than hidden.

---

# 12. Environment Variables and Secrets

No secret environment variable is required for normal test execution.

`.env.example` documents optional Playwright process variables:

```text
PLAYWRIGHT_BROWSERS_PATH=
PLAYWRIGHT_REPORT_DIR=
```

Important rules:

* `.env` is not committed.
* The suite does not automatically load `.env`.
* Passwords, tokens, API keys and real customer/payment data must not be committed.
* Generated test data should remain synthetic.

For a custom local browser location:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "C:\path\to\playwright-browsers"
```

For a normal installation, use:

```powershell
npm run browsers:install
```

---

# 13. Playwright Configuration

Key settings in `playwright.config.ts`:

| Setting           | Value                                 |
| ----------------- | ------------------------------------- |
| Base URL          | `https://practicesoftwaretesting.com` |
| Test timeout      | 30 seconds                            |
| Assertion timeout | 5 seconds                             |
| Workers           | 1                                     |
| Retries           | 1                                     |
| Default mode      | Headless                              |
| Trace             | Off                                   |
| Screenshot        | On failure                            |
| Video             | On failure                            |
| Desktop viewport  | `1440 × 1000`                         |
| Mobile viewport   | `390 × 844`                           |
| Test ID attribute | `data-test`                           |

`CHK-002` uses a local **100-second timeout** because it performs synthetic registration, authentication and a complete checkout flow.

The global test timeout remains 30 seconds.

---

# 14. Reports and Failure Evidence

The framework generates Playwright execution reports and retains screenshot/video evidence for failures.

## Open the latest HTML report

```powershell
npm run report
```

Equivalent:

```powershell
npx playwright show-report
```

## Generate a PDF report

```powershell
npm run report:pdf
```

### Project-specific PDF evidence

A wrapper command is provided for generating a project-labeled PDF:

```powershell
npm run test:firefox
```

or:

```powershell
node .\scripts\run_project_with_pdf.js firefox
```

Generated PDFs are written to:

```text
playwright-report-pdfs/
```

Example:

```text
toolshop-playwright-qa-firefox-2026-09-11T18-15-36-718Z-playwright-report.pdf
```

---

## Isolated Final Report

For an isolated final execution:

```powershell
$env:PLAYWRIGHT_REPORT_DIR = "playwright-report-final"

npm test

npm run report:pdf
```

This keeps the final execution and its exported report separate from previous runs.

---

## Failure Evidence

The configured `outputDir` stores generated failure evidence under:

```text
toolshop-playwright-results/
```

Depending on the failure, artifacts may include:

* Screenshots (`.png`)
* Videos (`.webm`)
* `error-context.md`

Trace recording is currently disabled because temporary trace-network files caused false execution failures in the Windows environment.

Historical traces can still be opened when available:

```powershell
npx playwright show-trace "test-results\<failed-test-folder>\trace.zip"
```

Trace Viewer can be used to inspect:

* Action timing
* Locator resolution
* DOM snapshots
* Network activity
* Console messages
* Before/after screenshots

Generated reports and test results are excluded from Git because they can be large and may contain temporary synthetic test values.

---

# 15. Test Design and Traceability

## Test Cases

[`docs/test-cases.md`](docs/test-cases.md) is the primary human-readable test-design document.

It contains:

* Scenario IDs
* Business-focused titles
* Modules
* Priorities
* Preconditions
* Test-data references
* Reproducible steps
* Expected results
* Test type
* Automation decision
* Implementation traceability

---

## Automation Strategy

[`docs/automation-strategy.md`](docs/automation-strategy.md) explains why each scenario is:

* Automated
* Manual / exploratory
* Not applicable

It also maps automated scenarios to their corresponding spec files and test titles.

---

## Excel QA Pack

[`docs/test-cases.xlsx`](docs/test-cases.xlsx) provides a reviewer-friendly QA workbook containing:

1. Test Cases
2. Automation Strategy
3. Coverage Summary
4. Execution Results
5. Locator Register
6. Defects & Observations

The Excel workbook supplements the Markdown documentation rather than replacing it.

The workbook was reconciled on **11 September 2026**.

It currently records:

* All 24 designed scenarios
* Automation decisions
* Five unexecuted manual charters
* Three partially explored manual charters
* No manual scenario incorrectly promoted to a full pass
* Targeted `CHK-002` evidence
* The three-run checkout observation
* `OBS-004` billing resolution
* Remaining final-confirmation instability
* Local repository evidence
* Absence of an authenticated public URL

For result interpretation, use:

* `Status`
* `Notes`
* Dated rows in `Execution Results`

`PARTIAL`, `NOT RUN`, and `FLAKY` are intentionally distinct from `PASS`.

---

# 16. Known Observations and Limitations

Detailed observations and reproduction information are available in:

[`docs/observations.md`](docs/observations.md)

## OBS-001 — Cart Removal Accessibility

The current cart removal control is an unnamed anchor without a useful accessible name or native keyboard behavior.

Automation therefore uses a scoped CSS fallback because the application does not currently expose a stable semantic hook.

---

## OBS-002 — Password Guidance Inconsistency

Registration guidance indicates an eight-character minimum, while another validation message refers to six characters.

The positive automated path deliberately uses a stronger generated password rather than depending on the disputed boundary.

---

## OBS-003 — Checkout Console Initialization Errors

Transient cart initialization exceptions have been observed while the UI subsequently recovers.

Functional scenarios do not automatically fail because of unrelated console noise.

---

## OBS-004 — Mobile Checkout Billing State

A historical `CHK-002` run failed when the billing house-number field was reset during a live form re-render.

The billing implementation was subsequently hardened using bounded assertion/retry behavior and verification that the payment step becomes available.

Fresh verification reached the payment step in **3/3 repetitions**.

Two orders completed successfully, while one failed later during final invoice confirmation.

Therefore:

* Billing-state instability is considered resolved.
* Full `CHK-002` stability is **not** currently claimed.

---

## Public Application Instability

Because the application is a shared public practice environment, occasional navigation/API delays and mutable shared data are possible.

A historical `AUTH-001` run also exposed slow login-page navigation.

The current `AuthPage` waits for `domcontentloaded` and then verifies that the actual login form is usable rather than waiting for every external resource.

The framework intentionally avoids masking public-site failures with arbitrary sleeps or excessive retries.

---

# 17. Latest Execution Evidence

Current execution evidence is documented in:

* [`docs/session-report.md`](docs/session-report.md)
* [`docs/submission-review.md`](docs/submission-review.md)
* `playwright-report/`
* `test-results/`

Latest evidence from **11 September 2026**:

| Verification           | Result                         |
| ---------------------- | ------------------------------ |
| TypeScript validation  | Passed                         |
| Mobile Chromium        | 6 passed / 0 failed            |
| Full configured matrix | 47 passed / 3 flaky / 1 failed |
| Configured executions  | 51                             |
| Final failing scenario | WebKit `CHK-001`               |

The WebKit `CHK-001` failure timed out on its first attempt. Its retry subsequently encountered an `ENOENT` while Playwright attempted to copy a temporary trace-network file.

The three flaky executions were:

* WebKit `AUTH-002`
* WebKit `CART-002`
* Mobile Chromium `CHK-002`

Each passed on retry.

The configured test count remains **51** because retries are execution attempts, not additional designed tests.

---

# 18. Manual and Exploratory Coverage

Eight scenarios are intentionally retained as manual/exploratory coverage.

Examples include:

* Combined filtering and pagination exploration
* Quantity boundary and out-of-stock behavior
* Registration boundary and duplicate-identity behavior
* Checkout validation and back-navigation behavior
* Compatibility/accessibility exploration

The complete definitions are available in:

[`docs/test-cases.md`](docs/test-cases.md)

Current manual status is explicitly recorded:

* 5 scenarios — **Not Run**
* 3 scenarios — **Partially Explored**
* 0 scenarios — incorrectly promoted to a full manual pass

Observations made during automation exploration are not presented as evidence that every manual charter was fully executed.

---

# 19. Optional Codex + Playwright MCP Setup

This section is **optional** and is not required to run the Playwright framework.

It documents the AI-assisted development workflow used to inspect the live UI and validate locator choices.

## Verify Codex

```powershell
codex --version
```

## Add Playwright MCP

```powershell
codex mcp add playwright npx "@playwright/mcp@latest"
```

Verify:

```powershell
codex mcp list
```

Expected entry:

```text
playwright   npx   @playwright/mcp@latest   enabled
```

Optional development skills are stored under:

```text
.agents/skills/
```

Including:

* `playwright-qa`
* `bug-investigation`
* `test-data-fixtures`
* `assignment-review`

These are development/review aids only and are not runtime dependencies.

---

# 20. Troubleshooting

## `node` is not recognized

Restart VS Code/PowerShell after installing Node.js.

Then run:

```powershell
where.exe node
node -v
```

A standard installation is normally located at:

```text
C:\Program Files\nodejs\
```

---

## Playwright browser executable is missing

Run:

```powershell
npm run browsers:install
```

---

## A public-site test times out

Do not immediately increase the timeout or add `waitForTimeout()`.

Instead:

1. Rerun only the failed test.
2. Inspect the screenshot/video/report evidence.
3. Determine whether the cause is:

   * Navigation
   * Test data
   * Locator
   * Synchronization
   * Application behavior
   * Public-environment instability
4. Make the smallest justified change.
5. Document genuine application/environment limitations.

Example:

```powershell
npx playwright test tests/auth.spec.ts --project=chromium --headed -g "AUTH-001"
```

---

## Open the latest report

```powershell
npx playwright show-report
```

---

# 21. Pre-Submission Verification

Before submitting the assessment, perform a clean verification:

```powershell
npm ci

npm run browsers:install

npm run typecheck

npm run test:chromium

npm run test:firefox

npm run test:webkit

npm run test:mobile
```

Then inspect the report:

```powershell
npm run report
```

Any remaining failure should be:

* Reproduced where possible
* Supported by execution evidence
* Classified appropriately
* Documented with the suspected root cause or environmental limitation

A failure should not be hidden simply to produce a clean-looking submission.

---

# 22. Repository

### GitHub

**Repository:** https://github.com/kupesh/PlaywrightAssignment

The repository contains:

* Playwright source code
* Page Objects
* Fixtures
* Test data
* Automated test scenarios
* Test design
* Automation strategy
* Observations
* Execution documentation
* Excel QA pack
* Supporting scripts

### Excluded from the repository

The following are intentionally excluded:

* Generated reports
* Test results
* Playwright browser binaries
* `node_modules/`
* `.env` files
* Temporary build artifacts
* Secrets
* Personal or real customer data

---

# 23. Known Limitations and Future Improvements

## Current limitations

* `CHK-002` can occasionally experience instability during final invoice confirmation on the public practice service.
* Trace recording is disabled because of temporary trace-file cleanup issues in the current Windows environment.
* The public application does not provide a confirmed cleanup mechanism for generated test accounts/orders.
* Manual/exploratory scenarios have not all been fully executed.
* CI/CD integration has not yet been added.

See [`docs/observations.md`](docs/observations.md) for the complete list.

## Future improvements

1. Further stabilize `CHK-002` invoice confirmation across browsers.
2. Execute the remaining manual/exploratory scenarios where full evidence is required.
3. Establish safe account/order cleanup through an available application API.
4. Add CI/CD execution after the cross-browser suite is stable.
5. Expand accessibility-focused coverage while preserving business-level assertions.
6. Continue improving locator quality where the application exposes better semantic hooks.

---

# 24. Quick Start

For a reviewer who already has Node.js installed:

```powershell
# 1. Install exact dependencies
npm ci

# 2. Install browser engines
npm run browsers:install

# 3. Verify TypeScript
npm run typecheck

# 4. Run Chromium tests
npx playwright test --project=chromium --headed

# 5. Run remaining projects
npm run test:firefox
npm run test:webkit
npm run test:mobile

# 6. Open the latest report
npm run report
```

For the complete configured matrix:

```powershell
npm test
```

---

# 25. Assessment Documentation Index

| Document                                                     | Purpose                                           |
| ------------------------------------------------------------ | ------------------------------------------------- |
| [`docs/test-cases.md`](docs/test-cases.md)                   | Detailed test design and scenario definitions     |
| [`docs/test-cases.xlsx`](docs/test-cases.xlsx)               | Reviewer-friendly Excel QA pack                   |
| [`docs/automation-strategy.md`](docs/automation-strategy.md) | Automation/manual decision rationale              |
| [`docs/observations.md`](docs/observations.md)               | Application observations, defects and limitations |
| [`docs/session-report.md`](docs/session-report.md)           | Assessment execution/session evidence             |
| [`docs/submission-review.md`](docs/submission-review.md)     | Final submission review and evidence              |

---

## Assessment Summary

This project demonstrates a **risk-based QA automation approach rather than automation for automation's sake**.

The framework combines:

**15 automated scenarios + 8 manual/exploratory scenarios + 1 N/A**

with:

* Playwright + TypeScript
* Page Object Model
* Stable semantic locators
* Isolated test contexts
* Runtime synthetic test data
* Chromium, Firefox and WebKit coverage
* Mobile browser emulation
* Failure screenshots and videos
* HTML/PDF reporting
* Test-design traceability
* Documented application observations
* Explicit treatment of flaky and environment-related behavior

The goal is to provide a reviewer with both **working automation and evidence of QA engineering judgment**.
