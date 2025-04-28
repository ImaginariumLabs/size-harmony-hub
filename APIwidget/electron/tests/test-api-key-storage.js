// Test script for API key storage
const { app, BrowserWindow } = require('electron');
const path = require('path');
const crypto = require('crypto');

// Log startup information
console.log('Starting API Key Storage Test');
console.log('Node.js version:', process.version);
console.log('Electron version:', process.versions.electron);
console.log('Current directory:', process.cwd());

// We'll initialize the store after app is ready
let Store;
let store;

// Generate a secure encryption key based on the machine ID
const generateEncryptionKey = () => {
  try {
    // In production, use a value derived from the user's machine
    // This ensures the encryption key is unique per machine but consistent across app restarts
    if (app.isPackaged) {
      // Get a unique identifier for the user's machine
      const machineId = crypto
        .createHash('sha256')
        .update(app.getPath('userData'))
        .digest('hex')
        .substring(0, 32); // Use first 32 chars (16 bytes) for AES-256

      console.log('Using secure encryption key derived from machine ID');
      return machineId;
    } else {
      // For development, use a fixed key
      console.log('Using development encryption key');
      return 'dev-encryption-key-apiwidget-secure';
    }
  } catch (error) {
    console.error('Error generating encryption key:', error);
    // Fallback to a default key (less secure but better than nothing)
    return 'apiwidget-fallback-encryption-key';
  }
};

// Store configuration
const storeConfig = {
  name: 'apiwidget-test-store', // Use a different name for testing
  encryptionKey: generateEncryptionKey(), // Secure encryption key
  clearInvalidConfig: true, // Clear the config if it becomes corrupted
  schema: {
    apiKeys: {
      type: 'object',
      properties: {
        openai: { type: 'string' },
        github: { type: 'string' },
        aws: { type: 'string' },
        azure: { type: 'string' },
        google: { type: 'string' }
      },
      default: {
        openai: '',
        github: '',
        aws: '',
        azure: '',
        google: ''
      }
    }
  }
};

// Test API key operations
async function testApiKeyStorage() {
  console.log('Testing API key storage...');

  // Test saving API keys
  console.log('1. Testing saving API keys...');

  // Save test API keys
  store.set('apiKeys.openai', 'sk-test-openai-key-12345');
  store.set('apiKeys.github', 'ghp_test_github_key_12345');

  // Verify keys were saved
  const openaiKey = store.get('apiKeys.openai');
  const githubKey = store.get('apiKeys.github');

  console.log('OpenAI key saved:', openaiKey === 'sk-test-openai-key-12345' ? 'SUCCESS' : 'FAILED');
  console.log('GitHub key saved:', githubKey === 'ghp_test_github_key_12345' ? 'SUCCESS' : 'FAILED');

  // Test retrieving all API keys
  console.log('\n2. Testing retrieving all API keys...');
  const allKeys = store.get('apiKeys');
  console.log('All keys retrieved:', allKeys ? 'SUCCESS' : 'FAILED');
  console.log('Keys:', JSON.stringify(allKeys, null, 2));

  // Test deleting API keys
  console.log('\n3. Testing deleting API keys...');
  store.delete('apiKeys.github');
  const githubKeyAfterDelete = store.get('apiKeys.github');
  console.log('GitHub key deleted:', (githubKeyAfterDelete === '' || githubKeyAfterDelete === undefined) ? 'SUCCESS' : 'FAILED');

  // Test encryption
  console.log('\n4. Testing encryption...');
  console.log('Store path:', store.path);
  console.log('Encryption should prevent reading keys directly from the file.');
  console.log('Check the file manually to verify it contains encrypted data.');

  // Test updating API keys
  console.log('\n5. Testing updating API keys...');
  store.set('apiKeys.openai', 'sk-updated-openai-key-67890');
  const updatedOpenaiKey = store.get('apiKeys.openai');
  console.log('OpenAI key updated:', updatedOpenaiKey === 'sk-updated-openai-key-67890' ? 'SUCCESS' : 'FAILED');

  console.log('\nAPI key storage tests completed!');
}

// Initialize the app and run tests
app.whenReady().then(async () => {
  try {
    // Initialize electron-store with dynamic import
    const StoreModule = await import('electron-store');
    Store = StoreModule.default;

    // Create the store instance with our config
    store = new Store(storeConfig);

    // Run the tests
    await testApiKeyStorage();

    // Exit after tests complete
    setTimeout(() => {
      app.quit();
    }, 1000);
  } catch (error) {
    console.error('Error running tests:', error);
    app.quit();
  }
});

// Handle window-all-closed event
app.on('window-all-closed', () => {
  app.quit();
});
