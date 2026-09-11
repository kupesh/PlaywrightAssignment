# Submission review against assignment PDF - 11 September 2026

Reviewed the six-page assignment PDF against the current tracked repository, implementation, documentation, Excel pack, Git state, and fresh browser evidence.

## Complete

- Required stack: Playwright Test 1.63.0 and strict TypeScript; typecheck passes.
- Required folders exist: `tests/`, `pages/`, `fixtures/`, `test-data/`, `utils/`, and `docs/`.
- Test design defines 24 traceable scenarios with IDs, priorities, data/preconditions, steps, expected results, types, decisions, reasons, and strategy links.
- Automation strategy covers all 24 scenarios: 15 automated, eight manual/exploratory, and one not applicable.
- Five spec files implement all 15 automated IDs with business assertions, page objects, isolated contexts, a cart fixture, and fictional external data. No real password is committed.
- Browser configuration includes Chromium, Firefox, WebKit, and a Pixel 5 Mobile Chromium project. Discovery reports 51 executions.
- HTML reporting plus failure screenshot/video retention are configured. Historical traces exist, but current trace capture is disabled because trace-network file handling caused the OBS-007 false infrastructure failure.
- README covers prerequisites, installation, execution modes, reports, structure, coverage, issues, assumptions, and five future improvements.
- `.gitignore` excludes dependencies, reports, browser/auth state, `.env`, local tools, and the source assignment PDF. `.env.example` contains variable names only.
- The six-sheet Excel pack is reconciled with Markdown manual status and current checkout evidence.

## Missing or noncompliant

- **Submission blocker:** no public GitHub repository URL or remote exists. The PDF requires an accessible public repository link.
- **History requirement not met:** the first real commit (`8fe305f`) contains design, strategy, and implementation together. It cannot demonstrate that test design was committed before automation began. Earlier history must not be fabricated.
- No manual charter has a complete pass: five are unexecuted and three are partial. The PDF permits manual selection, but the current evidence must retain these labels.
- No supported cleanup mechanism is established for disposable accounts/orders created on the public service.

## Broken or unresolved

- Final isolated matrix: **47 passed / 3 flaky / 1 failed** across 51 configured executions. This is improved evidence, but it is not a clean matrix.
- WebKit AUTH-002, WebKit CART-002, and Mobile Chromium CHK-002 passed on retry and are honestly classified as flaky.
- WebKit CHK-001 remained failed. The first attempt timed out and its retry failed during temporary trace-network artifact copying with `ENOENT`.
- A separate latest Mobile Chromium run passed **6/6 with zero failures**.
- HTML/JSON report preservation and PDF filtering were verified: `--list` did not replace execution evidence, and the PDF contained the same real executed tests.
- The public URL and design-first-history gaps cannot be fixed by test retries or documentation wording.

## Recommended before submission

1. Investigate WebKit CHK-001 and the remaining Playwright temporary trace-file `ENOENT`; retain the current failed result until a complete matrix proves otherwise.
2. Execute remaining manual-charter steps only if complete manual evidence is expected; otherwise keep the explicit `PARTIAL`/`NOT RUN` labels.
3. Authenticate the intended GitHub account, create/push the public repository, add the real URL to README, and verify access while signed out.
4. Explain honestly that the available history starts from a completed workspace; do not claim or manufacture a design-first commit.
