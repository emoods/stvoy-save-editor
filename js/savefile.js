/**
 * Save file I/O for STV save files.
 * Handles Base64 encoding/decoding, header parsing, and CRC validation.
 */

import { customCrc } from './crc32.js';
import { BitReader } from './bitstream.js';

// Tag for creation time in daeh chunk
const TAG_MTRC = 0x6372746d;  // "mtrc" - creation time

/**
 * Load and decode a save file from Base64.
 * @param {ArrayBuffer} buffer - Raw file contents
 * @returns {Object} { data: Uint8Array, fileSize, hash, version, debugFlag, hashValid }
 */
export function loadSave(buffer) {
    // Convert to string and decode Base64
    const text = new TextDecoder('ascii').decode(buffer);
    const binaryString = atob(text);
    const data = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        data[i] = binaryString.charCodeAt(i);
    }
    
    // Parse header
    const view = new DataView(data.buffer);
    const fileSize = view.getUint32(0, true);
    const hash = view.getUint32(4, true);
    const version = view.getUint32(8, true);
    const debugFlag = view.getUint32(12, true);
    
    // Validate file size
    if (fileSize !== data.length) {
        throw new Error(`File size mismatch: header=${fileSize}, actual=${data.length}`);
    }
    
    // Validate hash
    const computed = customCrc(data.subarray(16));
    const hashValid = computed === hash;
    
    return {
        data,
        fileSize,
        hash,
        version,
        debugFlag,
        hashValid
    };
}

/**
 * Save data to a downloadable file.
 * Recomputes CRC and Base64 encodes.
 * @param {Uint8Array} data - Modified save data
 * @returns {string} Blob URL for download
 */
export function saveToBlobUrl(data) {
    // Make a copy to avoid modifying the original
    const output = new Uint8Array(data);
    
    // Recompute hash over data after header (byte 16 onwards)
    const newHash = customCrc(output.subarray(16));
    
    // Write hash to bytes 4-7
    output[4] = newHash & 0xFF;
    output[5] = (newHash >> 8) & 0xFF;
    output[6] = (newHash >> 16) & 0xFF;
    output[7] = (newHash >> 24) & 0xFF;
    
    // Base64 encode
    let binaryString = '';
    for (let i = 0; i < output.length; i++) {
        binaryString += String.fromCharCode(output[i]);
    }
    const encoded = btoa(binaryString);
    
    // Create blob URL
    const blob = new Blob([encoded], { type: 'application/octet-stream' });
    return URL.createObjectURL(blob);
}

/**
 * Update file size in header.
 * @param {Uint8Array} data
 */
export function updateFileSize(data) {
    const view = new DataView(data.buffer);
    view.setUint32(0, data.length, true);
}

/**
 * Update CRC hash in header.
 * @param {Uint8Array} data
 */
export function updateCrc(data) {
    const newHash = customCrc(data.subarray(16));
    data[4] = newHash & 0xFF;
    data[5] = (newHash >> 8) & 0xFF;
    data[6] = (newHash >> 16) & 0xFF;
    data[7] = (newHash >> 24) & 0xFF;
}

/**
 * Get the save timestamp from the daeh (head) chunk.
 * The timestamp is stored as FDateTime (64-bit ticks since 0001-01-01).
 * @param {Uint8Array} data - Decoded save data
 * @returns {Date|null} JavaScript Date object, or null if not found
 */
export function getSaveTimestamp(data) {
    try {
        const r = new BitReader(data, 128);
        
        // Navigate to daeh chunk
        r.readChunkHeader();  // parw
        const daeh = r.readChunkHeader();  // daeh
        
        // Read daeh fields: forp, tols, then mtrc
        const daehReader = new BitReader(data, daeh.dataStart);
        daehReader.readI32Packed(0x70726f66);  // forp (profile)
        daehReader.readI32Packed(0x736c6f74);  // tols (slot)
        
        // mtrc is 64-bit FDateTime (two U32Packed values)
        const lo = daehReader.readU32Packed(TAG_MTRC);
        const hi = daehReader.readU32Packed(-1);
        
        const ticks = BigInt(lo) | (BigInt(hi) << 32n);
        
        // Convert FDateTime ticks to JavaScript Date
        // FDateTime = ticks since 0001-01-01 (100ns per tick)
        // Difference from Unix epoch (1970-01-01): 621355968000000000 ticks
        const unixMs = Number((ticks - 621355968000000000n) / 10000n);
        
        return new Date(unixMs);
    } catch (e) {
        console.warn('Failed to read save timestamp:', e);
        return null;
    }
}
