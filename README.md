# Toolshop Playwright QA Automation

A risk-based **Playwright + TypeScript** QA automation framework for the public [Practice Software Testing – Toolshop](https://practicesoftwaretesting.com/) application.

This repository was built for an Associate QA Automation Engineer take-home assessment. The focus is not only test count: the project demonstrates **test design, automation judgement, stable locator strategy, Page Object Model design, isolated test data, cross-browser execution, failure evidence, and clear documentation**.

### Local PDF evidence note

This workspace uses a wrapper route for the downloadable printable PDF artifact. A raw Playwright command such as:

```powershell
npx playwright test --project=firefox
```

writes the HTML/JSON Playwright report, but it does not emit the PDF by itself. To create the project-labeled PDF in the local workspace, use:

```powershell
npm run test:firefox
```

or the direct runner:

```powershell
node .\scripts\run_project_with_pdf.js firefox
```

After that run, the generated PDF is written to the repository-local folder:

```text
playwright-report-pdfs/
```

The filename is timestamped and browser/project scoped, for example:

```text
toolshop-playwright-qa-firefox-2026-09-11T18-15-36-718Z-playwright-report.pdf
```

---

## 1. What is covered

The test-design pack contains **24 scenarios**:

- **15 automated**
- **8 manual / exploratory**
- **1 not applicable**

Automated coverage is grouped by business area:

| Area | Automated IDs | Purpose |
| --- | --- | --- |
| Catalog | `CAT-001` – `CAT-005` | Product availability, search, reset, category filtering, price sorting |
| Cart | `CART-001` – `CART-003` | Add to cart, quantity/total calculation, remove/empty-cart behavior |
| Authentication | `AUTH-001` – `AUTH-004` | Registration, login/logout, invalid login, required-field validation |
| Checkout | `CHK-001` – `CHK-002` | Guest identity validation and full synthetic signed-in checkout |
| Navigation | `NAV-001` | Return from product details to catalog |

The design, automation decisions, observations, execution notes, and reviewer-oriented Excel pack are in [`docs/`](docs/). The Markdown test design and Excel workbook were reconciled on 11 September 2026 so manual status and the latest CHK-002 evidence agree.

---

## 2. Application under test

**Toolshop:** <https://practicesoftwaretesting.com/>

The application is a shared public practice environment and may change independently of this repository. Product IDs, stock, catalog contents, form behavior, and response timing can vary. Tests therefore avoid hardcoded generated IDs and use stable business assertions wherever practical.

---

## 3. Technology stack

- **Node.js:** 22 or newer
- **npm**
- **TypeScript**
- **Playwright Test:** 1.63.0
- **Browsers:** Chromium, Firefox, WebKit
- **Mobile coverage:** Chromium using Pixel 5 emulation at 390 × 844

The project was locally prepared with Node.js 24.x / npm 11.x, while `package.json` supports Node.js **>= 22**.

---

# 4. Start from zero — install and verify everything

The commands below are written for **Windows PowerShell**, which is the primary development environment for this project.

## Step 1 — Install Node.js

Install a current **Node.js LTS** release from the official Node.js website.

After installation, completely close and reopen VS Code/PowerShell so the updated `PATH` is available.

Verify:

```powershell
node -v
npm -v
npx -v
```

Expected result: all three commands print version numbers.

Example development environment:

```text
node v24.21.0
npm  11.19.0
npx  11.19.0
```

If `node` is not recognized, confirm this path exists and is present in the Windows `PATH`:

```text
C:\Program Files\nodejs\
```

---

## Step 2 — Open the project

If using a cloned repository:

```powershell
git clone <repository-url>
cd "Kupesh QA"
```

If the folder is already on the computer, open it in VS Code and ensure the terminal is inside the project root:

```powershell
pwd
```

You should be in the folder containing:

```text
package.json
playwright.config.ts
tests/
pages/
docs/
```

---

## Step 3 — Install project dependencies

For a clean/reviewer installation, use:

```powershell
npm ci
```

`npm ci` installs the exact dependency versions from `package-lock.json`.

For local development where dependencies are intentionally being changed, use:

```powershell
npm install
```

Do **not** commit `node_modules/`.

---

## Step 4 — Install Playwright browsers

Install the browser engines required by the assessment:

```powershell
npm run browsers:install
```

Equivalent command:

```powershell
npx playwright install chromium firefox webkit
```

This installs:

- Chromium
- Firefox
- WebKit
- supporting Playwright browser/runtime files

Verify Playwright:

```powershell
npx playwright --version
```

Expected for this project:

```text
Version 1.63.0
```

---

## Step 5 — Verify TypeScript before running tests

```powershell
npm run typecheck
```

This executes:

```text
tsc --noEmit
```

A successful run exits without TypeScript errors.

---

## Step 6 — Optional: list tests before execution

```powershell
npx playwright test --list
```

This is useful for verifying that Playwright can discover the specs and configured projects before opening browsers.

---

# 5. Run the tests

## Chromium — headless

```powershell
npm run test:chromium
```

Equivalent:

```powershell
npx playwright test --project=chromium
```

---

## Chromium — headed / visible browser

Use this when you want to watch the tests execute:

```powershell
npx playwright test --project=chromium --headed
```

---

## Run one spec in headed Chromium

Example: Catalog only.

```powershell
npx playwright test tests/catalog.spec.ts --project=chromium --headed
```

Authentication only:

```powershell
npx playwright test tests/auth.spec.ts --project=chromium --headed
```

Cart only:

```powershell
npx playwright test tests/cart.spec.ts --project=chromium --headed
```

Checkout only:

```powershell
npx playwright test tests/checkout.spec.ts --project=chromium --headed
```

Navigation only:

```powershell
npx playwright test tests/navigation.spec.ts --project=chromium --headed
```

---

## Run one test by ID/title

Example:

```powershell
npx playwright test --project=chromium --headed -g "CAT-001"
```

Another example:

```powershell
npx playwright test tests/auth.spec.ts --project=chromium --headed -g "AUTH-001"
```

---

## Firefox

```powershell
npm run test:firefox
```

---

## WebKit

```powershell
npm run test:webkit
```

---

## Mobile Chromium

```powershell
npm run test:mobile
```

The mobile project runs tests tagged `@mobile` using Pixel 5 emulation at **390 × 844**. This is browser viewport/device emulation; it is not a claim of physical-device or iOS Safari testing.

Current `@mobile` critical flows include:

- `AUTH-002`
- `CART-001`
- `CART-002`
- `CHK-001`
- `CHK-002`
- `NAV-001`

---

## Full configured matrix

```powershell
npm test
```

The configured matrix contains:

- 15 tests in Chromium
- 15 tests in Firefox
- 15 tests in WebKit
- 6 tagged critical tests in Mobile Chromium

That is **51 configured executions** when the full matrix is run.

Because this targets a shared public service, configuration uses **1 worker** and **1 retry**. The retry does not add another designed test or change the configured total of 51; Playwright reports a test as flaky when its first attempt fails and its retry passes. A test remains failed when both attempts fail.

---

# 6. Recommended execution order

For development and debugging, do not begin with the entire matrix.

Recommended sequence:

```powershell
npm run typecheck
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:mobile
```

Only after the individual projects are understood/stable, run:

```powershell
npm test
```

For a failing functional area, rerun only the affected spec or test ID before running the complete suite again.

---

# 7. Playwright UI, debug, and headed modes

## Headed mode

```powershell
npm run test:headed
```

## UI mode

```powershell
npm run test:ui
```

UI mode is useful for selecting tests interactively, viewing actions, and rerunning scenarios during development.

## Debug mode

```powershell
npm run test:debug
```

Or debug a single test:

```powershell
npx playwright test tests/auth.spec.ts --project=chromium -g "AUTH-001" --debug
```

---

# 8. Reports and failure evidence

The Playwright configuration generates an **HTML report** and retains debugging evidence for failures.

Open the latest HTML report:

```powershell
npm run report
```

Generate a PDF from the latest JSON execution report:

```powershell
npm run report:pdf
```

To keep a final run isolated, use the same directory for execution and PDF export:

```powershell
$env:PLAYWRIGHT_REPORT_DIR = "playwright-report-final"
npm test
npm run report:pdf
```

Equivalent:

```powershell
npx playwright show-report
```

Generated failure evidence is placed under the operating-system temporary directory configured by `outputDir`, in a folder named:

```text
toolshop-playwright-results/
```

Depending on the failure, evidence may include:

- screenshot (`.png`)
- video (`.webm`)
- `error-context.md`

Trace recording is currently disabled because missing temporary trace-network files caused false execution failures on this Windows environment. Historical retained traces can still be opened with:

```powershell
npx playwright show-trace "test-results\<failed-test-folder>\trace.zip"
```

The trace viewer is especially useful for:

- action timing
- locator resolution
- DOM snapshots
- network requests
- console messages
- before/after screenshots

Generated reports/results are ignored by Git because they can be large and may contain temporary synthetic test values. `playwright test --list` uses only the list reporter, so discovery does not replace the latest HTML/JSON execution report. PDF export runs explicitly after execution and ignores cases with no result attempts.

---

# 9. Project structure

The tree below lists the submission files tracked by Git. Local dependencies, reports, browser tooling, the source assessment PDF, and `.git/` may exist in the working folder but are intentionally excluded from the published source tree.

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

- **`tests/`** — business-facing automated scenarios; test titles retain their design IDs.
- **`pages/`** — meaningful page objects and reusable UI interactions/locators.
- **`fixtures/`** — repeated isolated setup, including creating a fresh cart through the UI.
- **`test-data/`** — fictional external data and runtime synthetic-user generation.
- **`scripts/`** — explicit project execution and PDF report generation helpers.
- **`utils/`** — focused shared helpers such as USD-to-integer-cent parsing.
- **`docs/`** — test design, automation rationale, observations, execution review, and Excel QA pack.
- **`.agents/skills/`** — optional Codex workflow instructions used during development; not required to execute Playwright tests.

---

# 10. Framework design

## Page Object Model

Page Objects own reusable selectors and interactions so spec files can focus on business intent.

Implemented boundaries include:

- `HomePage`
- `ProductPage`
- `CartPage`
- `AuthPage`
- `CheckoutPage`
- `Navigation`

The project intentionally avoids creating artificial Page Objects only to increase class count.

---

## Locator strategy

Preferred locator order is semantic and user-facing:

1. `getByRole()`
2. `getByLabel()`
3. `getByTestId()`
4. `getByPlaceholder()`
5. scoped text locators
6. robust CSS only when the UI exposes no useful semantic hook

The configured Playwright test-id attribute is:

```text
data-test
```

One documented exception exists in cart removal because the live application exposes an unnamed non-semantic anchor. See `OBS-001` in [`docs/observations.md`](docs/observations.md).

---

## Waiting and synchronization

The suite relies on Playwright auto-waiting and web-first assertions rather than fixed sleeps.

For example, authentication navigation waits for `domcontentloaded` and then verifies that the login fields are actually editable. This avoids waiting unnecessarily for slow third-party resources after the useful form is already available.

Arbitrary `waitForTimeout(...)` calls are intentionally avoided.

---

# 11. Test isolation and synthetic data

Each Playwright test receives an independent browser context.

The suite does not depend on one test creating state for another test.

### Users

`test-data/users.ts` creates unique disposable identities at runtime:

```text
qa.<timestamp>.<uuid>@example.com
```

Passwords are generated in memory and are **not stored in committed JSON**.

### Checkout

Checkout data is fictional and uses the practice site's **Cash on Delivery** option. No real payment card or personally sensitive information is used.

### Product data

The configured primary product is currently:

```text
Combination Pliers
```

Prices are read from the current live UI and compared using integer cents; tests do not hardcode a historical product price.

### Public-service cleanup

The practice site does not currently provide a confirmed safe cleanup mechanism for disposable accounts/orders created by these tests. That limitation is documented rather than hidden.

---

# 12. Environment variables and secrets

No secret environment variable is currently required for the normal suite.

`.env.example` documents optional Playwright process variables:

```text
PLAYWRIGHT_BROWSERS_PATH=
PLAYWRIGHT_REPORT_DIR=
```

Important:

- The suite does **not** automatically load `.env`.
- Do not commit `.env`.
- Do not commit passwords, access tokens, API keys, or real customer/payment data.

If you intentionally use a custom browser location in PowerShell, set it only for the local shell, for example:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "C:\path\to\playwright-browsers"
```

For a normal installation, simply use:

```powershell
npm run browsers:install
```

---

# 13. Playwright configuration

Important configuration in `playwright.config.ts`:

| Setting | Value |
| --- | --- |
| Base URL | `https://practicesoftwaretesting.com` |
| Default test timeout | 30 seconds |
| Default assertion timeout | 5 seconds |
| Workers | 1 |
| Retries | 1 |
| Default mode | Headless |
| Trace | Off (temporary trace-file instability documented in OBS-007) |
| Screenshot | Only on failure |
| Video | Retain on failure |
| Desktop viewport | 1440 × 1000 |
| Mobile viewport | 390 × 844 |
| Test ID attribute | `data-test` |

`CHK-002` currently uses a local 100-second test timeout because it independently performs synthetic registration/login and a complete order flow. The global timeout remains 30 seconds.

---

# 14. Test-design and traceability documents

## Markdown test design

[`docs/test-cases.md`](docs/test-cases.md) is the detailed human-readable design source.

It contains:

- IDs and business-focused titles
- module and priority
- preconditions
- external test-data references
- reproducible steps
- expected results
- test type
- automation decision
- implementation traceability

## Automation strategy

[`docs/automation-strategy.md`](docs/automation-strategy.md) records why each selected scenario is:

- automated
- manual/exploratory
- not applicable

It also connects automated IDs to exact spec files and test titles.

## Excel QA pack

[`docs/test-cases.xlsx`](docs/test-cases.xlsx) is a reviewer-friendly workbook containing:

1. Test Cases
2. Automation Strategy
3. Coverage Summary
4. Execution Results
5. Locator Register
6. Defects & Observations

The Excel workbook supplements the Markdown documents; it does not replace the required strategy/observation files.

The workbook was last reconciled on **11 September 2026** and currently records:

- all 24 designed scenarios and their automation decisions;
- five unexecuted and three partially explored manual charters, with no manual case promoted to a pass;
- the targeted CHK-002 pass plus the three-run result where billing reached payment 3/3 times and complete order confirmation finished 2/3 times;
- OBS-004 as resolved for billing while retaining the later final-confirmation instability;
- the real local repository evidence and the absence of an authenticated public URL.

Use `Status` and `Notes` on **Test Cases**, and the dated rows on **Execution Results**, as the source for result interpretation. `PARTIAL`, `NOT RUN`, and `FLAKY` are intentionally distinct from `PASS`.

---

# 15. Known observations and limitations

Full details and reproduction information are in [`docs/observations.md`](docs/observations.md).

Notable findings include:

### OBS-001 — Cart removal accessibility

The current cart removal control is an unnamed anchor without a useful accessible name/native keyboard behavior. The automation uses a scoped CSS fallback only because the application currently exposes no stable semantic hook.

### OBS-002 — Password guidance inconsistency

Registration guidance states an eight-character minimum while another validation message refers to six characters. The automated positive path deliberately uses a stronger generated password rather than depending on the disputed boundary.

### OBS-003 — Checkout console initialization errors

Transient cart initialization exceptions have been observed while the UI later recovers. Functional scenarios do not automatically fail on unrelated console noise.

### OBS-004 — Mobile checkout billing-state issue

A historical `CHK-002` run failed after the billing house-number field reset during a live-form re-render. Billing entry now uses a bounded assertion retry and completes only after the payment step is visible. Fresh verification reached payment in 3/3 repetitions; two orders completed and one failed later at final invoice confirmation. Billing is resolved, while full CHK-002 stability is not claimed.

### Public-site instability

Because this is a public practice system, occasional navigation/API delays and mutable shared data are possible. A historical `AUTH-001` run also exposed slow login-page navigation. The current `AuthPage` waits for `domcontentloaded` and then asserts the actual login form is usable rather than waiting for every external resource.

Do not hide public-site failures with arbitrary sleeps or broad retries. Reproduce, inspect trace/evidence, classify the failure, and document genuine environment limitations.

### OBS-006 and OBS-007 — Full-matrix reviews

The latest isolated complete matrix finished **47 passed / 3 flaky / 1 failed** across 51 configured executions. The flaky cases were WebKit AUTH-002, WebKit CART-002, and Mobile Chromium CHK-002; each passed its retry. WebKit CHK-001 remained failed after retry: the first attempt timed out and retry artifact creation hit an `ENOENT` in Playwright's temporary trace directory. See `docs/observations.md` for exact classification.

---

# 16. Current evidence and how to interpret it

This repository contains time-stamped execution notes and retained artifacts. These are useful debugging evidence, but **they are not a substitute for a fresh pre-submission run**.

See:

- [`docs/session-report.md`](docs/session-report.md)
- [`docs/submission-review.md`](docs/submission-review.md)
- `playwright-report/`
- `test-results/`

Latest evidence on 11 September 2026:

- TypeScript validation passed.
- A direct Mobile Chromium run completed **6 passed / 0 failed**.
- The isolated full matrix completed **47 passed / 3 flaky / 1 failed** across 51 configured executions. Retry attempts do not increase the configured count.
- WebKit CHK-001 was the final failure. Its first attempt timed out; its retry encountered an `ENOENT` while Playwright copied a temporary trace network file.
- `playwright test --list` was verified not to overwrite the execution JSON report. The generated PDF contains the same executed tests and 47/3/1 totals.

Recommended pre-submission verification:

```powershell
npm ci
npm run browsers:install
npm run typecheck
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:mobile
```

Then inspect:

```powershell
npm run report
```

Any remaining failure should be explained with evidence and a clear classification/root cause or documented limitation.

---

# 17. Manual / exploratory coverage

Eight scenarios are intentionally retained as manual/exploratory coverage rather than automating everything.

Examples include:

- combined filtering/pagination exploration
- quantity boundaries/out-of-stock behavior
- registration boundaries/duplicate identity behavior
- checkout validation/back-navigation behavior
- compatibility/accessibility/exploratory charters

The complete manual definitions are in [`docs/test-cases.md`](docs/test-cases.md).

Observations already recorded during automation exploration must **not** be presented as if all manual charters were fully executed.

Current manual status is explicit in each case: five charters are unexecuted and three are partially explored. None has a complete manual-pass result.

---

# 18. Optional Codex + Playwright MCP development setup

This section is **not required for a reviewer to run the tests**. It documents the AI-assisted development workflow used to inspect the current live UI and verify locator choices.

## Verify Codex CLI

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

The repository also contains optional Codex skills under `.agents/skills/`:

- `playwright-qa`
- `bug-investigation`
- `test-data-fixtures`
- `assignment-review`

These assist development/review only. They are not runtime dependencies of the Playwright suite.

---

# 19. Useful troubleshooting

## `node` is not recognized

Close/reopen VS Code after installing Node.js.

Then verify:

```powershell
where.exe node
node -v
```

A standard installation is usually located at:

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

## One public-site test times out

Do not immediately add a large timeout or `waitForTimeout`.

First:

1. rerun only the failed test;
2. inspect the trace/screenshot;
3. determine whether navigation, test data, locator, synchronization, or the public application is responsible;
4. make the smallest justified change.

Example:

```powershell
npx playwright test tests/auth.spec.ts --project=chromium --headed -g "AUTH-001"
```

Then inspect the trace if it fails again.

---

## Open the last report

```powershell
npx playwright show-report
```

---

# 20. Git and submission notes

## Repository evidence

- Local Git history: initialized on 11 September 2026 from the completed workspace. Initial commit `8fe305f` (`chore: establish QA assessment repository`) is real and locally verifiable with `git log --oneline`; no design-first history is claimed.
- Current documented commit before the workbook reconciliation: `1bd2f1d` (`docs: record repository publication status`). Later documentation/workbook commits appear above it in `git log`.
- Public repository URL: **not yet available**. GitHub redirected the publication attempt to its sign-in page on 11 September 2026, and no GitHub credential or authenticated browser session was available. No placeholder or invented public link is provided.
- Verification after publication: open the public URL in a signed-out browser and confirm that `README.md`, `docs/`, `tests/`, `pages/`, `fixtures/`, and `test-data/` are visible while generated reports, `.env`, browser binaries, and local tooling are absent.

`.gitignore` excludes:

- `node_modules/`
- Playwright reports/results
- `.env` files
- local Playwright/Codex generated folders
- logs and TypeScript build metadata

Do not commit:

- real secrets
- real personal data
- generated browser binaries
- huge report folders
- unnecessary temporary artifacts

The take-home requires an honest, logical Git history. If the workspace did not have the required design-first history from the beginning, do **not fabricate or rewrite history** to imply otherwise. Document the limitation honestly and create sensible incremental commits from the point Git is initialized.

A publication sequence after authenticating the intended GitHub account is:

```powershell
git status
git add .
git commit -m "docs: finalize QA assessment documentation"
```

Push/publish only to the intended repository after reviewing the staged files for secrets and unnecessary artifacts, then replace the status above with the real public URL and verify it while signed out.

---

# 21. Future improvements

Meaningful next improvements include:

1. investigate the separate `CHK-002` final invoice-confirmation timeout and rerun the affected suite;
2. execute the remaining steps in the eight explicitly labeled manual/exploratory charters if complete manual-pass evidence is required;
3. establish a supported cleanup approach for disposable public-service accounts/orders if the application provides one;
4. add CI after the complete cross-browser suite is stable;
5. continue tracking public-site accessibility/validation issues without weakening business assertions.

---

# 22. Quick-start command block

For a reviewer who already has Node.js installed:

```powershell
# 1. Install exact dependencies
npm ci

# 2. Install browser engines
npm run browsers:install

# 3. Verify TypeScript
npm run typecheck

# 4. Run visible Chromium tests
npx playwright test --project=chromium --headed

# 5. Run remaining projects
npm run test:firefox
npm run test:webkit
npm run test:mobile

# 6. Open the latest report
npm run report
```

For the complete configured matrix in one command:

```powershell
npm test
```

---

## Assessment documentation index

- [Test cases](docs/test-cases.md)
- [Excel test pack](docs/test-cases.xlsx)
- [Automation strategy](docs/automation-strategy.md)
- [Live observations / defects / limitations](docs/observations.md)
- [Assessment session report](docs/session-report.md)
- [Submission review](docs/submission-review.md)
