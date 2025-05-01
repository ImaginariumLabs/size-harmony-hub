/**
 * Utilities for API key encryption and security
 */

// For web environment, we'll use the Web Crypto API
// For Electron, we'll use a more secure approach with the node crypto module

import { isPlatform } from './platformUtils';

/**
 * Generates a secure encryption key
 * @returns A Promise that resolves to an encryption key
 */
export const generateEncryptionKey = async (): Promise<CryptoKey> => {
  // Use the Web Crypto API to generate a secure encryption key
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
};

/**
 * Exports an encryption key to a base64 string
 * @param key The encryption key to export
 * @returns A Promise that resolves to a base64 string
 */
export const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
};

/**
 * Imports an encryption key from a base64 string
 * @param keyStr The base64 string to import
 * @returns A Promise that resolves to an encryption key
 */
export const importKey = async (keyStr: string): Promise<CryptoKey> => {
  const keyData = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypts an API key
 * @param apiKey The API key to encrypt
 * @param encryptionKey The encryption key to use
 * @returns A Promise that resolves to an encrypted API key
 */
export const encryptApiKey = async (
  apiKey: string,
  encryptionKey: CryptoKey
): Promise<string> => {
  // Generate a random initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the API key
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    encryptionKey,
    data
  );
  
  // Combine the IV and encrypted data
  const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength);
  encryptedArray.set(iv);
  encryptedArray.set(new Uint8Array(encryptedData), iv.length);
  
  // Convert to base64 for storage
  return btoa(String.fromCharCode(...encryptedArray));
};

/**
 * Decrypts an API key
 * @param encryptedApiKey The encrypted API key to decrypt
 * @param encryptionKey The encryption key to use
 * @returns A Promise that resolves to a decrypted API key
 */
export const decryptApiKey = async (
  encryptedApiKey: string,
  encryptionKey: CryptoKey
): Promise<string> => {
  try {
    // Convert from base64
    const encryptedArray = Uint8Array.from(
      atob(encryptedApiKey),
      c => c.charCodeAt(0)
    );
    
    // Extract the IV and encrypted data
    const iv = encryptedArray.slice(0, 12);
    const encryptedData = encryptedArray.slice(12);
    
    // Decrypt the API key
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      encryptionKey,
      encryptedData
    );
    
    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Error decrypting API key:', error);
    throw new Error('Failed to decrypt API key');
  }
};

/**
 * Securely stores an API key
 * @param apiKey The API key to store
 * @param keyId A unique identifier for the API key
 * @returns A Promise that resolves when the API key is stored
 */
export const securelyStoreApiKey = async (
  apiKey: string,
  keyId: string
): Promise<void> => {
  try {
    // Generate or retrieve an encryption key
    let encryptionKey: CryptoKey;
    const storedKeyStr = localStorage.getItem('encryption_key');
    
    if (storedKeyStr) {
      // Use the existing encryption key
      encryptionKey = await importKey(storedKeyStr);
    } else {
      // Generate a new encryption key
      encryptionKey = await generateEncryptionKey();
      const keyStr = await exportKey(encryptionKey);
      localStorage.setItem('encryption_key', keyStr);
    }
    
    // Encrypt the API key
    const encryptedApiKey = await encryptApiKey(apiKey, encryptionKey);
    
    // Store the encrypted API key
    if (isPlatform('electron')) {
      // In Electron, use electron-store (this is a mock implementation)
      // In a real implementation, we would use the actual electron-store API
      console.log('Storing API key in electron-store');
      // @ts-ignore - This would be properly implemented in the actual app
      window.electronStore.set(`api_keys.${keyId}`, encryptedApiKey);
    } else {
      // In web, use localStorage
      localStorage.setItem(`api_key_${keyId}`, encryptedApiKey);
    }
  } catch (error) {
    console.error('Error storing API key:', error);
    throw new Error('Failed to store API key');
  }
};

/**
 * Retrieves a securely stored API key
 * @param keyId The unique identifier for the API key
 * @returns A Promise that resolves to the API key, or null if not found
 */
export const retrieveApiKey = async (keyId: string): Promise<string | null> => {
  try {
    // Retrieve the encrypted API key
    let encryptedApiKey: string | null;
    
    if (isPlatform('electron')) {
      // In Electron, use electron-store (this is a mock implementation)
      // In a real implementation, we would use the actual electron-store API
      console.log('Retrieving API key from electron-store');
      // @ts-ignore - This would be properly implemented in the actual app
      encryptedApiKey = window.electronStore.get(`api_keys.${keyId}`);
    } else {
      // In web, use localStorage
      encryptedApiKey = localStorage.getItem(`api_key_${keyId}`);
    }
    
    if (!encryptedApiKey) {
      return null;
    }
    
    // Retrieve the encryption key
    const storedKeyStr = localStorage.getItem('encryption_key');
    
    if (!storedKeyStr) {
      console.error('Encryption key not found');
      return null;
    }
    
    const encryptionKey = await importKey(storedKeyStr);
    
    // Decrypt the API key
    return await decryptApiKey(encryptedApiKey, encryptionKey);
  } catch (error) {
    console.error('Error retrieving API key:', error);
    return null;
  }
};

/**
 * Deletes a securely stored API key
 * @param keyId The unique identifier for the API key
 * @returns A Promise that resolves when the API key is deleted
 */
export const deleteApiKey = async (keyId: string): Promise<void> => {
  try {
    if (isPlatform('electron')) {
      // In Electron, use electron-store (this is a mock implementation)
      // In a real implementation, we would use the actual electron-store API
      console.log('Deleting API key from electron-store');
      // @ts-ignore - This would be properly implemented in the actual app
      window.electronStore.delete(`api_keys.${keyId}`);
    } else {
      // In web, use localStorage
      localStorage.removeItem(`api_key_${keyId}`);
    }
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw new Error('Failed to delete API key');
  }
};

/**
 * Rotates an API key
 * @param oldKeyId The unique identifier for the old API key
 * @param newApiKey The new API key
 * @param newKeyId The unique identifier for the new API key
 * @returns A Promise that resolves when the API key is rotated
 */
export const rotateApiKey = async (
  oldKeyId: string,
  newApiKey: string,
  newKeyId: string
): Promise<void> => {
  try {
    // Store the new API key
    await securelyStoreApiKey(newApiKey, newKeyId);
    
    // Delete the old API key
    await deleteApiKey(oldKeyId);
  } catch (error) {
    console.error('Error rotating API key:', error);
    throw new Error('Failed to rotate API key');
  }
};

/**
 * Validates an API key format
 * @param apiKey The API key to validate
 * @returns True if the API key is valid, false otherwise
 */
export const validateApiKeyFormat = (apiKey: string): boolean => {
  // This is a simple example - in a real implementation, we would have more sophisticated validation
  // based on the specific API key format requirements
  
  // Check if the API key is not empty
  if (!apiKey) return false;
  
  // Check if the API key has a minimum length
  if (apiKey.length < 10) return false;
  
  // Check if the API key contains only valid characters
  const validCharsRegex = /^[A-Za-z0-9_\-]+$/;
  if (!validCharsRegex.test(apiKey)) return false;
  
  return true;
};

/**
 * Sanitizes an API key
 * @param apiKey The API key to sanitize
 * @returns The sanitized API key
 */
export const sanitizeApiKey = (apiKey: string): string => {
  // Remove any whitespace
  let sanitized = apiKey.trim();
  
  // Remove any non-alphanumeric characters except for underscores and hyphens
  sanitized = sanitized.replace(/[^A-Za-z0-9_\-]/g, '');
  
  return sanitized;
};
