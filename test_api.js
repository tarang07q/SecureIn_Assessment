const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    console.log(`\n Testing: ${url}`);
    
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            console.log(`✅ Status: ${res.statusCode} OK`);
            resolve(parsed);
          } catch (e) {
            console.log(`❌ Failed to parse JSON: ${e.message}`);
            reject(e);
          }
        } else {
          console.log(`❌ Status: ${res.statusCode}`);
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      console.log(`❌ Connection error: ${err.message}`);
      reject(err);
    });
  });
}

async function runTests() {
  console.log(' Starting API Tests...\n');
  console.log('=' .repeat(60));
  
  try {
    console.log('\n Test 1: GET /api/recipes (default)');
    const test1 = await makeRequest('/api/recipes');
    console.log(`   Page: ${test1.page}, Limit: ${test1.limit}, Total: ${test1.total}`);
    console.log(`   Records returned: ${test1.data.length}`);
    if (test1.data.length > 0) {
      console.log(`   First recipe: "${test1.data[0].title}" (rating: ${test1.data[0].rating})`);
    }
    console.log('\n📋 Test 2: GET /api/recipes?page=2&limit=5');
    const test2 = await makeRequest('/api/recipes?page=2&limit=5');
    console.log(`   Page: ${test2.page}, Limit: ${test2.limit}, Total: ${test2.total}`);
    console.log(`   Records returned: ${test2.data.length}`);
    
    console.log('\n📋 Test 3: Search by title (chicken)');
    const test3 = await makeRequest('/api/recipes/search?title=chicken');
    console.log(`   Records found: ${test3.data.length}`);
    if (test3.data.length > 0) {
      console.log(`   Sample: "${test3.data[0].title}"`);
    }
    
    console.log('\n📋 Test 4: Search by cuisine (Southern Recipes)');
    const test4 = await makeRequest('/api/recipes/search?cuisine=Southern%20Recipes');
    console.log(`   Records found: ${test4.data.length}`);
    if (test4.data.length > 0) {
      console.log(`   Sample: "${test4.data[0].title}" - ${test4.data[0].cuisine}`);
    }
    
    console.log('\n📋 Test 5: Search by rating >= 4.5');
    const test5 = await makeRequest('/api/recipes/search?rating=%3E%3D4.5');
    console.log(`   Records found: ${test5.data.length}`);
    if (test5.data.length > 0) {
      console.log(`   Sample: "${test5.data[0].title}" (rating: ${test5.data[0].rating})`);
    }

    console.log('\n📋 Test 6: Search by calories <= 400');
    const test6 = await makeRequest('/api/recipes/search?calories=%3C%3D400');
    console.log(`   Records found: ${test6.data.length}`);
    if (test6.data.length > 0) {
      console.log(`   Sample: "${test6.data[0].title}" (${test6.data[0].calories_value} cal)`);
    }
    
    console.log('\n📋 Test 7: Search by total_time < 60');
    const test7 = await makeRequest('/api/recipes/search?total_time=%3C60');
    console.log(`   Records found: ${test7.data.length}`);
    if (test7.data.length > 0) {
      console.log(`   Sample: "${test7.data[0].title}" (${test7.data[0].total_time} min)`);
    }
    
    console.log('\n📋 Test 8: Combined search (title=pie, rating>=4.5, calories<=400)');
    const test8 = await makeRequest('/api/recipes/search?title=pie&rating=%3E%3D4.5&calories=%3C%3D400');
    console.log(`   Records found: ${test8.data.length}`);
    if (test8.data.length > 0) {
      console.log(`   Sample: "${test8.data[0].title}"`);
      console.log(`           Rating: ${test8.data[0].rating}, Calories: ${test8.data[0].calories_value}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ Tests failed!');
    console.log('\nPossible issues:');
    console.log('  1. Server not running → Run: npm start or npm run dev');
    console.log('  2. MongoDB not running → Check: Get-Service MongoDB');
    console.log('  3. No data imported → Run: npm run import');
    console.log('\nError:', error.message);
  }
}

runTests();
