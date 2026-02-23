/**
 * Chunk navigation for STV save files.
 * Handles navigating through the chunk hierarchy to find resources and hull data.
 */

import { BitReader, getBit, readBitsAt } from './bitstream.js';

// Tag constants (little-endian FourCC)
export const TAG_RICT = 0x74636972;  // "rict" - resource item count
export const TAG_RINM = 0x6d6e6972;  // "rinm" - resource item name
export const TAG_SHCT = 0x73686374;  // "tchs" stored as shct - ship tech count (used for hull location)

/**
 * Navigate to the cser (resources) chunk.
 * @param {Uint8Array} data
 * @returns {Object} { reader: BitReader, chunk: Object }
 */
export function navigateToCser(data) {
    const r = new BitReader(data, 128);
    const parw = r.readChunkHeader();  // parw (wrap)
    const daeh = r.readChunkHeader();  // daeh (head)
    r.skipChunk(daeh);
    const emag = r.readChunkHeader();  // emag (game)
    const trts = r.readChunkHeader();  // trts (strt)
    const cser = r.readChunkHeader();  // cser (resc)
    return { reader: r, chunk: cser };
}

/**
 * Navigate to the tsnc (construction) chunk.
 * @param {Uint8Array} data
 * @returns {Object} { reader: BitReader, chunk: Object }
 */
export function navigateToTsnc(data) {
    const r = new BitReader(data, 128);
    const parw = r.readChunkHeader();  // parw
    const daeh = r.readChunkHeader();  // daeh
    r.skipChunk(daeh);
    const emag = r.readChunkHeader();  // emag
    const trts = r.readChunkHeader();  // trts
    const cser = r.readChunkHeader();  // cser
    r.skipChunk(cser);
    const psjv = r.readChunkHeader();  // psjv
    r.skipChunk(psjv);
    const tces = r.readChunkHeader();  // tces (sect)
    r.skipChunk(tces);
    const tsnc = r.readChunkHeader();  // tsnc (cnst)
    return { reader: r, chunk: tsnc };
}

/**
 * Find the shct tag position within the tsnc chunk.
 * @param {Uint8Array} data
 * @param {Object} tsnc - tsnc chunk header
 * @returns {number|null} Bit position after reading shct, or null if not found
 */
export function findShctPosition(data, tsnc) {
    const targetShct = TAG_SHCT;
    
    for (let pos = tsnc.dataStart; pos < tsnc.dataEnd - 33; pos++) {
        if (getBit(data, pos) === 1) {
            const val = readBitsAt(data, pos + 1, 32);
            if (val === targetShct) {
                const r = new BitReader(data, pos);
                r.readI32Packed(targetShct);
                return r.pos;
            }
        }
    }
    return null;
}

/**
 * Get the bit positions of the 4 chunk size fields (parw, emag, trts, cser).
 * These need to be updated when resources change size.
 * @param {Uint8Array} data
 * @returns {number[]} Array of 4 bit positions
 */
export function getChunkSizePositions(data) {
    const r = new BitReader(data, 128);
    const parw = r.readChunkHeader();
    const daeh = r.readChunkHeader();
    r.skipChunk(daeh);
    const emag = r.readChunkHeader();
    const trts = r.readChunkHeader();
    const cser = r.readChunkHeader();
    return [parw.sizePos, emag.sizePos, trts.sizePos, cser.sizePos];
}

// Additional tags for resource manipulation
export const TAG_RRQC = 0x63717272;  // "rrqc" - resource requirements count (follows resource items)

/**
 * Navigate to the tlba (abilities/tech tree) chunk.
 * Path: parw → daeh(skip) → emag → trts → cser(skip) → psjv(skip) → tces(skip) → 
 *       tsnc(skip) → [skip dpsr chunks] → oreh(skip) → afar(skip) → tnve(skip) → 
 *       lcyc(skip) → laid(skip) → seuq(skip) → tlba
 * @param {Uint8Array} data
 * @returns {Object} { reader: BitReader, chunk: Object }
 */
export function navigateToTlba(data) {
    const r = new BitReader(data, 128);
    
    // parw
    const parw = r.readChunkHeader();
    
    // daeh - skip
    const daeh = r.readChunkHeader();
    r.skipChunk(daeh);
    
    // emag
    const emag = r.readChunkHeader();
    
    // trts
    const trts = r.readChunkHeader();
    
    // cser - skip
    const cser = r.readChunkHeader();
    r.skipChunk(cser);
    
    // psjv - skip
    const psjv = r.readChunkHeader();
    r.skipChunk(psjv);
    
    // tces - skip
    const tces = r.readChunkHeader();
    r.skipChunk(tces);
    
    // tsnc - skip
    const tsnc = r.readChunkHeader();
    r.skipChunk(tsnc);
    
    // Skip dpsr chunks (variable count)
    while (true) {
        const startPos = r.pos;
        const chunk = r.readChunkHeader();
        if (chunk.tag === 'dpsr') {
            r.skipChunk(chunk);
        } else {
            r.pos = startPos;
            break;
        }
    }
    
    // oreh - skip
    const oreh = r.readChunkHeader();
    r.skipChunk(oreh);
    
    // afar - skip
    const afar = r.readChunkHeader();
    r.skipChunk(afar);
    
    // tnve - skip
    const tnve = r.readChunkHeader();
    r.skipChunk(tnve);
    
    // lcyc - skip
    const lcyc = r.readChunkHeader();
    r.skipChunk(lcyc);
    
    // laid - skip
    const laid = r.readChunkHeader();
    r.skipChunk(laid);
    
    // seuq - skip
    const seuq = r.readChunkHeader();
    r.skipChunk(seuq);
    
    // tlba
    const tlba = r.readChunkHeader();
    
    return { reader: r, chunk: tlba };
}

/**
 * Get resource array positions needed for adding new items.
 * @param {Uint8Array} data
 * @returns {Object} { countPos, countValuePos, arrayEndPos, count }
 *   - countPos: bit position of the rict debug prefix
 *   - countValuePos: bit position after debug prefix (where count value starts)
 *   - arrayEndPos: bit position where resource array ends (before rrqc)
 *   - count: current number of resources
 */
export function getResourceArrayPositions(data) {
    const { reader: r, chunk: cser } = navigateToCser(data);
    
    // The first thing in cser data is the rict count with debug tag
    // Position is at cser.dataStart (r.pos after navigateToCser)
    const countPos = r.pos;
    
    // Read the count (this also advances past the debug prefix + tag)
    const count = r.readI32Packed(TAG_RICT);
    
    // countValuePos is after debug bit (1) + tag (32) = 33 bits
    const countValuePos = countPos + 33;
    
    // Now read through all resources to find end position
    for (let i = 0; i < count; i++) {
        r.readU32Packed(-1);  // index
        r.readString(TAG_RINM);  // name
        r.readI32Packed(-1);  // quantity
        r.readBoolWrapped(-1);  // flag
    }
    
    return {
        countPos,
        countValuePos,
        arrayEndPos: r.pos,
        count
    };
}

/**
 * Get the bit positions of chunk size fields for tlba modifications.
 * These need to be updated when tech tree entries change: parw, emag, trts, tlba
 * @param {Uint8Array} data
 * @returns {number[]} Array of 4 bit positions
 */
export function getTlbaChunkSizePositions(data) {
    const r = new BitReader(data, 128);
    
    // parw
    const parw = r.readChunkHeader();
    
    // daeh - skip
    const daeh = r.readChunkHeader();
    r.skipChunk(daeh);
    
    // emag
    const emag = r.readChunkHeader();
    
    // trts
    const trts = r.readChunkHeader();
    
    // cser - skip
    const cser = r.readChunkHeader();
    r.skipChunk(cser);
    
    // psjv - skip
    const psjv = r.readChunkHeader();
    r.skipChunk(psjv);
    
    // tces - skip
    const tces = r.readChunkHeader();
    r.skipChunk(tces);
    
    // tsnc - skip
    const tsnc = r.readChunkHeader();
    r.skipChunk(tsnc);
    
    // Skip dpsr chunks (variable count)
    while (true) {
        const startPos = r.pos;
        const chunk = r.readChunkHeader();
        if (chunk.tag === 'dpsr') {
            r.skipChunk(chunk);
        } else {
            r.pos = startPos;
            break;
        }
    }
    
    // oreh - skip
    const oreh = r.readChunkHeader();
    r.skipChunk(oreh);
    
    // afar - skip
    const afar = r.readChunkHeader();
    r.skipChunk(afar);
    
    // tnve - skip
    const tnve = r.readChunkHeader();
    r.skipChunk(tnve);
    
    // lcyc - skip
    const lcyc = r.readChunkHeader();
    r.skipChunk(lcyc);
    
    // laid - skip
    const laid = r.readChunkHeader();
    r.skipChunk(laid);
    
    // seuq - skip
    const seuq = r.readChunkHeader();
    r.skipChunk(seuq);
    
    // tlba
    const tlba = r.readChunkHeader();
    
    return [parw.sizePos, emag.sizePos, trts.sizePos, tlba.sizePos];
}

/**
 * Get tech tree array positions needed for adding/removing tech entries.
 * @param {Uint8Array} data
 * @returns {Object} { countPos, arrayEndPos, count, techs }
 *   - countPos: bit position of the count value (after debug prefix)
 *   - arrayEndPos: bit position where tech array ends
 *   - count: current number of tech entries
 *   - techs: array of { name, startPos, endPos } for each tech entry
 */
export function getTlbaArrayPositions(data) {
    const { reader: r, chunk: tlba } = navigateToTlba(data);
    
    // The first thing in tlba data is the count (I32Packed with no tag)
    // Format: debug_bit(0) + I32Packed value
    const debugBitPos = r.pos;
    
    // Read count (includes reading the debug bit)
    const count = r.readI32Packed(-1);
    
    // countPos is after the debug bit
    const countPos = debugBitPos + 1;
    
    // Read all tech strings and record their positions
    const techs = [];
    for (let i = 0; i < count; i++) {
        const startPos = r.pos;
        const name = r.readString(-1);
        techs.push({
            name,
            startPos,
            endPos: r.pos
        });
    }
    
    return {
        debugBitPos,
        countPos,
        arrayEndPos: r.pos,
        count,
        techs
    };
}
