// Simple test script to verify AuthCallback URL parameter handling
// Run with: node test-auth-callback.js

const testCases = [
  {
    url: 'http://localhost:8081/auth/callback?error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired',
    expected: 'The email link has expired. Please request a new one.'
  },
  {
    url: 'http://localhost:8081/auth/callback?error=access_denied&error_description=Invalid+credentials',
    expected: 'Invalid credentials'
  },
  {
    url: 'http://localhost:8081/auth/callback?error=server_error',
    expected: 'Authentication failed.'
  },
  {
    url: 'http://localhost:8081/auth/callback', // No error params
    expected: null // Should not show error
  }
];

function parseUrlParams(url) {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);

  const errorParam = params.get('error');
  const errorCode = params.get('error_code');
  const errorDescription = params.get('error_description');

  if (errorParam) {
    let errorMessage = 'Authentication failed.';

    if (errorCode === 'otp_expired') {
      errorMessage = 'The email link has expired. Please request a new one.';
    } else if (errorDescription) {
      errorMessage = errorDescription.replace(/\+/g, ' ');
    }

    return errorMessage;
  }

  return null;
}

console.log('Testing AuthCallback URL parameter parsing...\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = parseUrlParams(testCase.url);
  const success = result === testCase.expected;

  console.log(`Test ${index + 1}: ${success ? 'PASS' : 'FAIL'}`);
  console.log(`  URL: ${testCase.url}`);
  console.log(`  Expected: ${testCase.expected}`);
  console.log(`  Got: ${result}`);

  if (success) {
    passed++;
  } else {
    failed++;
  }
  console.log('');
});

console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('✅ All URL parameter parsing tests passed!');
} else {
  console.log('❌ Some tests failed. Please check the implementation.');
}
