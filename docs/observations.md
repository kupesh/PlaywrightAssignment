# Live observations — 11 September 2026

## Catalog

- MCP inspection confirmed Search textbox/button, reset button named `X`, checkbox `Pliers`, combobox `sort`, options `Price (Low - High)` / `Price (High - Low)`, product links scoped by exact heading, `data-test` hooks `product-name`, `product-price`, `unit-price`, `search-term`, `no-results`, and category badge labeled `category`.
- CAT-002: submitting search clears the textbox but keeps the query visible in `Searched for: pliers`. The approved requirement that the query remains visible is asserted against `search-term`; requiring the textbox to retain it was a test defect. MCP reproduced this with four matching product names.
- CAT-004: `Pliers` also names a related-product heading. The category badge's accessible label disambiguates it. Bolt Cutters belongs to Pliers, so a name-substring assertion would incorrectly reject a valid category member.
- Catalog requests currently use HTTP `QUERY` with JSON bodies. Tests await the response and its rendered product names, then independently assert business behavior.
- During exploration around 10:00 UTC, product/category IDs changed across page loads. A category selection from the earlier page returned an empty list; a fresh page returned five Pliers products. Suspected public data reset, not a confirmed application defect. Tests do not freeze IDs or silently retry unavailable data.
- Title reports Toolshop v5.0; footer reports v2.5, built 2026-09-09. The original design mentioned only the title version.

## Initial repository and environment

- No AGENTS.md, observations file, fixtures or utils existed. Only CAT-001–003 had preliminary implementation; CAT-004–005 and the other ten cases were absent.
- TypeScript 7 rejected removed `moduleResolution: node`; use paired Node16 module settings. Existing `Locator.wait()` was invalid and replaced with a web-first assertion.
- Sandbox test execution failed before starting tests with worker spawn EPERM. Authorized execution outside the sandbox uses the existing `.tools/browsers` binaries.
- First catalog run: CAT-001/003/005 passed; CAT-002 failed due to the textbox assumption and CAT-004 due to an ambiguous text locator. Both were reproduced and corrected as test defects.

## Checkout design revision (MCP verified)

- CHK-001's original mandatory-sign-in assumption is invalid: the current application explicitly offers a Continue as Guest tab, captioned 'Checkout without creating an account'. Blank guest submission produces Email/First name/Last name required errors and does not advance. Preserve CHK-001 and revise its title to 'guest checkout requires customer identity'; cover the sign-in/registration choices, guest identity validation, blocked payment and retained cart. This is supported functionality, not an authentication-bypass defect.
- CHK-002: signed-in checkout requires cart confirmation, a signed-in confirmation step, billing (including manually supplied house number), and payment. Cash on Delivery needs no financial credentials. First Confirm produces 'Payment was successful'; second Confirm produces 'Thanks for your order! Your invoice number is INV-…'. MCP completed an actual synthetic order, INV-2026000004. Tests derive their own reference and never hardcode it.
- Registration fixture setup uses the same reusable UI page object in a fresh browser context per test. Synthetic passwords are generated in memory; JSON contains only fictional profile/address data. Disposable accounts/orders remain on the public practice service; no supported cleanup flow was established.

## Cart and authentication observations

- Cart MCP locators: role link `cart`, navigation toggle `Toggle navigation`, `cart-quantity`, product-scoped table row, spinbutton `Quantity for Combination Pliers`, `product-price`, `line-price`, `cart-total`, and `Proceed to checkout`. Quantity edits commit on blur/Tab; totals settle asynchronously. All CART-001–003 passed in targeted Chromium, including reload persistence.
- Authentication MCP locators: associated labels for all registration/login inputs, Register/Login buttons, Register your account link, My account heading, customer-name button, Sign out text, login-error and required validation messages. All AUTH-001–004 passed in targeted Chromium.
- Navigation MCP verified opening a product and returning via the Home link in the expanded menu. NAV-001 passed in targeted Chromium.
- Checkout and navigation tags match the six-case mobile scope. One worker protects the shared service; one configured retry distinguishes transient first-attempt failures from repeatable failures without changing the 51-test discovery count. No fixed sleeps were introduced. CHK-002 currently has a test-local 100-second budget for independent UI registration plus the complete order flow; other cases retain the 30-second default.

## Application defects and evidence

### OBS-001 — Cart removal lacks an accessible interactive control

- Severity: medium (keyboard/accessibility).
- Steps: add Combination Pliers, open cart, inspect the removal icon in its row; navigate interactive elements by keyboard.
- Expected: a named, keyboard-operable Remove button or link.
- Actual: `<a class="btn btn-danger">` has no href, accessible name, tabindex or test ID; its SVG is aria-hidden. The accessibility snapshot exposes only an unnamed generic. It is not a native keyboard-focusable control.
- Evidence: MCP row snapshot and DOM inspection on 11 September 2026; tests use `row.locator('a.btn-danger')` solely for this missing semantic hook. Mouse removal and persisted empty state passed. Full screen-reader conformance was not assessed.

### OBS-002 — Registration password guidance contradicts its validation text

- Severity: low (validation copy).
- Steps: open registration and submit the blank form.
- Expected: password validation guidance states a consistent minimum length.
- Actual: checklist says 'Be at least 8 characters long'; password-error includes 'Password must be minimal 6 characters long.' This report concerns inconsistent text, not a proven accepted-password boundary.
- Evidence: MCP registration form and password-error DOM inspection, 11 September 2026. AUTH-004 confirms required-field rejection; positive registration uses a strong runtime password.

### OBS-003 — Checkout logs transient cart initialization exceptions

- Severity: low in observed flows (console noise; UI recovered).
- Steps: add a product, follow cart navigation, or load /checkout with the owned cart.
- Expected: pending cart data is handled without JavaScript errors.
- Actual: repeated `TypeError: Cannot read properties of undefined (reading 'cart_items')` from the checkout template before the cart renders. Reproduced on multiple MCP checkout navigations; cart and order scenarios still completed.
- Evidence: ignored local MCP console log `console-2026-09-11T10-00-58-035Z.log`, including lines 20–411 and later checkout navigations. Anonymous `/users/me` 401 responses were also seen; these alone are not classified as defects. Console errors were not suppressed or turned into unrelated functional test failures.
- Mobile MCP inspection at 390 × 844 confirms the search/filter panel is collapsed while product cards and the navigation toggle remain visible. NAV-001 asserts the catalog route and configured product, as designed; it does not require the optional filter panel to be expanded.

## OBS-004 - Mobile checkout billing field reset

- Related test: CHK-002. Classification: test synchronization defect triggered by a live-form re-render; not a confirmed product defect.
- Environment: Chromium mobile project in the current workspace; repeated fresh verification command `npx playwright test tests/checkout.spec.ts --project=chromium -g "CHK-002" --repeat-each=3` was executed on 2026-09-11.
- Steps: independent cart, synthetic registration/login, cart review, signed-in checkout, fill/verify billing fields, attempt Proceed to checkout.
- Expected: valid synthetic billing allows progression to payment.
- Historical failure: three earlier repetitions failed in billing when `getByTestId('house_number')` expected `42` and received `""`. Failure artifacts captured that result. They describe the earlier source revision and are not current pass evidence.
- Supported cause: the live Angular billing form was observed re-rendering after it became interactive and clearing an earlier value. The former one-time fill/check sequence raced that update. Evidence supports correcting test synchronization; it does not prove that an end user can reproduce a lasting product failure.
- Resolution: billing entry now retries the complete semantic fill/verification action within a bounded Playwright assertion and succeeds only after clicking Proceed and observing the payment form. Country selection is included in every attempt. This adds no fixed sleep or global timeout increase.
- Verification on 11 September 2026: one targeted Chromium run passed. A subsequent `--repeat-each=3` run reached payment in all three attempts; two completed and one timed out later while waiting for the final invoice confirmation after the payment-success message.
- Status: the billing-specific failure is resolved in the test. CHK-002 is not claimed as fully stable because the latest three-run command finished 2 passed / 1 failed at a later checkout stage.

## Pre-final targeted scope and execution

Typecheck passes. Fresh Catalog Chromium evidence is 5 passed with zero retries. Earlier full desktop runs each passed 15, but they predate the latest checkout synchronization change. The latest CHK-002 evidence is recorded in OBS-004 and must be read as 2/3 complete-order passes, with billing reached in 3/3. No fresh full-matrix pass is claimed.

## OBS-005 - AUTH-001 waits for analytics after login is usable

- Classification: inappropriate test navigation synchronization exposed by public-site/third-party network instability. No registration or locator defect was found; no application defect is established.
- Failure: the user's headed Chromium run passed 14/15 tests. AUTH-001 exhausted its 30-second budget in openLogin(), before registration, while page.goto waited for the default load event.
- Evidence inspected: original screenshot, error-context.md and trace.zip under test-results/auth-AUTH-001-register-a-disposable-synthetic-customer-chromium/. The screenshot shows the login form and registration link rendered. Trace network entries show the document returned HTTP 200 (~1.87 seconds), while static.cloudflareinsights.com/beacon.min.js had no completed response (status/time -1). This supports an unfinished third-party resource delaying load; the precise external network cause is unknown.
- MCP confirmed the live login URL is accessible with domcontentloaded and its exact Login heading and Register your account link are present. A controlled diagnostic held only the analytics request pending: navigation waiting for load timed out after eight seconds while the Login heading was visible and the email field editable. The diagnostic interception was removed afterward; the test suite does not mock or block analytics.
- Minimum fix: AuthPage.openLogin() uses page.goto('/auth/login', { waitUntil: 'domcontentloaded' }), followed by the existing web-first Login heading assertion. No arbitrary sleeps, global timeout increases, unrelated test edits or application changes.
- Targeted validation: typecheck passed; AUTH-001 alone passed in headed Chromium (10.3 seconds). Separate output/report folders preserve the original failure evidence. An initial anchored grep selected no tests; it was corrected to --grep AUTH-001 and is not counted as a test failure.
- Follow-up validation: complete auth.spec.ts passed 4/4 in headed Chromium (37.6 seconds), zero retries. AUTH-001 passed again in that suite (11.2 seconds). Reports: playwright-report/auth-001-fix/ and playwright-report/auth-suite-fix/.

## OBS-006 - Fresh full-matrix review

- Command and date: `npm test`, 11 September 2026, before the configuration changed from zero retries to one.
- Result: 45 passed / 6 failed across the configured 51 executions. CHK-002 passed in Chromium, Firefox, WebKit, and Mobile Chromium.
- Four failures included missing trace/network files beneath transient `.playwright-artifacts-*` folders in the OneDrive-hosted `test-results` directory. Those failures occurred during setup or context cleanup rather than at a failed business assertion.
- Two failures reached business assertions: Chromium CART-002 temporarily retained the quantity-one cart total after quantity changed to two; WebKit AUTH-001 had live address lookup overwrite the synthetic city. The WebKit address overwrite reproduced once more on a targeted run, this time for Street.
- Targeted reruns: Chromium CART-001/002 passed 2/2; Firefox AUTH-004/CAT-001 passed 2/2; Mobile Chromium CHK-001 passed; WebKit AUTH-001 first failed again, then passed on the later retry-configuration verification run.
- Classification: mixed public-site/test synchronization instability plus artifact-path instability associated with the local OneDrive results location. This evidence does not support a clean full-matrix claim.
- Configuration follow-up: one retry is enabled. Test discovery remains 51, and retry attempts do not increase the designed-test count.

## OBS-007 - Final isolated matrix and report verification

- Date and command: 11 September 2026; TypeScript validation followed by the complete configured matrix with one retry and `PLAYWRIGHT_REPORT_DIR=playwright-report-final`. Playwright artifacts used the operating-system temporary directory rather than the OneDrive workspace.
- Result: **47 passed / 3 flaky / 1 failed** across 51 configured executions. Chromium and Firefox passed all 15 first attempts.
- Flaky: WebKit AUTH-002, WebKit CART-002, and Mobile Chromium CHK-002 failed their first attempts and passed retry. These remain flaky in Playwright reporting and are not counted as extra tests.
- Failed: WebKit CHK-001. The first attempt reached the 30-second timeout. The retry then failed while Playwright copied a retry trace network file, with an `ENOENT` beneath the temporary `.playwright-artifacts-5/traces` directory. This provides evidence of remaining public-site/timing instability plus Playwright artifact instability; it does not establish a reproducible Toolshop product defect.
- Separate mobile evidence: the latest direct Mobile Chromium suite completed **6 passed / 0 failed**. That result and the later matrix flaky result are both retained because they show the intermittent nature honestly.
- Reporting verification: the isolated JSON report contains 51 tests and reports 47 expected, three flaky, one unexpected. PDF generation produced the same 47/3/1 counts and excluded cases without execution attempts. Running `playwright test --list` did not change the execution-report hash.
