# Secure API Key Storage in APIwidget

This document explains how API keys are securely stored in the APIwidget application.

## Overview

APIwidget uses a secure, encrypted storage system to protect user API keys. The implementation ensures that:

1. API keys are stored locally on the user's machine
2. Keys are encrypted at rest using a machine-specific encryption key
3. Keys are never transmitted to any external servers
4. Keys are only decrypted when needed for API calls

## Implementation Details

### Technology

We use the `electron-store` package to implement secure storage. This package provides:

- Persistent storage using JSON files
- Encryption of sensitive data
- Schema validation
- Default values

### Encryption

API keys are encrypted using the following approach:

1. In production, a unique encryption key is generated based on the user's machine ID
   - This ensures the encryption key is unique per machine but consistent across app restarts
   - The key is derived using SHA-256 hashing of the user's data path
   - Only the first 32 characters are used for AES-256 encryption

2. In development, a fixed key is used for easier debugging

### Storage Location

The encrypted data is stored in:

- Windows: `%APPDATA%\apiwidget\apiwidget-store.json`
- macOS: `~/Library/Application Support/apiwidget/apiwidget-store.json`
- Linux: `~/.config/apiwidget/apiwidget-store.json`

### API Key Validation

Before storing API keys, the application performs basic validation to ensure they match the expected format for each provider:

- **OpenAI**: Keys should start with `sk-` and be at least 30 characters
- **Claude**: Keys should start with `sk-` and be at least 30 characters
- **Gemini**: Keys should be alphanumeric with possible underscores/hyphens and at least 30 characters
- **GitHub**: Keys should start with `ghp_` or `ghs_` and be at least 30 characters
- **AWS**: Keys should be uppercase alphanumeric and at least 15 characters
- **Azure**: Keys should be at least 30 characters

Additionally, the application validates API keys by making a test request to the provider's API to ensure they are valid. This provides an extra layer of validation beyond just checking the format.

```typescript
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    // Make a simple request to test the API key
    const response = await axios.get(
      `${API_BASE_URL}/models?key=${apiKey}`
    );

    return response.status === 200;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
};
```

If a key doesn't match the expected format or fails validation, the application still saves it but displays a warning to the user.

## Security Considerations

1. **No Remote Storage**: API keys are never transmitted to any remote servers
2. **Encryption at Rest**: Keys are encrypted on disk to protect against local file access
3. **Machine-Specific Encryption**: The encryption key is derived from the user's machine, making it difficult to decrypt the data on another machine
4. **Minimal Access**: Keys are only decrypted when needed for API calls
5. **Validation**: Basic validation helps prevent storing invalid keys

## API

The application provides the following IPC handlers for API key management:

- `get-api-key(provider)`: Retrieves an API key for the specified provider
- `save-api-key(provider, key)`: Saves an API key for the specified provider
- `delete-api-key(provider)`: Deletes an API key for the specified provider
- `validate-api-key(provider, key)`: Validates an API key for the specified provider
- `get-key-usage(provider)`: Gets usage statistics for the specified provider's API key
- `update-key-last-used(provider)`: Updates the last used timestamp for the specified provider's API key

These handlers are exposed to the renderer process through the `electronAPI` object in the preload script:

```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  getApiKey: (provider) => ipcRenderer.invoke('get-api-key', provider),
  saveApiKey: (provider, key) => ipcRenderer.invoke('save-api-key', provider, key),
  deleteApiKey: (provider) => ipcRenderer.invoke('delete-api-key', provider),
  validateApiKey: (provider, key) => ipcRenderer.invoke('validate-api-key', provider, key),
  getKeyUsage: (provider) => ipcRenderer.invoke('get-key-usage', provider),
  updateKeyLastUsed: (provider) => ipcRenderer.invoke('update-key-last-used', provider)
});
```

## Testing

The API key storage system can be tested using the `test-api-key-storage.js` script in the `electron/tests` directory. This script:

1. Initializes the secure store
2. Tests saving API keys
3. Tests retrieving API keys
4. Tests deleting API keys
5. Tests updating API keys

To run the test, use the `test-api-key-storage.bat` script in the root directory.

## Recent Improvements

1. **Enhanced Validation**: Added real API validation for all providers
2. **Improved Error Handling**: Better error messages and recovery options
3. **Last Used Tracking**: Added tracking of when each API key was last used
4. **Usage Statistics**: Added usage statistics for each API key
5. **Key Health Monitoring**: Added monitoring of API key health and validity

## Future Improvements

1. **Additional Encryption**: Consider adding an additional layer of encryption using a user-provided password
2. **Key Rotation**: Implement key rotation to periodically re-encrypt the data with a new key
3. **Secure Memory**: Ensure API keys are securely wiped from memory after use
4. **Hardware Security**: On supported platforms, integrate with hardware security modules or secure enclaves
5. **Audit Logging**: Add logging of key access for security auditing
6. **Biometric Authentication**: Add support for biometric authentication for accessing API keys
7. **Cloud Backup**: Add optional encrypted cloud backup for API keys
