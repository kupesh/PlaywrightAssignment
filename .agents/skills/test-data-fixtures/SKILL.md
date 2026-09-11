---
name: test-data-fixtures
description: Use when creating Playwright fixtures, synthetic users, reusable test data, environment variables, or isolated test setup.
---

# Test Data Rules

Keep tests independent.

Prefer reusable fixtures and factories.

Generate unique values when needed:

- email
- usernames
- order data

Never commit:
- passwords
- API keys
- access tokens
- production credentials

Use .env for secrets.

Use .env.example only for variable names.

Avoid one test depending on data created by another test.