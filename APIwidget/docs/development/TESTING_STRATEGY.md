# APIwidget Testing Strategy

## Overview

This document outlines the testing strategy for the APIwidget Electron application, with a focus on ensuring the quality and reliability of the floating widget feature. It covers all levels of testing from unit tests to end-to-end tests, as well as manual testing procedures.

## Testing Levels

### Unit Testing

Unit tests verify that individual components and functions work as expected in isolation.

#### What to Test

- **React Components**
  - Rendering
  - Props handling
  - State management
  - Event handling
  - Conditional rendering

- **Utility Functions**
  - Data transformations
  - Calculations
  - Validation logic

- **Hooks**
  - State updates
  - Side effects
  - Custom hook logic

- **Services**
  - API interactions
  - Data processing
  - Error handling

#### Tools

- Jest
- React Testing Library
- Mock Service Worker (for API mocking)

#### Example

```javascript
// src/__tests__/components/FloatingWidget.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingWidget from '../../src/FloatingWidget';

describe('FloatingWidget', () => {
  test('renders cost value correctly', () => {
    render(<FloatingWidget />);
    const costElement = screen.getByText(/\$\d+\.\d{2}/);
    expect(costElement).toBeInTheDocument();
  });

  test('handles drag events', () => {
    render(<FloatingWidget />);
    const widget = screen.getByTestId('floating-widget');

    // Initial position
    expect(widget).toHaveStyle('left: 20px');
    expect(widget).toHaveStyle('top: 20px');

    // Simulate drag
    fireEvent.mouseDown(widget, { clientX: 20, clientY: 20 });
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(document);

    // New position
    expect(widget).toHaveStyle('left: 100px');
    expect(widget).toHaveStyle('top: 100px');
  });
});
```

### Integration Testing

Integration tests verify that different parts of the application work together correctly.

#### What to Test

- **Component Interactions**
  - Parent-child communication
  - Context providers with consumers
  - Form submissions
  - Widget manager with individual widgets

- **Service Integrations**
  - API service with components
  - Storage service with state management
  - Authentication flows
  - API provider integrations (OpenAI, Claude, Gemini)

- **Electron IPC**
  - Main to renderer communication
  - Renderer to main communication
  - Preload script functionality
  - Widget window management

#### Tools

- Jest
- Spectron (for Electron testing)
- Electron Test Utils

#### Example

```javascript
// src/__tests__/integration/WidgetIntegration.test.js
const { Application } = require('spectron');
const path = require('path');

describe('Widget Integration', () => {
  let app;

  beforeEach(async () => {
    app = new Application({
      path: electron,
      args: [path.join(__dirname, '../../')],
      env: { NODE_ENV: 'test' }
    });
    await app.start();
  });

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  test('widget communicates with main process', async () => {
    // Get widget window
    const windows = await app.client.getWindowHandles();
    expect(windows.length).toBe(2); // Main window and widget window

    await app.client.switchToWindow(windows[1]); // Switch to widget window

    // Trigger IPC call from widget
    await app.client.execute(() => {
      window.electronAPI.updateWidgetPosition(100, 100);
    });

    // Verify position was saved in main process
    const position = await app.client.execute(() => {
      return window.electronAPI.getWidgetPosition();
    });

    expect(position).toEqual([100, 100]);
  });
});
```

### End-to-End Testing

End-to-end tests verify that the entire application works correctly from a user's perspective.

#### What to Test

- **User Flows**
  - Onboarding
  - API key management for all providers
  - Dashboard navigation
  - Widget interaction
  - Multiple widget management
  - Widget configuration presets

- **System Integration**
  - Installation process
  - Auto-updates
  - System tray integration
  - Notifications
  - Multiple monitor support

- **Cross-Platform Behavior**
  - Windows-specific features
  - macOS-specific features
  - Linux-specific features
  - High-DPI display support

#### Tools

- Playwright
- Cypress
- Spectron

#### Example

```javascript
// e2e/widget.spec.js
const { test, expect } = require('@playwright/test');

test('floating widget persists between sessions', async ({ page }) => {
  // Start application
  await page.goto('app://localhost');

  // Find and move widget
  const widget = await page.locator('[data-testid="floating-widget"]');
  await widget.dragTo({ x: 300, y: 200 });

  // Verify position
  const position = await widget.evaluate(el => {
    const style = window.getComputedStyle(el);
    return {
      left: parseInt(style.left),
      top: parseInt(style.top)
    };
  });

  expect(position.left).toBe(300);
  expect(position.top).toBe(200);

  // Restart application
  await page.evaluate(() => window.electronAPI.restartApp());
  await page.waitForLoadState('domcontentloaded');

  // Check if widget position was restored
  const newWidget = await page.locator('[data-testid="floating-widget"]');
  const newPosition = await newWidget.evaluate(el => {
    const style = window.getComputedStyle(el);
    return {
      left: parseInt(style.left),
      top: parseInt(style.top)
    };
  });

  expect(newPosition.left).toBe(300);
  expect(newPosition.top).toBe(200);
});
```

### Manual Testing

Manual testing covers aspects that are difficult to automate or require human judgment.

#### What to Test

- **Visual Appearance**
  - UI consistency
  - Animations and transitions
  - Responsive design

- **Usability**
  - Intuitive interactions
  - Error messages
  - Performance perception

- **Platform-Specific**
  - System integration
  - Hardware interactions
  - OS-specific features

#### Test Cases

1. **Widget Dragging and Resizing**
   - Drag widget to different screen positions
   - Drag widget to screen edges
   - Drag widget between multiple monitors
   - Verify widget stays within visible area
   - Resize widget using the resize handle
   - Verify minimum and maximum size constraints
   - Test resizing behavior with different content

2. **Multiple Widgets**
   - Create multiple widgets for different API providers
   - Test different layout modes (free, grid, line)
   - Verify widgets don't overlap in grid and line layouts
   - Test adding and removing widgets
   - Verify each widget displays correct data for its provider

3. **Widget Configuration Presets**
   - Save widget configuration as preset
   - Load widget configuration from preset
   - Delete widget configuration preset
   - Verify all widget properties are correctly saved and restored
   - Test preset management with multiple presets

4. **Widget Persistence**
   - Move and resize widgets, close application, reopen
   - Move and resize widgets, restart computer, open application
   - Verify widgets appear in the same positions and sizes
   - Test persistence of multiple widgets

5. **System Tray**
   - Verify tray icon appears
   - Test context menu options
   - Check tray icon tooltip
   - Test click behavior
   - Verify widget visibility toggle

6. **API Integration**
   - Test API key validation for all providers (OpenAI, Claude, Gemini)
   - Verify token counting accuracy
   - Test cost calculation
   - Verify usage tracking
   - Test error handling for invalid API keys

7. **Notifications**
   - Verify notifications appear
   - Test notification interaction
   - Check notification styling
   - Verify notifications respect system settings

## Test Environments

### Development

- Local development machines
- Quick feedback loop
- Focus on unit and component tests
- Manual testing of new features

### Continuous Integration

- Automated test suite on each commit
- Cross-platform testing
- Integration and E2E tests
- Build verification

### Pre-Release

- Beta testing environment
- Full test suite
- Performance testing
- Security testing

### Production

- Smoke tests
- Monitoring
- Crash reporting
- User feedback collection

## Test Data

### Mock Data

- Predefined API responses
- Simulated usage patterns
- Edge cases and error conditions
- Different provider configurations
- Mock data for all API providers (OpenAI, Claude, Gemini)
- Simulated token usage and cost data
- Widget configuration presets

### Test Accounts

- Development API keys
- Test user accounts
- Different permission levels
- Various subscription tiers

## Test Automation

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18.x]

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - name: Install dependencies
      run: npm ci
    - name: Run unit tests
      run: npm test
    - name: Run integration tests
      run: npm run test:integration
    - name: Build application
      run: npm run electron:build
    - name: Run E2E tests
      run: npm run test:e2e
    - name: Test widget
      run: npm run widget:test
```

### Test Reports

- JUnit XML reports
- Code coverage reports
- Visual regression reports
- Performance benchmarks

## Bug Tracking

### Bug Report Template

```markdown
## Bug Description
[Clear and concise description of the bug]

## Steps to Reproduce
1. [First Step]
2. [Second Step]
3. [and so on...]

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Screenshots
[If applicable, add screenshots]

## Environment
- OS: [e.g. Windows 10]
- Application Version: [e.g. 1.0.0]
- Additional context: [Any other relevant information]
```

### Bug Severity Levels

1. **Critical**
   - Application crashes
   - Data loss
   - Security vulnerabilities
   - Complete feature failure

2. **Major**
   - Significant feature impairment
   - Incorrect calculations
   - UI rendering issues
   - Performance degradation

3. **Minor**
   - Cosmetic issues
   - Unclear error messages
   - Non-optimal workflows
   - Edge case failures

4. **Trivial**
   - Typos
   - Minor visual inconsistencies
   - Nice-to-have improvements

## Test Schedule

### Daily

- Unit tests on each commit
- Integration tests on feature branches
- Manual testing of new features

### Weekly

- Full test suite on develop branch
- Cross-platform testing
- Performance benchmarks

### Pre-Release

- Complete regression testing
- Security testing
- Accessibility testing
- User acceptance testing

## Responsibilities

### Developers

- Write and maintain unit tests
- Perform initial manual testing
- Fix bugs identified in testing
- Review test results

### QA Engineers

- Design test cases
- Implement integration and E2E tests
- Perform exploratory testing
- Report and track bugs

### DevOps

- Maintain test infrastructure
- Configure CI/CD pipelines
- Monitor test performance
- Generate test reports

## Success Criteria

- **Code Coverage**: Minimum 80% for critical paths
- **Test Pass Rate**: 100% pass rate for all tests in CI
- **Bug Density**: Less than 0.5 bugs per 1000 lines of code
- **User Satisfaction**: >90% positive feedback on widget functionality
- **API Integration**: 100% accuracy in token counting and cost calculation
- **Widget Performance**: <100ms response time for widget interactions
- **Cross-Platform**: Consistent behavior across Windows, macOS, and Linux
