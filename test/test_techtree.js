/**
 * Test tech tree read/write functionality.
 */

import * as fs from 'fs';
import { readTechUnlocks, addTechUnlocks, removeTechUnlocks, modifyTechUnlocks } from '../js/techtree.js';
import { loadSave } from '../js/savefile.js';

const savePath = '/Users/philipprueger/Source/VoyagerSavegames/latest_save.sav';

// Load the save
const raw = fs.readFileSync(savePath);
const save = loadSave(raw.buffer);
const data = save.data;

console.log('=== Tech Tree Read/Write Test ===\n');

// Test 1: Read techs
console.log('Test 1: Reading tech unlocks...');
const techData = readTechUnlocks(data);
console.log(`  Found ${techData.count} techs`);
console.log(`  First 5: ${techData.techs.slice(0, 5).join(', ')}`);
console.log('  PASS\n');

// Test 2: Add a tech
console.log('Test 2: Adding a tech...');
const newTech = 'Tech.Engineering.Tiers.5';  // A tier that likely doesn't exist
if (techData.techs.includes(newTech)) {
    console.log(`  Skipping - ${newTech} already exists in save`);
} else {
    const dataWithAdd = addTechUnlocks(data, [newTech]);
    const afterAdd = readTechUnlocks(dataWithAdd);
    
    if (afterAdd.count === techData.count + 1 && afterAdd.techs.includes(newTech)) {
        console.log(`  Added ${newTech}`);
        console.log(`  Count: ${techData.count} -> ${afterAdd.count}`);
        console.log('  PASS\n');
    } else {
        console.log('  FAIL: Tech not added correctly');
        console.log(`  Count: ${techData.count} -> ${afterAdd.count}`);
        process.exit(1);
    }
}

// Test 3: Remove a tech
console.log('Test 3: Removing a tech...');
const techToRemove = techData.techs[0];  // Remove the first tech
const dataWithRemove = removeTechUnlocks(data, [techToRemove]);
const afterRemove = readTechUnlocks(dataWithRemove);

if (afterRemove.count === techData.count - 1 && !afterRemove.techs.includes(techToRemove)) {
    console.log(`  Removed ${techToRemove}`);
    console.log(`  Count: ${techData.count} -> ${afterRemove.count}`);
    console.log('  PASS\n');
} else {
    console.log('  FAIL: Tech not removed correctly');
    console.log(`  Expected count: ${techData.count - 1}, got: ${afterRemove.count}`);
    console.log(`  Tech still present: ${afterRemove.techs.includes(techToRemove)}`);
    process.exit(1);
}

// Test 4: Add and remove in one operation
console.log('Test 4: Add and remove combined...');
const techToAdd = 'Tech.Science.Tier.5';
const techToRemove2 = techData.techs[1];

if (!techData.techs.includes(techToAdd)) {
    const dataCombined = modifyTechUnlocks(data, [techToAdd], [techToRemove2]);
    const afterCombined = readTechUnlocks(dataCombined);
    
    const addedOk = afterCombined.techs.includes(techToAdd);
    const removedOk = !afterCombined.techs.includes(techToRemove2);
    const countOk = afterCombined.count === techData.count;  // +1 -1 = same count
    
    if (addedOk && removedOk && countOk) {
        console.log(`  Added: ${techToAdd}`);
        console.log(`  Removed: ${techToRemove2}`);
        console.log(`  Count unchanged: ${afterCombined.count}`);
        console.log('  PASS\n');
    } else {
        console.log('  FAIL');
        console.log(`  Added ok: ${addedOk}, Removed ok: ${removedOk}, Count ok: ${countOk}`);
        process.exit(1);
    }
} else {
    console.log(`  Skipping - ${techToAdd} already in save`);
}

// Test 5: Verify CRC is valid after modifications (round-trip test)
console.log('Test 5: Verify CRC after modifications...');
const dataModified = addTechUnlocks(data, ['Tech.Combat.Tier.5']);

// To test round-trip, we need to base64 encode the modified data first
// since loadSave expects raw file bytes (base64 encoded)
let binaryString = '';
for (let i = 0; i < dataModified.length; i++) {
    binaryString += String.fromCharCode(dataModified[i]);
}
const base64Encoded = Buffer.from(binaryString, 'binary').toString('base64');
const encodedBuffer = Buffer.from(base64Encoded, 'ascii');

const reloaded = loadSave(encodedBuffer.buffer);
if (reloaded.hashValid) {
    console.log('  CRC hash is valid after modification');
    // Also verify the tech was added
    const reloadedTechs = readTechUnlocks(reloaded.data);
    if (reloadedTechs.techs.includes('Tech.Combat.Tier.5')) {
        console.log('  Added tech persists after round-trip');
        console.log('  PASS\n');
    } else {
        console.log('  FAIL: Added tech not found after round-trip');
        process.exit(1);
    }
} else {
    console.log('  FAIL: CRC hash invalid after modification');
    process.exit(1);
}

// Test 6: Full round-trip - add multiple techs, then verify all data is still accessible
console.log('Test 6: Full round-trip with multiple tech additions...');
const multiTechs = [
    'Tech.Engineering.Hull.Armor1',
    'Tech.Science.Lab.Analysis1',
    'Tech.Combat.Weapons.Phaser1'
];
// Filter out any that already exist
const techsToAdd = multiTechs.filter(t => !techData.techs.includes(t));
if (techsToAdd.length > 0) {
    const dataMulti = addTechUnlocks(data, techsToAdd);
    
    // Re-encode as base64 and reload
    let binStr = '';
    for (let i = 0; i < dataMulti.length; i++) {
        binStr += String.fromCharCode(dataMulti[i]);
    }
    const b64Multi = Buffer.from(binStr, 'binary').toString('base64');
    const reloadedMulti = loadSave(Buffer.from(b64Multi, 'ascii').buffer);
    
    if (!reloadedMulti.hashValid) {
        console.log('  FAIL: CRC invalid after adding multiple techs');
        process.exit(1);
    }
    
    // Verify all added techs are present
    const afterMulti = readTechUnlocks(reloadedMulti.data);
    const allAdded = techsToAdd.every(t => afterMulti.techs.includes(t));
    if (allAdded && afterMulti.count === techData.count + techsToAdd.length) {
        console.log(`  Added ${techsToAdd.length} techs successfully`);
        console.log('  CRC valid after round-trip');
        console.log('  PASS\n');
    } else {
        console.log('  FAIL: Not all techs were added correctly');
        process.exit(1);
    }
} else {
    console.log('  Skipping - all test techs already in save');
}

// Test 7: Verify resources are still readable after tech modifications
console.log('Test 7: Resources still accessible after tech modifications...');
import { readResources } from '../js/resources.js';
const dataModified2 = addTechUnlocks(data, ['Tech.Test.Verification']);
try {
    const resourcesAfter = readResources(dataModified2);
    if (resourcesAfter.length > 0) {
        console.log(`  Found ${resourcesAfter.length} resources after tech modification`);
        console.log(`  Sample: ${resourcesAfter[0].name} = ${resourcesAfter[0].quantity}`);
        console.log('  PASS\n');
    } else {
        console.log('  FAIL: No resources found');
        process.exit(1);
    }
} catch (e) {
    console.log(`  FAIL: Error reading resources: ${e.message}`);
    process.exit(1);
}

// Test 8: Verify hull integrity is still readable after tech modifications
console.log('Test 8: Hull integrity still accessible after tech modifications...');
import { readHullIntegrity } from '../js/resources.js';
try {
    const hullAfter = readHullIntegrity(dataModified2);
    if (typeof hullAfter.value === 'number' && !isNaN(hullAfter.value)) {
        console.log(`  Hull integrity: ${hullAfter.value}`);
        console.log('  PASS\n');
    } else {
        console.log('  FAIL: Hull integrity not a valid number');
        process.exit(1);
    }
} catch (e) {
    console.log(`  FAIL: Error reading hull: ${e.message}`);
    process.exit(1);
}

// Test 9: Remove multiple techs and verify round-trip
console.log('Test 9: Remove multiple techs round-trip...');
const techsToRemoveMulti = techData.techs.slice(0, 3);  // Remove first 3 techs
const dataRemoveMulti = removeTechUnlocks(data, techsToRemoveMulti);

// Re-encode and reload
let binStr2 = '';
for (let i = 0; i < dataRemoveMulti.length; i++) {
    binStr2 += String.fromCharCode(dataRemoveMulti[i]);
}
const b64Remove = Buffer.from(binStr2, 'binary').toString('base64');
const reloadedRemove = loadSave(Buffer.from(b64Remove, 'ascii').buffer);

if (!reloadedRemove.hashValid) {
    console.log('  FAIL: CRC invalid after removing multiple techs');
    process.exit(1);
}

const afterRemoveMulti = readTechUnlocks(reloadedRemove.data);
const allRemoved = techsToRemoveMulti.every(t => !afterRemoveMulti.techs.includes(t));
if (allRemoved && afterRemoveMulti.count === techData.count - techsToRemoveMulti.length) {
    console.log(`  Removed ${techsToRemoveMulti.length} techs successfully`);
    console.log('  CRC valid after round-trip');
    console.log('  PASS\n');
} else {
    console.log('  FAIL: Not all techs were removed correctly');
    process.exit(1);
}

// Test 10: Complex scenario - add and remove techs, then modify resources
console.log('Test 10: Complex scenario - combined tech + resource modifications...');
import { modifyResources } from '../js/resources.js';

// Start fresh
let complexData = new Uint8Array(data);

// Add some techs
const addList = ['Tech.Complex.Test1', 'Tech.Complex.Test2'].filter(t => !techData.techs.includes(t));
if (addList.length > 0) {
    complexData = addTechUnlocks(complexData, addList);
}

// Remove some techs
const removeList = [techData.techs[techData.techs.length - 1]];  // Remove last tech
complexData = removeTechUnlocks(complexData, removeList);

// Modify a resource
const resources = readResources(complexData);
if (resources.length > 0) {
    const testResource = resources.find(r => r.name === 'Dilithium') || resources[0];
    complexData = modifyResources(complexData, { [testResource.name]: testResource.quantity + 100 });
}

// Re-encode and reload
let binStr3 = '';
for (let i = 0; i < complexData.length; i++) {
    binStr3 += String.fromCharCode(complexData[i]);
}
const b64Complex = Buffer.from(binStr3, 'binary').toString('base64');
const reloadedComplex = loadSave(Buffer.from(b64Complex, 'ascii').buffer);

if (!reloadedComplex.hashValid) {
    console.log('  FAIL: CRC invalid after complex modifications');
    process.exit(1);
}

// Verify everything is accessible
try {
    const techsComplex = readTechUnlocks(reloadedComplex.data);
    const resourcesComplex = readResources(reloadedComplex.data);
    const hullComplex = readHullIntegrity(reloadedComplex.data);
    
    console.log(`  Techs: ${techsComplex.count}`);
    console.log(`  Resources: ${resourcesComplex.length}`);
    console.log(`  Hull: ${hullComplex.value}`);
    console.log('  All data accessible after complex modifications');
    console.log('  PASS\n');
} catch (e) {
    console.log(`  FAIL: Error accessing data after complex modifications: ${e.message}`);
    process.exit(1);
}

console.log('=== All tests passed! ===');
