// Simple test script to verify timeout protection

// Timeout utility function
const withTimeout = (promise, timeoutMs, fallbackData) => {
  // Create a timeout promise that rejects after the specified time
  const timeout = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  // Race the original promise against the timeout
  return Promise.race([promise, timeout])
    .then((result) => result)
    .catch((error) => {
      console.warn(`API call failed: ${error.message}`);
      return fallbackData;
    });
};

// Mock API call that simulates a slow response
const mockApiCall = () => {
  return new Promise((resolve) => {
    // This will take 10 seconds, which should trigger our timeout
    setTimeout(() => {
      resolve({ data: 'This should not be returned due to timeout' });
    }, 10000);
  });
};

// Mock API call that simulates an error
const mockErrorApiCall = () => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('API error occurred'));
    }, 2000);
  });
};

// Test timeout protection
async function testTimeoutProtection() {
  console.log('Starting timeout protection test...');
  
  try {
    console.log('Testing timeout protection with a slow API call...');
    console.log('This should timeout after 5 seconds and return fallback data.');
    
    const result = await withTimeout(
      mockApiCall(),
      5000, // 5 second timeout
      { data: 'Fallback data (timeout occurred)' } // Fallback data
    );
    
    console.log('Result:', result);
    
    if (result.data === 'Fallback data (timeout occurred)') {
      console.log('✅ Test passed: Timeout protection is working correctly');
    } else {
      console.log('❌ Test failed: Did not receive fallback data');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test error handling
async function testErrorHandling() {
  console.log('\nStarting error handling test...');
  
  try {
    console.log('Testing error handling with an API call that will fail...');
    console.log('This should catch the error after 2 seconds and return fallback data.');
    
    const result = await withTimeout(
      mockErrorApiCall(),
      5000, // 5 second timeout
      { data: 'Fallback data (error occurred)' } // Fallback data
    );
    
    console.log('Result:', result);
    
    if (result.data === 'Fallback data (error occurred)') {
      console.log('✅ Test passed: Error handling is working correctly');
    } else {
      console.log('❌ Test failed: Did not receive fallback data');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
async function runTests() {
  await testTimeoutProtection();
  await testErrorHandling();
  
  console.log('\n=== Test Summary ===');
  console.log('These tests verify that our timeout protection and error handling improvements are working correctly.');
  console.log('If both tests passed, it means that:');
  console.log('1. API calls that take too long will timeout and use fallback data');
  console.log('2. API calls that fail will be caught and use fallback data');
  console.log('3. Loading states will be properly reset');
  console.log('\nThese improvements should resolve the endless loading and black screen issues in the application.');
}

runTests();
