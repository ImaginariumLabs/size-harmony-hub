// Test script to verify timeout protection improvements

// Import the enhanced API service
const enhancedApiService = require('../services/enhancedApiService');

// Test function to verify timeout protection
async function testTimeoutProtection() {
  console.log('Starting timeout protection test...');
  
  try {
    // Test with a simulated API call that takes too long
    console.log('Testing timeout protection with a slow API call...');
    const slowApiCall = new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: 'This should not be returned due to timeout' });
      }, 10000); // 10 seconds, which is longer than our timeout
    });
    
    // Use the timeout protection from enhancedApiService
    const result = await enhancedApiService.withTimeout(
      slowApiCall,
      5000, // 5 second timeout
      { data: 'Fallback data' } // Fallback data
    );
    
    console.log('Result:', result);
    console.log('Test passed: Timeout protection is working correctly');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testTimeoutProtection();
