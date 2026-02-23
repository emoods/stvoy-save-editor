/**
 * Unit tests for STV save file encoding/decoding.
 * Run with: node --experimental-vm-modules test/test_encoding.js
 * Or: node test/test_encoding.js (if using CommonJS wrapper)
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Import our modules
import { BitReader, getBit, setBit, readBitsAt, writeBits } from '../js/bitstream.js';
import { encodeI32Packed, encodeU32Packed, encodeString, encodeResourceEntry } from '../js/packed.js';
import { customCrc } from '../js/crc32.js';
import { navigateToCser, getResourceArrayPositions, TAG_RICT, TAG_RINM } from '../js/chunks.js';
import { readResources, modifyResources, addResources } from '../js/resources.js';
import { loadSave, updateFileSize } from '../js/savefile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test results tracking
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        passed++;
    } catch (e) {
        console.log(`✗ ${name}`);
        console.log(`  Error: ${e.message}`);
        failed++;
    }
}

function assertEqual(actual, expected, msg = '') {
    if (actual !== expected) {
        throw new Error(`${msg} Expected ${expected}, got ${actual}`);
    }
}

function assertArrayEqual(actual, expected, msg = '') {
    if (actual.length !== expected.length) {
        throw new Error(`${msg} Array length mismatch: ${actual.length} vs ${expected.length}`);
    }
    for (let i = 0; i < actual.length; i++) {
        if (actual[i] !== expected[i]) {
            throw new Error(`${msg} Array mismatch at index ${i}: ${actual[i]} vs ${expected[i]}`);
        }
    }
}

// ============================================
// Test U32Packed encoding roundtrip
// ============================================

test('encodeU32Packed(0) produces [0]', () => {
    const bits = encodeU32Packed(0);
    assertArrayEqual(bits, [0]);
});

test('encodeU32Packed(1) roundtrips correctly', () => {
    const bits = encodeU32Packed(1);
    // Create a buffer and write bits to it
    const buf = new Uint8Array(10);
    for (let i = 0; i < bits.length; i++) {
        setBit(buf, i, bits[i]);
    }
    // Read back
    const reader = new BitReader(buf, 0);
    // Skip debug check since we didn't add it
    if (!reader.readBool()) {
        throw new Error('Expected nonzero=1');
    }
    const lzc = reader.readBits(5);
    const vb = 32 - lzc;
    const val = vb > 0 ? reader.readBits(vb) : 0;
    assertEqual(val, 1, 'Value mismatch');
});

test('encodeU32Packed roundtrips for various values', () => {
    const testValues = [0, 1, 2, 7, 8, 15, 16, 100, 255, 256, 1000, 10000, 65535, 100000, 1000000];
    
    for (const expected of testValues) {
        const bits = encodeU32Packed(expected);
        const buf = new Uint8Array(10);
        for (let i = 0; i < bits.length; i++) {
            setBit(buf, i, bits[i]);
        }
        
        const reader = new BitReader(buf, 0);
        // Manually decode U32Packed (without debug prefix)
        const nonzero = reader.readBool();
        if (!nonzero) {
            assertEqual(expected, 0, `Value ${expected} encoded as zero`);
            continue;
        }
        const lzc = reader.readBits(5);
        const vb = 32 - lzc;
        const actual = vb > 0 ? reader.readBits(vb) : 0;
        assertEqual(actual, expected, `U32Packed roundtrip failed for ${expected}`);
    }
});

// ============================================
// Test I32Packed encoding roundtrip
// ============================================

test('encodeI32Packed(0) produces [0]', () => {
    const bits = encodeI32Packed(0);
    assertArrayEqual(bits, [0]);
});

test('encodeI32Packed roundtrips for various values', () => {
    const testValues = [0, 1, -1, 2, -2, 7, -7, 100, -100, 1000, -1000, 10000, -10000, 100000, -100000];
    
    for (const expected of testValues) {
        const bits = encodeI32Packed(expected);
        const buf = new Uint8Array(10);
        for (let i = 0; i < bits.length; i++) {
            setBit(buf, i, bits[i]);
        }
        
        const reader = new BitReader(buf, 0);
        // Manually decode I32Packed (without debug prefix)
        const nonzero = reader.readBool();
        if (!nonzero) {
            assertEqual(expected, 0, `Value ${expected} encoded as zero`);
            continue;
        }
        const sign = reader.readBool();
        const lzc = reader.readBits(5);
        const vb = 32 - lzc;
        const magnitude = vb > 0 ? reader.readBits(vb) : 0;
        const actual = sign ? -magnitude : magnitude;
        assertEqual(actual, expected, `I32Packed roundtrip failed for ${expected}`);
    }
});

// ============================================
// Test String encoding roundtrip
// ============================================

test('encodeString empty string', () => {
    const bits = encodeString('');
    // Empty string: debug_bit(0) for length + U32Packed(0) = [0, 0]
    // Note: caller must add outer debug prefix before this
    assertArrayEqual(bits, [0, 0]);
});

test('encodeString roundtrips simple strings', () => {
    const testStrings = ['A', 'AB', 'Crew', 'Energy', 'Items.Item.ResearchPoints'];
    
    for (const expected of testStrings) {
        const stringBits = encodeString(expected);
        // encodeString doesn't include the outer debug prefix for the string,
        // only the debug prefix for the internal U32Packed length.
        // When decoding with readString(-1), it reads:
        //   1. debugSkip(-1) for the string - 1 bit
        //   2. then calls readU32Packed(-1) which has its own debugSkip(-1) - 1 bit
        // So we need to prepend the outer debug bit (0) for readString(-1)
        const bits = [0, ...stringBits];  // outer debug bit for string
        
        const buf = new Uint8Array(Math.ceil(bits.length / 8) + 10);
        for (let i = 0; i < bits.length; i++) {
            setBit(buf, i, bits[i]);
        }
        
        const reader = new BitReader(buf, 0);
        // Use readString(-1) which handles the debug bit internally
        const actual = reader.readString(-1);
        assertEqual(actual, expected, `String roundtrip failed for "${expected}"`);
    }
});

function decodeStringManual(reader) {
    // Read length as U32Packed (no debug)
    const nonzero = reader.readBool();
    if (!nonzero) return '';
    const lzc = reader.readBits(5);
    const vb = 32 - lzc;
    const length = vb > 0 ? reader.readBits(vb) : 0;
    
    if (length === 0) return '';
    
    const charWidth = reader.readBits(4);
    const baseChar = reader.readBits(8);
    
    let str = '';
    for (let i = 0; i < length; i++) {
        const delta = charWidth > 0 ? reader.readBits(charWidth) : 0;
        str += String.fromCharCode(delta + baseChar);
    }
    return str;
}

// ============================================
// Test against real save file
// ============================================

test('Load real save file and verify resources readable', () => {
    const savePath = join(__dirname, '../../00_GX_STV_SaveGame_0001.sav');
    const fileData = readFileSync(savePath);
    const save = loadSave(fileData.buffer);
    
    if (!save.hashValid) {
        throw new Error('Save file hash invalid');
    }
    
    const resources = readResources(save.data);
    if (resources.length < 10) {
        throw new Error(`Expected at least 10 resources, got ${resources.length}`);
    }
    
    // Check for known resources
    const crew = resources.find(r => r.name === 'Crew');
    if (!crew) throw new Error('Crew resource not found');
    
    const energy = resources.find(r => r.name === 'Energy');
    if (!energy) throw new Error('Energy resource not found');
});

test('Verify encoding matches save file bits for existing resources', () => {
    const savePath = join(__dirname, '../../00_GX_STV_SaveGame_0001.sav');
    const fileData = readFileSync(savePath);
    const save = loadSave(fileData.buffer);
    const resources = readResources(save.data);
    
    // Test encoding of several resource quantities matches what we'd decode
    for (const res of resources.slice(0, 10)) {
        const encoded = encodeI32Packed(res.quantity);
        const buf = new Uint8Array(10);
        for (let i = 0; i < encoded.length; i++) {
            setBit(buf, i, encoded[i]);
        }
        
        // Decode and verify
        const reader = new BitReader(buf, 0);
        const nonzero = reader.readBool();
        if (!nonzero && res.quantity !== 0) {
            throw new Error(`Resource ${res.name} quantity ${res.quantity} encoded as zero`);
        }
        if (nonzero) {
            const sign = reader.readBool();
            const lzc = reader.readBits(5);
            const vb = 32 - lzc;
            const magnitude = vb > 0 ? reader.readBits(vb) : 0;
            const decoded = sign ? -magnitude : magnitude;
            assertEqual(decoded, res.quantity, `Quantity mismatch for ${res.name}`);
        }
    }
});

test('Verify string encoding matches save file for resource names', () => {
    const savePath = join(__dirname, '../../00_GX_STV_SaveGame_0001.sav');
    const fileData = readFileSync(savePath);
    const save = loadSave(fileData.buffer);
    const resources = readResources(save.data);
    
    // Test that our string encoding produces decodable results
    for (const res of resources.slice(0, 10)) {
        const stringBits = encodeString(res.name);
        // Prepend outer debug bit for readString(-1)
        const bits = [0, ...stringBits];
        
        const buf = new Uint8Array(Math.ceil(bits.length / 8) + 10);
        for (let i = 0; i < bits.length; i++) {
            setBit(buf, i, bits[i]);
        }
        
        const reader = new BitReader(buf, 0);
        // Use readString(-1) which handles the debug bit internally
        const decoded = reader.readString(-1);
        assertEqual(decoded, res.name, `String encoding mismatch for ${res.name}`);
    }
});

test('modifyResources produces valid save file', () => {
    const savePath = join(__dirname, '../../00_GX_STV_SaveGame_0001.sav');
    const fileData = readFileSync(savePath);
    const save = loadSave(fileData.buffer);
    
    const originalResources = readResources(save.data);
    const crewRes = originalResources.find(r => r.name === 'Crew');
    const originalCrew = crewRes.quantity;
    
    // Modify crew to a different value
    const newCrew = originalCrew + 10;
    const modified = modifyResources(save.data, { 'Crew': newCrew });
    
    // Verify the modification
    const modifiedResources = readResources(modified);
    const modifiedCrewRes = modifiedResources.find(r => r.name === 'Crew');
    assertEqual(modifiedCrewRes.quantity, newCrew, 'Crew modification failed');
    
    // Verify other resources unchanged
    for (const orig of originalResources) {
        if (orig.name === 'Crew') continue;
        const mod = modifiedResources.find(r => r.name === orig.name);
        if (!mod) throw new Error(`Resource ${orig.name} disappeared after modification`);
        assertEqual(mod.quantity, orig.quantity, `Resource ${orig.name} changed unexpectedly`);
    }
    
    // Verify CRC is valid
    const storedCrc = (modified[4] | (modified[5] << 8) | (modified[6] << 16) | (modified[7] << 24)) >>> 0;
    const calculatedCrc = customCrc(modified.slice(16));
    assertEqual(calculatedCrc, storedCrc, 'CRC mismatch after modification');
});

test('getResourceArrayPositions finds correct positions', () => {
    const savePath = join(__dirname, '../../00_GX_STV_SaveGame_0001.sav');
    const fileData = readFileSync(savePath);
    const save = loadSave(fileData.buffer);
    
    const positions = getResourceArrayPositions(save.data);
    
    if (positions.count < 10) {
        throw new Error(`Expected at least 10 resources, got ${positions.count}`);
    }
    
    if (positions.countPos < 1000 || positions.countPos > 3000) {
        throw new Error(`countPos ${positions.countPos} seems wrong`);
    }
    
    if (positions.arrayEndPos <= positions.countValuePos) {
        throw new Error(`arrayEndPos should be after countValuePos`);
    }
});

test('encodeResourceEntry produces valid entry', () => {
    // Encode a test resource
    const bits = encodeResourceEntry('Items.Item.ResearchPoints', 100, 1);
    
    // Should have: debug(1) + U32(1) + debug(33) + string + debug(1) + I32 + debug(1) + bool(1)
    // Minimum size check
    if (bits.length < 50) {
        throw new Error(`Resource entry too short: ${bits.length} bits`);
    }
    
    // Write to buffer and decode
    const buf = new Uint8Array(Math.ceil(bits.length / 8) + 10);
    for (let i = 0; i < bits.length; i++) {
        setBit(buf, i, bits[i]);
    }
    
    const reader = new BitReader(buf, 0);
    
    // Read index: debug(-1) + U32Packed
    reader.readBool(); // debug bit
    const index = reader.readBool() ? (reader.readBits(5), reader.readBits(32 - reader.readBits(5))) : 0;
    // Actually let's use the proper method
    const reader2 = new BitReader(buf, 0);
    const idx = reader2.readU32Packed(-1);
    assertEqual(idx, 1, 'Index should be 1');
    
    const name = reader2.readString(TAG_RINM);
    assertEqual(name, 'Items.Item.ResearchPoints', 'Name mismatch');
    
    const qty = reader2.readI32Packed(-1);
    assertEqual(qty, 100, 'Quantity mismatch');
    
    const flag = reader2.readBoolWrapped(-1);
    assertEqual(flag, 1, 'Flag should be 1');
});

test('addResources adds new item to save', () => {
    const savePath = join(__dirname, '../../00_GX_STV_SaveGame_0001.sav');
    const fileData = readFileSync(savePath);
    const save = loadSave(fileData.buffer);
    
    const originalResources = readResources(save.data);
    const originalCount = originalResources.length;
    
    // Find an item that's NOT in the save
    const testItemName = 'Items.Item.Test_AddResource_12345';
    const existingTest = originalResources.find(r => r.name === testItemName);
    if (existingTest) {
        throw new Error('Test item already exists in save');
    }
    
    // Add the new resource
    const additions = [{ name: testItemName, quantity: 42, flag: 1 }];
    const modified = addResources(save.data, additions);
    
    // Verify the addition
    const modifiedResources = readResources(modified);
    assertEqual(modifiedResources.length, originalCount + 1, 'Resource count should increase by 1');
    
    const addedRes = modifiedResources.find(r => r.name === testItemName);
    if (!addedRes) {
        throw new Error('Added resource not found');
    }
    assertEqual(addedRes.quantity, 42, 'Added resource quantity mismatch');
    assertEqual(addedRes.flag, 1, 'Added resource flag mismatch');
    
    // Verify other resources unchanged
    for (const orig of originalResources) {
        const mod = modifiedResources.find(r => r.name === orig.name);
        if (!mod) throw new Error(`Resource ${orig.name} disappeared after addition`);
        assertEqual(mod.quantity, orig.quantity, `Resource ${orig.name} changed unexpectedly`);
    }
    
    // Verify CRC is valid
    const storedCrc = (modified[4] | (modified[5] << 8) | (modified[6] << 16) | (modified[7] << 24)) >>> 0;
    const calculatedCrc = customCrc(modified.slice(16));
    assertEqual(calculatedCrc, storedCrc, 'CRC mismatch after addition');
});

// ============================================
// Run tests
// ============================================

console.log('\n=== STV Save Editor Unit Tests ===\n');

// Tests are already run by the test() calls above
// Just print summary

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);

if (failed > 0) {
    process.exit(1);
}
