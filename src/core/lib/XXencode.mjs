"use strict";

const base = "+-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
/**
 *
 * @param {String} The value to encoded.
 * @param {String} encoding
 */
export function encode(inString, encoding) {
    encoding = encoding || "utf8";

    const inBytes = Buffer.from(inString, encoding);
    const buffLen = inBytes.length;
    const outBytes = Buffer.alloc(buffLen + buffLen / 3 + 4);
    let outLen = 0;
    for (let i = 0; i < buffLen; i += 3) {
        outLen = i / 3 * 4;
        encodeBytes(inBytes, i, outBytes, outLen);
    }
    let rawResult = "";
    for (let j = 0; j < outLen + 4; j++) {
        rawResult += base[outBytes[j]];
    }
    const resultArray = [];
    const lnum = Math.floor(buffLen / 45);
    for (let k = 0; k < lnum; k++) {
        resultArray.push(base[45] + rawResult.substr(k * 60, 60) + "\r\n");
    }
    const left = buffLen % 45;
    if (left !== 0) {
        resultArray.push(base[left] + rawResult.substr(lnum * 60) + "\r\n");
    }
    const finalResult = resultArray.join("");
    return finalResult.substring(0, finalResult.length - 2);
}

/**
 *
 * @param {String} The value to decoded
 * @param {String} encoding
 */
export function decode(inString, encoding) {
    encoding = encoding || "utf8";

    let inArray = [];
    if (inString.indexOf("\r\n") !== -1) {
        inArray = inString.split("\r\n");
    } else {
        inArray = inString.split("\n");
    }
    let rawString = "";
    let totalLen = 0;
    for (const str of inArray) {
        const first = str.substr(0, 1);

        const lineAsciiNum = base.indexOf(first);

        totalLen += lineAsciiNum;

        const content = str.substr(1);
        rawString += content;
    }
    const buffLen = rawString.length;
    const inBytes = Buffer.alloc(buffLen);
    for (let cn = 0; cn < buffLen; cn++) {
        inBytes[cn] = base.indexOf(rawString[cn]);
    }
    const outBytes = Buffer.alloc(buffLen);
    let outLen = 0;
    for (let i = 0; i < buffLen; i++) {
        outLen = i / 4 * 3;
        decodeChars(inBytes, i, outBytes, outLen);
    }
    return outBytes.slice(0, totalLen).toString(encoding);
}

// private helper functions
/**
 *
 */
function encodeBytes(inBytes, inIndex, outBytes, outIndex) {
    const c1 = inBytes[inIndex] >>> 2;
    const c2 = inBytes[inIndex] << 4 & 0x30 | inBytes[inIndex + 1] >>> 4 & 0xF;
    const c3 = inBytes[inIndex + 1] << 2 & 0x3C | inBytes[inIndex + 2] >>> 6 & 0x3;
    const c4 = inBytes[inIndex + 2] & 0x3F;

    outBytes[outIndex] = (c1 & 0x3F);
    outBytes[outIndex + 1] = (c2 & 0x3F);
    outBytes[outIndex + 2] = (c3 & 0x3F);
    outBytes[outIndex + 3] = (c4 & 0x3F);
}

/**
 *
 */
function decodeChars(inBytes, inIndex, outBytes, outIndex) {
    const c1 = inBytes[inIndex];
    const c2 = inBytes[inIndex + 1];
    const c3 = inBytes[inIndex + 2];
    const c4 = inBytes[inIndex + 3];

    const b1 = (c1 & 0x3F) << 2 | (c2 & 0x3F) >> 4;
    const b2 = (c2 & 0x3F) << 4 | (c3 & 0x3F) >> 2;
    const b3 = (c3 & 0x3F) << 6 | c4 & 0x3F;

    outBytes[outIndex] = b1 & 0xFF;
    outBytes[outIndex + 1] = b2 & 0xFF;
    outBytes[outIndex + 2] = b3 & 0xFF;
}
