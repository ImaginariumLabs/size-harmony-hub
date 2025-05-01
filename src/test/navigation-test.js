/**
 * Navigation Test Script
 * 
 * This script tests all navigation paths and components in the APIwidget application.
 * It can be run in both web and Electron environments to ensure cross-environment compatibility.
 */

// Import required modules
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Define test paths to check
const navigationPaths = [
  '/',
  '/dashboard',
  '/usage',
  '/history',
  '/settings',
  '/providers',
  '/widgets',
  '/floating-widgets',
  '/admin/users',
  '/admin/providers',
  '/admin/settings',
  '/admin/analytics'
];

// Define components to test
const componentsToTest = [
  'Dashboard',
  'UsagePage',
  'HistoryPage',
  'SettingsPage',
  'ProviderDetail',
  'WidgetGallery',
  'FloatingWidgetManager',
  'UserManagement',
  'ProviderManagement',
  'SystemSettings',
  'UsageAnalytics'
];

// Create log file
const logFile = path.join(__dirname, 'navigation-test.log');
fs.writeFileSync(logFile, `Navigation Test Started: ${new Date().toISOString()}\n\n`);

// Log function
function log(message) {
  console.log(message);
  fs.appendFileSync(logFile, `${message}\n`);
}

// Test function
async function runTests() {
  log('Starting navigation tests...');
  
  // Create main window
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  // Load the app
  await mainWindow.loadURL('http://localhost:5173');
  log('App loaded successfully');
  
  // Wait for app to initialize
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Test each navigation path
  for (const path of navigationPaths) {
    try {
      log(`Testing navigation to: ${path}`);
      
      // Navigate to path
      await mainWindow.webContents.executeJavaScript(`
        try {
          window.location.hash = '${path}';
          'Navigation successful';
        } catch (error) {
          'Navigation failed: ' + error.message;
        }
      `);
      
      // Wait for navigation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if page loaded correctly
      const title = await mainWindow.webContents.executeJavaScript(`
        document.title
      `);
      
      log(`  Page title: ${title}`);
      
      // Check for errors
      const errors = await mainWindow.webContents.executeJavaScript(`
        Array.from(document.querySelectorAll('.error-message, .MuiAlert-standardError')).map(el => el.textContent).join(', ');
      `);
      
      if (errors) {
        log(`  ERRORS FOUND: ${errors}`);
      } else {
        log('  No errors detected');
      }
      
    } catch (error) {
      log(`  ERROR testing ${path}: ${error.message}`);
    }
  }
  
  // Test each component
  for (const component of componentsToTest) {
    try {
      log(`Testing component: ${component}`);
      
      // Check if component exists and renders
      const componentExists = await mainWindow.webContents.executeJavaScript(`
        try {
          const componentElements = document.querySelectorAll('[data-testid="${component}"], [data-component="${component}"]');
          componentElements.length > 0 ? 'Component found' : 'Component not found';
        } catch (error) {
          'Component check failed: ' + error.message;
        }
      `);
      
      log(`  ${componentExists}`);
      
    } catch (error) {
      log(`  ERROR testing ${component}: ${error.message}`);
    }
  }
  
  // Test authentication
  try {
    log('Testing authentication...');
    
    // Check if login form exists
    const loginExists = await mainWindow.webContents.executeJavaScript(`
      document.querySelector('form[data-testid="login-form"]') !== null ? 'Login form found' : 'Login form not found';
    `);
    
    log(`  ${loginExists}`);
    
    // Test login if form exists
    if (loginExists === 'Login form found') {
      const loginResult = await mainWindow.webContents.executeJavaScript(`
        try {
          const emailInput = document.querySelector('input[type="email"]');
          const passwordInput = document.querySelector('input[type="password"]');
          const submitButton = document.querySelector('button[type="submit"]');
          
          if (emailInput && passwordInput && submitButton) {
            emailInput.value = 'test@example.com';
            passwordInput.value = 'password123';
            submitButton.click();
            'Login attempted';
          } else {
            'Login form incomplete';
          }
        } catch (error) {
          'Login test failed: ' + error.message;
        }
      `);
      
      log(`  ${loginResult}`);
      
      // Wait for login process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if login was successful
      const loginSuccess = await mainWindow.webContents.executeJavaScript(`
        document.querySelector('[data-testid="user-menu"]') !== null ? 'Login successful' : 'Login failed';
      `);
      
      log(`  ${loginSuccess}`);
    }
    
  } catch (error) {
    log(`  ERROR testing authentication: ${error.message}`);
  }
  
  // Test environment detection
  try {
    log('Testing environment detection...');
    
    const environment = await mainWindow.webContents.executeJavaScript(`
      window.isElectron ? 'Electron environment detected' : 'Web environment detected';
    `);
    
    log(`  ${environment}`);
    
  } catch (error) {
    log(`  ERROR testing environment: ${error.message}`);
  }
  
  // Close the window
  mainWindow.close();
  
  log('\nNavigation tests completed');
}

// Run the app
app.whenReady().then(runTests);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
