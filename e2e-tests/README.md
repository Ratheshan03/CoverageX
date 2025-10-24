# E2E Tests - CoverageX

End-to-end tests for the CoverageX To-Do application using Playwright.

## Setup

### Install dependencies:
```bash
cd e2e-tests
npm install
```

### Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Prerequisites
Make sure the application is running before executing tests:
```bash
# In project root
docker-compose up
```

Or the E2E tests can start the application automatically (configured in playwright.config.ts).

### Run all tests:
```bash
npm test
```

### Run tests in headed mode (see browser):
```bash
npm run test:headed
```

### Run tests in UI mode (interactive):
```bash
npm run test:ui
```

### Run tests in debug mode:
```bash
npm run test:debug
```

### View test report:
```bash
npm run test:report
```

### Generate test code (record interactions):
```bash
npm run test:codegen
```

## Test Structure

```
e2e-tests/
├── tests/
│   ├── 01-user-flow.spec.ts       # Complete user flow scenarios
│   ├── 02-validation.spec.ts      # Form validation tests
│   ├── 03-task-limit.spec.ts      # Task limit (5 max) tests
│   └── 04-ui-responsive.spec.ts   # UI and responsive design tests
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## Test Scenarios

### 1. User Flow Tests (`01-user-flow.spec.ts`)
- Complete user journey (create → view → complete tasks)
- Task ordering (newest first)
- Data persistence after page refresh

### 2. Validation Tests (`02-validation.spec.ts`)
- Empty form submission
- Missing required fields
- Whitespace-only input
- Maximum length constraints
- Loading states

### 3. Task Limit Tests (`03-task-limit.spec.ts`)
- Maximum 5 tasks displayed
- Newest tasks shown first
- List updates when tasks completed
- Empty state handling
- Rapid task creation

### 4. UI/Responsive Tests (`04-ui-responsive.spec.ts`)
- Main UI elements visibility
- Desktop layout
- Mobile responsiveness
- Tablet responsiveness
- Interactive elements
- Long text handling
- Window resize behavior

## Browser Coverage

Tests run on:
- Chromium (Desktop Chrome)
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Configuration

Key settings in `playwright.config.ts`:
- **Base URL**: http://localhost:3000
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Reporters**: HTML, List, JSON
- **Web Server**: Automatically starts docker-compose

## Troubleshooting

### Tests fail with "Target closed"
- Increase timeout in playwright.config.ts
- Check if application is running

### Application not starting
- Verify docker-compose is configured correctly
- Check ports 3000, 5000, 3306 are available

### Browser not found
- Run: `npx playwright install`

### Slow test execution
- Run specific test file: `npx playwright test tests/01-user-flow.spec.ts`
- Run on specific browser: `npx playwright test --project=chromium`

## CI/CD Integration

Example GitHub Actions workflow:
```yaml
- name: Install dependencies
  run: cd e2e-tests && npm install

- name: Install Playwright browsers
  run: cd e2e-tests && npx playwright install --with-deps

- name: Run E2E tests
  run: cd e2e-tests && npm test
```

## Best Practices

1. **Selectors**: Use data-testid attributes for reliable element selection
2. **Waits**: Use Playwright's auto-waiting, add explicit waits only when needed
3. **Isolation**: Each test should be independent
4. **Cleanup**: Tests clean up their own data
5. **Assertions**: Use Playwright's expect for automatic retries

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
