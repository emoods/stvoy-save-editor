/**
 * CRC32 with custom initial value for STV save files.
 * Uses standard CRC32 polynomial but with init value 0x61635263.
 */

// Build CRC32 lookup table (standard polynomial 0xEDB88320)
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
        if (crc & 1) {
            crc = (crc >>> 1) ^ 0xEDB88320;
        } else {
            crc >>>= 1;
        }
    }
    CRC_TABLE[i] = crc >>> 0;
}

/**
 * Compute CRC32 with custom initial value.
 * @param {Uint8Array} data - Data to hash
 * @param {number} init - Initial CRC value (default: 0x61635263)
 * @returns {number} CRC32 hash
 */
export function customCrc(data, init = 0x61635263) {
    let crc = init >>> 0;
    for (let i = 0; i < data.length; i++) {
        crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ data[i]) & 0xFF];
    }
    return crc >>> 0;
}
