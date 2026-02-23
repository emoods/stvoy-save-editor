/**
 * Packed integer encoding for STV save files.
 * Encodes signed and unsigned 32-bit values using variable-length bit packing.
 */

/**
 * Encode a signed 32-bit value as I32Packed bits (no debug prefix).
 * @param {number} value
 * @returns {number[]} Array of bits (0 or 1)
 */
export function encodeI32Packed(value) {
    const bits = [];
    
    if (value === 0) {
        bits.push(0);  // nonzero = 0
        return bits;
    }
    
    bits.push(1);  // nonzero = 1
    bits.push(value < 0 ? 1 : 0);  // sign
    
    const magnitude = Math.abs(value);
    
    // Count leading zeros
    let lzc = 0;
    for (let b = 31; b >= 0; b--) {
        if (magnitude & (1 << b)) {
            break;
        }
        lzc++;
    }
    
    // Write 5-bit lzc
    for (let i = 0; i < 5; i++) {
        bits.push((lzc >> i) & 1);
    }
    
    // Write value bits
    const vb = 32 - lzc;
    for (let i = 0; i < vb; i++) {
        bits.push((magnitude >> i) & 1);
    }
    
    return bits;
}

/**
 * Encode an unsigned 32-bit value as U32Packed bits (no debug prefix).
 * @param {number} value
 * @returns {number[]} Array of bits (0 or 1)
 */
export function encodeU32Packed(value) {
    const bits = [];
    
    if (value === 0) {
        bits.push(0);  // nonzero = 0
        return bits;
    }
    
    bits.push(1);  // nonzero = 1
    
    // Count leading zeros
    let lzc = 0;
    for (let b = 31; b >= 0; b--) {
        if (value & (1 << b)) {
            break;
        }
        lzc++;
    }
    
    // Write 5-bit lzc
    for (let i = 0; i < 5; i++) {
        bits.push((lzc >> i) & 1);
    }
    
    // Write value bits
    const vb = 32 - lzc;
    for (let i = 0; i < vb; i++) {
        bits.push((value >> i) & 1);
    }
    
    return bits;
}

/**
 * Encode a string using the game's compressed string format.
 * Format: debug_bit(0) + U32Packed(length) + 4-bit char_width + 8-bit base_char + (char_width * length) bits
 * 
 * IMPORTANT: This does NOT include the outer debug prefix for the string itself.
 * The caller must add that prefix before calling encodeString:
 *   - For readString(-1): caller adds 1 debug bit (0) before encodeString
 *   - For readString(TAG): caller adds 1 debug bit (1) + 32-bit tag before encodeString
 * 
 * This function only includes the debug bit for the internal readU32Packed(-1) call
 * that reads the string length.
 * 
 * @param {string} str - The string to encode
 * @returns {number[]} Array of bits (0 or 1)
 */
export function encodeString(str) {
    const bits = [];
    
    // Debug bit for the length (readU32Packed's internal debugSkip(-1))
    bits.push(0);
    
    // Encode length as U32Packed (without debug, since we added it above)
    bits.push(...encodeU32PackedRaw(str.length));
    
    if (str.length === 0) {
        return bits;
    }
    
    // Find min and max character codes to determine base_char and char_width
    let minCode = 255;
    let maxCode = 0;
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code < minCode) minCode = code;
        if (code > maxCode) maxCode = code;
    }
    
    const baseChar = minCode;
    const range = maxCode - minCode;
    
    // Calculate minimum bits needed for the range
    let charWidth = 0;
    if (range > 0) {
        charWidth = Math.ceil(Math.log2(range + 1));
    }
    // charWidth must fit in 4 bits (0-15)
    if (charWidth > 15) charWidth = 15;
    
    // Write char_width (4 bits)
    for (let i = 0; i < 4; i++) {
        bits.push((charWidth >> i) & 1);
    }
    
    // Write base_char (8 bits)
    for (let i = 0; i < 8; i++) {
        bits.push((baseChar >> i) & 1);
    }
    
    // Write each character as (charCode - baseChar) in charWidth bits
    for (let i = 0; i < str.length; i++) {
        const delta = str.charCodeAt(i) - baseChar;
        for (let b = 0; b < charWidth; b++) {
            bits.push((delta >> b) & 1);
        }
    }
    
    return bits;
}

/**
 * Encode U32Packed WITHOUT debug prefix (raw value only).
 * Used internally by encodeString.
 * @param {number} value
 * @returns {number[]} Array of bits
 */
function encodeU32PackedRaw(value) {
    const bits = [];
    
    if (value === 0) {
        bits.push(0);  // nonzero = 0
        return bits;
    }
    
    bits.push(1);  // nonzero = 1
    
    // Count leading zeros
    let lzc = 0;
    for (let b = 31; b >= 0; b--) {
        if (value & (1 << b)) {
            break;
        }
        lzc++;
    }
    
    // Write 5-bit lzc
    for (let i = 0; i < 5; i++) {
        bits.push((lzc >> i) & 1);
    }
    
    // Write value bits
    const vb = 32 - lzc;
    for (let i = 0; i < vb; i++) {
        bits.push((value >> i) & 1);
    }
    
    return bits;
}

/**
 * Encode a 32-bit tag value (FourCC) as 32 bits, LSB first.
 * @param {string} tag - 4-character tag string
 * @returns {number[]} Array of 32 bits
 */
export function encodeTag(tag) {
    const bits = [];
    const val = tag.charCodeAt(0) |
                (tag.charCodeAt(1) << 8) |
                (tag.charCodeAt(2) << 16) |
                (tag.charCodeAt(3) << 24);
    
    for (let i = 0; i < 32; i++) {
        bits.push((val >> i) & 1);
    }
    return bits;
}

/**
 * Encode debug prefix (1 bit, optionally followed by 32-bit tag).
 * @param {number|null} tag - Tag value as uint32, or null for no tag
 * @returns {number[]} Array of bits
 */
export function encodeDebugPrefix(tag) {
    const bits = [];
    if (tag === null || tag === -1) {
        bits.push(0);  // no tag
    } else {
        bits.push(1);  // has tag
        for (let i = 0; i < 32; i++) {
            bits.push((tag >> i) & 1);
        }
    }
    return bits;
}

/**
 * Encode a complete resource entry for insertion into the save file.
 * Format: 
 *   - Debug(0) + U32Packed(1)   [index, always 1]
 *   - Debug(1) + TAG_RINM + String(name)
 *   - Debug(0) + I32Packed(quantity)
 *   - Debug(0) + Bool(flag)     [1 for items]
 * 
 * @param {string} name - Resource name (e.g., "Items.Item.ResearchPoints")
 * @param {number} quantity - Resource quantity
 * @param {number} flag - 0 for base resources, 1 for items
 * @returns {number[]} Array of bits
 */
export function encodeResourceEntry(name, quantity, flag) {
    const TAG_RINM = 0x6d6e6972;  // "rinm" as uint32
    const bits = [];
    
    // 1. Index: Debug(-1) + U32Packed(1)
    bits.push(0);  // debug bit (no tag)
    bits.push(...encodeU32Packed(1));
    
    // 2. Name: Debug(TAG_RINM) + String
    bits.push(1);  // debug bit (has tag)
    for (let i = 0; i < 32; i++) {
        bits.push((TAG_RINM >> i) & 1);
    }
    bits.push(...encodeString(name));
    
    // 3. Quantity: Debug(-1) + I32Packed
    bits.push(0);  // debug bit (no tag)
    bits.push(...encodeI32Packed(quantity));
    
    // 4. Flag: Debug(-1) + Bool
    bits.push(0);  // debug bit (no tag)
    bits.push(flag);  // 0 = base resource, 1 = item
    
    return bits;
}
