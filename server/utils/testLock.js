import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectRedis } from '../config/redis.js';
import { acquireLock, verifyLock, releaseLock } from '../services/lockManager.js';

// Resolve environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const runTests = async () => {
  await connectRedis();
  console.log('\n--- Running Lock Manager Tests ---\n');

  // Test 1: First time locking
  let res = await acquireLock('event1', 'seat1', 'user1');
  console.log(`Test 1 (acquireLock user1): ${res === 'SUCCESS' ? '✅ PASS' : '❌ FAIL'} (${res})`);

  // Test 2: Same user re-locking their own seat
  res = await acquireLock('event1', 'seat1', 'user1');
  console.log(`Test 2 (re-lock user1): ${res === 'SUCCESS' ? '✅ PASS' : '❌ FAIL'} (${res})`);

  // Test 3: Different user trying to lock the same seat
  res = await acquireLock('event1', 'seat1', 'user2');
  console.log(`Test 3 (acquireLock user2): ${res === 'LOCKED_BY_OTHER' ? '✅ PASS' : '❌ FAIL'} (${res})`);

  // Test 4: Verify the lock belongs to user1
  let isLocked = await verifyLock('event1', 'seat1', 'user1');
  console.log(`Test 4 (verifyLock user1): ${isLocked === true ? '✅ PASS' : '❌ FAIL'} (${isLocked})`);

  // Test 5: Release the lock, then let user2 acquire it
  await releaseLock('event1', 'seat1', 'user1');
  res = await acquireLock('event1', 'seat1', 'user2');
  console.log(`Test 5 (release -> user2 acquire): ${res === 'SUCCESS' ? '✅ PASS' : '❌ FAIL'} (${res})`);

  console.log('\nAll tests completed!');
  process.exit(0);
};

runTests();