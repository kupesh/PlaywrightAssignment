---
name: playwright-qa
description: Use for Playwright E2E testing, browser exploration, test generation, selector selection, debugging flaky tests, and QA validation for this project.
---

# Playwright QA Workflow

Before writing tests:

1. Read docs/test-cases.md.
2. Read docs/automation-strategy.md.
3. Inspect existing Page Objects and tests.
4. Do not redesign approved test scope unless the live application differs.

When browser exploration is required:

1. Use Playwright MCP.
2. Prefer accessible semantic locators.
3. Prefer:
   - getByRole()
   - getByLabel()
   - getByPlaceholder()
   - getByTestId()

Avoid:
- arbitrary timeouts
- fragile nth-child selectors
- unnecessary CSS/XPath selectors

When implementing tests:

1. Keep tests independent.
2. Reuse Page Objects.
3. Keep test data outside spec files where practical.
4. Run Chromium first.
5. Fix test-code issues.
6. Re-run until stable.
7. Only then test Firefox, WebKit, and mobile.

At completion report:
- tests added
- tests passing
- tests failing
- application defects
- files modified
- assumptions