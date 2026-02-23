/**
 * Resource reading and modification for STV save files.
 */

import { BitReader, getBit, setBit, readBitsAt, writeBits } from './bitstream.js';
import { encodeI32Packed, encodeResourceEntry } from './packed.js';
import { navigateToCser, navigateToTsnc, findShctPosition, getChunkSizePositions, getResourceArrayPositions, TAG_RICT, TAG_RINM } from './chunks.js';
import { updateFileSize, updateCrc } from './savefile.js';

/**
 * Read all resources from the save file.
 * @param {Uint8Array} data
 * @returns {Object[]} Array of resource objects
 */
export function readResources(data) {
    const { reader: r } = navigateToCser(data);
    const count = r.readI32Packed(TAG_RICT);
    const resources = [];
    
    for (let i = 0; i < count; i++) {
        const idx = r.readU32Packed(-1);
        const name = r.readString(TAG_RINM);
        const qtyPos = r.pos;  // bit position of the quantity value
        const qty = r.readI32Packed(-1);
        const flag = r.readBoolWrapped(-1);
        
        resources.push({
            index: idx,
            name: name,
            quantity: qty,
            quantityBitPos: qtyPos,
            flag: flag,  // 0 = base resource, 1 = item
        });
    }
    
    return resources;
}

/**
 * Read hull integrity from the save file.
 * @param {Uint8Array} data
 * @returns {Object} { value: number, bitPos: number }
 */
export function readHullIntegrity(data) {
    const { chunk: tsnc } = navigateToTsnc(data);
    const afterShct = findShctPosition(data, tsnc);
    
    if (afterShct === null) {
        throw new Error('Could not find shct tag in tsnc chunk');
    }
    
    const hullPos = afterShct + 8;
    const raw = readBitsAt(data, hullPos, 32);
    
    // Convert to float
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, raw, true);
    const value = view.getFloat32(0, true);
    
    return { value, bitPos: hullPos };
}

/**
 * Set hull integrity (simple in-place 32-bit replacement).
 * @param {Uint8Array} data
 * @param {number} newValue
 * @returns {Object} { oldValue, newValue, bitPos }
 */
export function setHullIntegrity(data, newValue) {
    const { value: oldValue, bitPos } = readHullIntegrity(data);
    
    // Convert float to raw uint32
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, newValue, true);
    const newRaw = view.getUint32(0, true);
    
    // Write in place
    writeBits(data, bitPos, newRaw, 32);
    
    return { oldValue, newValue, bitPos };
}

/**
 * Modify resource quantities with bit-stream reconstruction.
 * @param {Uint8Array} data
 * @param {Object} modifications - { resourceName: newValue, ... }
 * @returns {Uint8Array} Modified data
 */
export function modifyResources(data, modifications) {
    const resources = readResources(data);
    const sizePositions = getChunkSizePositions(data);
    
    // Build list of patches
    const patches = [];
    for (const res of resources) {
        if (res.name in modifications) {
            const newVal = modifications[res.name];
            const oldVal = res.quantity;
            const oldBits = encodeI32Packed(oldVal);
            const newBits = encodeI32Packed(newVal);
            
            // The quantity is preceded by DebugIdCheck(-1) = 1 bit
            patches.push({
                pos: res.quantityBitPos + 1,  // skip debug bit
                oldLen: oldBits.length,
                newBits: newBits,
                name: res.name,
                oldVal: oldVal,
                newVal: newVal,
            });
        }
    }
    
    if (patches.length === 0) {
        return data;
    }
    
    // Sort by position
    patches.sort((a, b) => a.pos - b.pos);
    
    // Compute total bit delta
    const totalDelta = patches.reduce((sum, p) => sum + (p.newBits.length - p.oldLen), 0);
    
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
    
    for (const patch of patches) {
        // Copy bits before this patch
        dstPos = copyBits(srcPos, patch.pos, dstPos);
        srcPos = patch.pos;
        
        // Write new encoded value
        for (let i = 0; i < patch.newBits.length; i++) {
            setBit(newData, dstPos + i, patch.newBits[i]);
        }
        dstPos += patch.newBits.length;
        srcPos += patch.oldLen;
    }
    
    // Copy remaining bits
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

// Re-export from itemdb.js for backward compatibility
export { 
    BASE_RESOURCES, 
    STACKABLE_ITEMS as ITEM_RESOURCES,
    isStackableItem,
    isStackableName,
    getDisplayName,
    getAddableItems,
    getAllItemNames,
} from './itemdb.js';

/**
 * Add new resources to the save file that don't currently exist.
 * This inserts new entries at the end of the resource array and updates the count.
 * 
 * @param {Uint8Array} data - Original save file data
 * @param {Object[]} additions - Array of { name, quantity, flag } objects
 * @returns {Uint8Array} Modified data with new resources added
 */
export function addResources(data, additions) {
    if (!additions || additions.length === 0) {
        return data;
    }
    
    const positions = getResourceArrayPositions(data);
    const sizePositions = getChunkSizePositions(data);
    
    // Encode all new resource entries
    const allNewBits = [];
    for (const add of additions) {
        const entryBits = encodeResourceEntry(add.name, add.quantity, add.flag);
        allNewBits.push(...entryBits);
    }
    
    // Calculate new count
    const oldCount = positions.count;
    const newCount = oldCount + additions.length;
    
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
    
    // 1. Copy everything up to the count value (including debug prefix)
    dstPos = copyBits(srcPos, positions.countValuePos, dstPos);
    srcPos = positions.countValuePos;
    
    // 2. Write new count value
    for (let i = 0; i < newCountBits.length; i++) {
        setBit(newData, dstPos + i, newCountBits[i]);
    }
    dstPos += newCountBits.length;
    srcPos += oldCountBits.length;
    
    // 3. Copy everything from after old count to end of resource array
    dstPos = copyBits(srcPos, positions.arrayEndPos, dstPos);
    srcPos = positions.arrayEndPos;
    
    // 4. Insert new resource entries
    for (let i = 0; i < allNewBits.length; i++) {
        setBit(newData, dstPos + i, allNewBits[i]);
    }
    dstPos += allNewBits.length;
    
    // 5. Copy remaining bits (rrqc and everything after)
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
