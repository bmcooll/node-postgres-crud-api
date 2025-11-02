// Simple API testing script
const http = require('http');

const baseUrl = 'http://localhost:3000';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await makeRequest('GET', '/health');
    console.log(`   Status: ${health.status}, Response:`, health.data);

    // Test 2: Get all users
    console.log('\n2. Testing get all users...');
    const users = await makeRequest('GET', '/users');
    console.log(`   Status: ${users.status}, Users found: ${users.data.users?.length || 0}`);

    // Test 3: Get users with pagination
    console.log('\n3. Testing pagination...');
    const paginatedUsers = await makeRequest('GET', '/users?page=1&limit=1');
    console.log(`   Status: ${paginatedUsers.status}, Pagination:`, paginatedUsers.data.pagination);

    // Test 4: Create new user
    console.log('\n4. Testing create user...');
    const newUser = await makeRequest('POST', '/users', {
      name: 'Test User',
      email: 'test@example.com'
    });
    console.log(`   Status: ${newUser.status}, Response:`, newUser.data);

    // Test 5: Invalid email test
    console.log('\n5. Testing invalid email validation...');
    const invalidUser = await makeRequest('POST', '/users', {
      name: 'Invalid User',
      email: 'invalid-email'
    });
    console.log(`   Status: ${invalidUser.status}, Error:`, invalidUser.data.error);

    // Test 6: Search users
    console.log('\n6. Testing search functionality...');
    const searchResults = await makeRequest('GET', '/users?search=Jerry');
    console.log(`   Status: ${searchResults.status}, Results: ${searchResults.data.users?.length || 0}`);

    console.log('\n✅ All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests, makeRequest };