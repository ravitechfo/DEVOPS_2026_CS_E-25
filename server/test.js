// Automated Smoke & Unit Test Suite for Smart Campus Backend
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
assert(fs.existsSync(path.join(__dirname, 'routes/notice.js')), 'routes/notice.js exists');
assert(fs.existsSync(path.join(__dirname, 'routes/complaint.js')), 'routes/complaint.js exists');
assert(fs.existsSync(path.join(__dirname, 'routes/lostfound.js')), 'routes/lostfound.js exists');
assert(fs.existsSync(path.join(__dirname, 'routes/ai.js')), 'routes/ai.js exists');
assert(fs.existsSync(path.join(__dirname, 'middleware/metrics.js')), 'middleware/metrics.js exists');

// 3. Verify Models
assert(fs.existsSync(path.join(__dirname, 'models/User.js')), 'models/User.js exists');
assert(fs.existsSync(path.join(__dirname, 'models/GatePass.js')), 'models/GatePass.js exists');
assert(fs.existsSync(path.join(__dirname, 'models/LibraryResource.js')), 'models/LibraryResource.js exists');
assert(fs.existsSync(path.join(__dirname, 'models/Booking.js')), 'models/Booking.js exists');
assert(fs.existsSync(path.join(__dirname, 'models/Resource.js')), 'models/Resource.js exists');
assert(fs.existsSync(path.join(__dirname, 'models/Notice.js')), 'models/Notice.js exists');
assert(fs.existsSync(path.join(__dirname, 'models/Complaint.js')), 'models/Complaint.js exists');
assert(fs.existsSync(path.join(__dirname, 'models/LostFound.js')), 'models/LostFound.js exists');

// 4. Verify Syntax of JS files
const filesToCheck = [
  'server.js',
  'routes/auth.js',
  'routes/booking.js',
  'routes/gatepass.js',
  'routes/library.js',
  'routes/notice.js',
  'routes/complaint.js',
  'routes/lostfound.js',
  'routes/ai.js',
  'middleware/metrics.js'
];

for (const file of filesToCheck) {
  try {
    execSync('node -c ' + path.join(__dirname, file));
    assert(true, `${file} JavaScript syntax verification`);
  } catch (e) {
    assert(false, `${file} JavaScript syntax check failed: ${e.message}`);
  }
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
