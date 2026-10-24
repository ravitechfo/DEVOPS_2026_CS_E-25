// Automated Smoke & Unit Test Suite for Smart Campus Backend
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Smart Campus Backend Automated Tests...');

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Verify Entrypoint File
assert(fs.existsSync(path.join(__dirname, 'server.js')), 'server.js entrypoint exists');

// 2. Verify Config & Route Files
assert(fs.existsSync(path.join(__dirname, 'config/db.js')), 'config/db.js database module exists');
assert(fs.existsSync(path.join(__dirname, 'routes/auth.js')), 'routes/auth.js exists');
assert(fs.existsSync(path.join(__dirname, 'routes/booking.js')), 'routes/booking.js exists');
assert(fs.existsSync(path.join(__dirname, 'routes/gatepass.js')), 'routes/gatepass.js exists');
assert(fs.existsSync(path.join(__dirname, 'routes/library.js')), 'routes/library.js exists');

// 3. Verify Models
assert(fs.existsSync(path.join(__dirname, 'models/User.js')), 'models/User.js exists');
assert(fs.existsSync(path.join(__dirname, 'models/GatePass.js')), 'models/GatePass.js exists');
assert(fs.existsSync(path.join(__dirname, 'models/LibraryResource.js')), 'models/LibraryResource.js exists');

// 4. Verify Syntax of server.js
try {
  require('child_process').execSync('node -c ' + path.join(__dirname, 'server.js'));
  assert(true, 'server.js JavaScript syntax verification');
} catch (e) {
  assert(false, 'server.js JavaScript syntax check failed: ' + e.message);
}

console.log(`\n========================================`);
console.log(`Test Results: ${passed}/${total} assertions passed`);
console.log(`========================================\n`);

if (passed === total) {
  console.log('🎉 All automated tests passed successfully!');
  process.exit(0);
} else {
  console.error('❌ Some tests failed.');
  process.exit(1);
}
