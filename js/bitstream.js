/**
 * Bit-stream reader and writer for STV save files.
 * Bits are read/written LSB-first within each byte.
 */

/**
 * Get a single bit from data at the given bit position.
 * @param {Uint8Array} data
 * @param {number} pos - Bit position
 * @returns {number} 0 or 1
 */
export function getBit(data, pos) {
    return (data[pos >> 3] >> (pos & 7)) & 1;
}

/**
 * Read multiple bits from data starting at pos.
 * @param {Uint8Array} data
 * @param {number} pos - Starting bit position
 * @param {number} count - Number of bits to read
 * @returns {number} Value read (LSB-first)
 */
export function readBitsAt(data, pos, count) {
    let v = 0;
    for (let i = 0; i < count; i++) {
        v |= getBit(data, pos + i) << i;
    }
    return v >>> 0;
}

/**
 * Set a single bit in data at the given bit position.
 * @param {Uint8Array} data
 * @param {number} pos - Bit position
 * @param {number} val - 0 or 1
 */
export function setBit(data, pos, val) {
    const byteIdx = pos >> 3;
    const bitIdx = pos & 7;
    if (val) {
        data[byteIdx] |= (1 << bitIdx);
    } else {
        data[byteIdx] &= ~(1 << bitIdx);
    }
}

/**
 * Write multiple bits to data starting at pos.
 * @param {Uint8Array} data
 * @param {number} pos - Starting bit position
 * @param {number} value - Value to write
 * @param {number} count - Number of bits to write
 */
export function writeBits(data, pos, value, count) {
    for (let i = 0; i < count; i++) {
        setBit(data, pos + i, (value >> i) & 1);
    }
}

/**
 * BitReader class for sequential bit-stream reading.
 */
export class BitReader {
    /**
     * @param {Uint8Array} data - Binary data
     * @param {number} pos - Starting bit position (default: 0)
     */
    constructor(data, pos = 0) {
        this.data = data;
        this.pos = pos;
    }

    /**
     * Read a single bit as boolean.
     * @returns {number} 0 or 1
     */
    readBool() {
        const v = getBit(this.data, this.pos);
        this.pos += 1;
        return v;
    }

    /**
     * Read multiple bits.
     * @param {number} n - Number of bits
     * @returns {number} Value read
     */
    readBits(n) {
        const v = readBitsAt(this.data, this.pos, n);
        this.pos += n;
        return v;
    }

    /**
     * Handle debug ID check (since save files have debug_flag=1).
     * @param {number} oid - Optional ID (-1 means no tag expected)
     */
    debugSkip(oid) {
        this.readBool();
        if (oid !== -1) {
            this.readBits(32);
        }
    }

    /**
     * Read unsigned 32-bit packed integer.
     * @param {number} oid - Optional debug ID
     * @returns {number}
     */
    readU32Packed(oid = -1) {
        this.debugSkip(oid);
        if (!this.readBool()) {
            return 0;
        }
        const lzc = this.readBits(5);
        const vb = 32 - lzc;
        return vb > 0 ? this.readBits(vb) : 0;
    }

    /**
     * Read signed 32-bit packed integer.
     * @param {number} oid - Optional debug ID
     * @returns {number}
     */
    readI32Packed(oid = -1) {
        this.debugSkip(oid);
        if (!this.readBool()) {
            return 0;
        }
        const s = this.readBool();
        const lzc = this.readBits(5);
        const vb = 32 - lzc;
        const v = vb > 0 ? this.readBits(vb) : 0;
        return s ? -v : v;
    }

    /**
     * Read unsigned 64-bit packed integer (as two 32-bit parts).
     * @param {number} oid - Optional debug ID
     * @returns {bigint}
     */
    readU64Packed(oid = -1) {
        this.debugSkip(oid);
        const lo = this.readU32Packed(-1);
        const hi = this.readU32Packed(-1);
        return (BigInt(hi) << 32n) | BigInt(lo);
    }

    /**
     * Read wrapped boolean.
     * @param {number} oid - Optional debug ID
     * @returns {number} 0 or 1
     */
    readBoolWrapped(oid = -1) {
        this.debugSkip(oid);
        return this.readBool();
    }

    /**
     * Read a string.
     * @param {number} oid - Optional debug ID
     * @returns {string}
     */
    readString(oid = -1) {
        this.debugSkip(oid);
        const length = this.readU32Packed(-1);
        if (length === 0) {
            return "";
        }
        const cb = this.readBits(4);
        const base = this.readBits(8);
        let str = "";
        for (let i = 0; i < length; i++) {
            str += String.fromCharCode(this.readBits(cb) + base);
        }
        return str;
    }

    /**
     * Read a float (as U32Packed interpreted as IEEE 754).
     * @param {number} oid - Optional debug ID
     * @returns {number}
     */
    readFloat(oid = -1) {
        this.debugSkip(oid);
        const raw = this.readU32Packed(-1);
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setUint32(0, raw, true);
        return view.getFloat32(0, true);
    }

    /**
     * Read a chunk header.
     * @returns {Object} Chunk header info
     */
    readChunkHeader() {
        const r = {};
        if (this.readBool()) {
            const parentVal = this.readBits(32);
            r.parent = uint32ToTag(parentVal);
        }
        const tagVal = this.readU32Packed(-1);
        r.tag = uint32ToTag(tagVal);
        r.version = this.readU32Packed(-1);
        r.subversion = this.readU32Packed(-1);
        r.sizePos = this.pos;
        r.size = this.readBits(32);
        r.dataStart = this.pos;
        r.dataEnd = this.pos + r.size;
        return r;
    }

    /**
     * Skip to end of chunk.
     * @param {Object} ch - Chunk header
     */
    skipChunk(ch) {
        this.pos = ch.dataEnd;
        if (this.readBool()) {
            this.readBits(32);
        }
    }

    /**
     * Read chunk start (inner chunk).
     * @param {number} oid - Optional debug ID
     * @returns {Object}
     */
    readChunkStart(oid = -1) {
        this.debugSkip(oid);
        const ver = this.readU32Packed(-1);
        const subver = this.readU32Packed(-1);
        const val3 = this.readU32Packed(-1);
        const size = this.readBits(32);
        const dataEnd = this.pos + size;
        return {
            ver,
            subver,
            val3,
            size,
            dataStart: this.pos,
            dataEnd
        };
    }
}

/**
 * Convert a uint32 to a 4-character tag string (little-endian).
 * @param {number} val
 * @returns {string}
 */
function uint32ToTag(val) {
    return String.fromCharCode(
        val & 0xFF,
        (val >> 8) & 0xFF,
        (val >> 16) & 0xFF,
        (val >> 24) & 0xFF
    );
}
