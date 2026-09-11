---
name: bug-investigation
description: Use when a Playwright test fails, an application behaves unexpectedly, or a defect needs root-cause analysis.
---

# Bug Investigation

When something fails:

1. Reproduce the failure.
2. Determine whether it is:
   - test defect
   - selector defect
   - test-data defect
   - timing/flakiness issue
   - environment issue
   - genuine application defect

3. Inspect:
   - error output
   - screenshot
   - trace
   - browser console when relevant
   - network behavior when relevant

4. Do not modify application behavior merely to make a test pass.

5. Fix test code only when the test is incorrect.

6. For real application defects document:
   - steps
   - expected result
   - actual result
   - severity
   - evidence