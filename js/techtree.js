/**
 * Tech tree (abilities) reading and modification for STV save files.
 * The tlba chunk stores unlocked tech tree entries as a simple list of strings.
 */

import { BitReader, getBit, setBit, readBitsAt, writeBits } from './bitstream.js';
import { encodeI32Packed, encodeString } from './packed.js';
import { navigateToTlba, getTlbaChunkSizePositions, getTlbaArrayPositions } from './chunks.js';
import { updateFileSize, updateCrc } from './savefile.js';

/**
 * Read all unlocked tech entries from the save file.
 * @param {Uint8Array} data
 * @returns {Object} { count, techs: string[] }
 */
export function readTechUnlocks(data) {
    const { reader: r, chunk: tlba } = navigateToTlba(data);
    
    // Read count (I32Packed with no tag)
    const count = r.readI32Packed(-1);
    
    // Read all tech strings
    const techs = [];
    for (let i = 0; i < count; i++) {
        const tech = r.readString(-1);
        techs.push(tech);
    }
    
    return { count, techs };
}

/**
 * Add new tech entries to the save file.
 * This appends new entries at the end of the tech array and updates the count.
 * 
 * @param {Uint8Array} data - Original save file data
 * @param {string[]} newTechs - Array of tech path strings to add
 * @returns {Uint8Array} Modified data with new techs added
 */
export function addTechUnlocks(data, newTechs) {
    if (!newTechs || newTechs.length === 0) {
        return data;
    }
    
    const positions = getTlbaArrayPositions(data);
    const sizePositions = getTlbaChunkSizePositions(data);
    
    // Encode all new tech entries (each is: debug_bit(0) + string)
    const allNewBits = [];
    for (const tech of newTechs) {
        // Debug prefix for readString(-1): 1 bit (0 = no tag)
        allNewBits.push(0);
        // Encoded string content
        allNewBits.push(...encodeString(tech));
    }
    
    // Calculate new count
    const oldCount = positions.count;
    const newCount = oldCount + newTechs.length;
    
    // Encode old and new counts
    const oldCountBits = encodeI32Packed(oldCount);
    const newCountBits = encodeI32Packed(newCount);
    const countDelta = newCountBits.length - oldCountBits.length;
    
    // Total bit delta = new entries + count size change
    const totalDelta = allNewBits.length + countDelta;
    
    // Rebuild bit stream
    const totalBits = data.length * 8;
    const newTotalBits = totalBits + totalDelta;
    const newData = new Uint8Array(Math.ceil(newTotalBits / 8));
    
    let srcPos = 0;
    let dstPos = 0;
    
    function copyBits(srcStart, srcEnd, dstStart) {
        for (let i = 0; i < srcEnd - srcStart; i++) {
            const bit = getBit(data, srcStart + i);
            setBit(newData, dstStart + i, bit);
        }
        return dstStart + (srcEnd - srcStart);
    }
    
    // 1. Copy everything up to the count value (including debug prefix bit)
    dstPos = copyBits(srcPos, positions.countPos, dstPos);
    srcPos = positions.countPos;
    
    // 2. Write new count value
    for (let i = 0; i < newCountBits.length; i++) {
        setBit(newData, dstPos + i, newCountBits[i]);
    }
    dstPos += newCountBits.length;
    srcPos += oldCountBits.length;
    
    // 3. Copy everything from after old count to end of tech array
    dstPos = copyBits(srcPos, positions.arrayEndPos, dstPos);
    srcPos = positions.arrayEndPos;
    
    // 4. Insert new tech entries
    for (let i = 0; i < allNewBits.length; i++) {
        setBit(newData, dstPos + i, allNewBits[i]);
    }
    dstPos += allNewBits.length;
    
    // 5. Copy remaining bits (everything after tlba tech array)
    copyBits(srcPos, totalBits, dstPos);
    
    // Update chunk size fields
    for (const sizePos of sizePositions) {
        const oldSize = readBitsAt(data, sizePos, 32);
        const newSize = oldSize + totalDelta;
        writeBits(newData, sizePos, newSize, 32);
    }
    
    // Update file_size
    updateFileSize(newData);
    
    // Update CRC hash
    updateCrc(newData);
    
    return newData;
}

/**
 * Remove tech entries from the save file.
 * This removes specified entries and updates the count.
 * 
 * @param {Uint8Array} data - Original save file data
 * @param {string[]} techsToRemove - Array of tech path strings to remove
 * @returns {Uint8Array} Modified data with techs removed
 */
export function removeTechUnlocks(data, techsToRemove) {
    if (!techsToRemove || techsToRemove.length === 0) {
        return data;
    }
    
    const removeSet = new Set(techsToRemove);
    const positions = getTlbaArrayPositions(data);
    const sizePositions = getTlbaChunkSizePositions(data);
    
    // Find which techs to keep and which to remove
    const techsToKeep = positions.techs.filter(t => !removeSet.has(t.name));
    const removedCount = positions.count - techsToKeep.length;
    
    if (removedCount === 0) {
        return data;  // Nothing to remove
    }
    
    // Calculate bit ranges to remove
    const rangesToRemove = positions.techs
        .filter(t => removeSet.has(t.name))
        .map(t => ({ start: t.startPos, end: t.endPos }));
    
    // Sort by start position
    rangesToRemove.sort((a, b) => a.start - b.start);
    
    // Calculate new count
    const oldCount = positions.count;
    const newCount = oldCount - removedCount;
    
    // Encode old and new counts
    const oldCountBits = encodeI32Packed(oldCount);
    const newCountBits = encodeI32Packed(newCount);
    const countDelta = newCountBits.length - oldCountBits.length;
    
    // Calculate total bits removed
    let bitsRemoved = 0;
    for (const range of rangesToRemove) {
        // Each tech entry includes debug prefix (1 bit) before the string
        // The startPos already includes where that debug bit starts
        bitsRemoved += (range.end - range.start);
    }
    
    // Total bit delta = count change - removed entries
    const totalDelta = countDelta - bitsRemoved;
    
    // Rebuild bit stream
    const totalBits = data.length * 8;
    const newTotalBits = totalBits + totalDelta;
    const newData = new Uint8Array(Math.ceil(newTotalBits / 8));
    
    let srcPos = 0;
    let dstPos = 0;
    
    function copyBits(srcStart, srcEnd, dstStart) {
        for (let i = 0; i < srcEnd - srcStart; i++) {
            const bit = getBit(data, srcStart + i);
            setBit(newData, dstStart + i, bit);
        }
        return dstStart + (srcEnd - srcStart);
    }
    
    // 1. Copy everything up to the count value
    dstPos = copyBits(srcPos, positions.countPos, dstPos);
    srcPos = positions.countPos;
    
    // 2. Write new count value
    for (let i = 0; i < newCountBits.length; i++) {
        setBit(newData, dstPos + i, newCountBits[i]);
    }
    dstPos += newCountBits.length;
    srcPos += oldCountBits.length;
    
    // 3. Copy tech entries, skipping removed ones
    for (const tech of positions.techs) {
        if (removeSet.has(tech.name)) {
            // Skip this entry - just advance srcPos
            srcPos = tech.endPos;
        } else {
            // Copy this entry
            dstPos = copyBits(srcPos, tech.endPos, dstPos);
            srcPos = tech.endPos;
        }
    }
    
    // 4. Copy remaining bits (everything after tlba tech array)
    copyBits(srcPos, totalBits, dstPos);
    
    // Update chunk size fields
    for (const sizePos of sizePositions) {
        const oldSize = readBitsAt(data, sizePos, 32);
        const newSize = oldSize + totalDelta;
        writeBits(newData, sizePos, newSize, 32);
    }
    
    // Update file_size
    updateFileSize(newData);
    
    // Update CRC hash
    updateCrc(newData);
    
    return newData;
}

/**
 * Modify tech unlocks - add new ones and remove old ones in a single pass.
 * More efficient than calling add and remove separately.
 * 
 * @param {Uint8Array} data - Original save file data
 * @param {string[]} techsToAdd - Array of tech path strings to add
 * @param {string[]} techsToRemove - Array of tech path strings to remove
 * @returns {Uint8Array} Modified data
 */
export function modifyTechUnlocks(data, techsToAdd = [], techsToRemove = []) {
    // First remove, then add (simpler than doing both at once)
    let modifiedData = data;
    
    if (techsToRemove.length > 0) {
        modifiedData = removeTechUnlocks(modifiedData, techsToRemove);
    }
    
    if (techsToAdd.length > 0) {
        modifiedData = addTechUnlocks(modifiedData, techsToAdd);
    }
    
    return modifiedData;
}
