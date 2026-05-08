/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { fromBinary } from "../lib/Binary.mjs";
// import OperationError from "../errors/OperationError.mjs";

/**
 * Base64Steg operation
 */
class Base64Steg extends Operation {

    /**
     * Base64Steg constructor
     */
    constructor() {
        super();

        this.name = "Base64隐写";
        this.module = "CTF";
        this.description = "Base64的编码过程就是将文本字符对应成二进制后，再六个一组对应成索引，转为编码字符。如果字符串长度不是3的 倍数，则对应的二进制位数不是6的倍数，需要在末尾用0填充。若剩1个字符则在编码结果后加2个‘=’；若剩2个字符则 加1个‘=’。\nBase64的解码过程，即先丢弃编码后面的‘=’，然后将每个base64字符对应索引转为6bit的二进制数，再8个一组转为ASCII码字符完成解码，最后若剩下不足8位的，则全部丢弃。\n所以某些bit位在解码时会被丢弃，换句话说，这些bit值不会对解码结果产生影响。一个简单直观的例子就是QUJDRA和QUJDRC解码后都是ABCD。由此我们便可以将隐藏信息插入这些bit位中实现隐写。\n一串Base64的编码最多也只有4bit的隐写空间，所以实现隐写往往需要大量编码串。隐写时把明文的每个字符用8位二进制数表示，由此将整个明文串转为bit串，按顺序填入Base64编码串的可隐写位中即可实现隐写。";
        this.infoURL = "https://github.com/Mz1z/b64steg/blob/master/b64steg/B64steger.py";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [
            {
                name: "MODE",
                type: "argSelector",
                value: [
                    {
                        name: "Base64",
                        off: [2],
                        on: [1]
                    },
                    {
                        name: "Base32",
                        off: [1],
                        on: [2]
                    },
                    {
                        name: "Base32 Padding",
                        off: [1],
                        on: [2]
                    }
                ]
            },
            {
                name: "Table",
                type: "binaryString",
                value: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
            },
            {
                name: "Table",
                type: "binaryString",
                value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (!input) return [];
        const mode = args[0],
            b64Table = args[1],
            b32Table = args[2];
        // 行之间用\n分割
        const chunkSizeEnd = input.indexOf("\n") + 1;
        const lineEndings = input.charAt(chunkSizeEnd - 2) === "\r" ? "\r\n" : "\n";
        const texts = input.split(lineEndings);
        if (mode === "Base64") {
            const decodedBinary = base64StegoDecode(texts, b64Table);
            // 将二进制数据转换为字节串
            return fromBinary(decodedBinary, 8, 8);
        } else if (mode === "Base32") {
            const decodedBinary = base32StegoDecode(texts, b32Table);
            // 将二进制数据转换为字节串
            return fromBinary(decodedBinary, 8, 8);
        } else if (mode === "Base32 Padding") {
            const decodedBinary = base32StegoDecode(texts, b32Table, true);
            // 将二进制数据转换为字节串
            return fromBinary(decodedBinary, 8, 8);
        }

    }

}

/**
 * @param {string} text
 * @param {Object[]} args
 * @returns {string}
 */
function base64StegoDecode(texts, table) {
    // 解隐写
    let decodedBinary = "";
    const b64Table = table || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    for (let text of texts) {
        text = text.trim();
        if (text.includes("==")) {
            // 隐写4bit
            decodedBinary += ("0000" + b64Table.indexOf(text.slice(-3, -2)).toString(2)).slice(-4);
        } else if (text.includes("=")) {
            // 隐写2bit
            decodedBinary += ("00" + b64Table.indexOf(text.slice(-2, -1)).toString(2)).slice(-2);
        } else {
            continue;
        }
    }

    return decodedBinary;
}

/**
 */
function getBase32DiffValue(stegoLine, normalLine, table) {
    const base32Chars = table || "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    for (let i = 0; i < normalLine.length; i++) {
        if (stegoLine[i] !== normalLine[i]) {
            return Math.abs(
                base32Chars.indexOf(stegoLine[i]) -
                base32Chars.indexOf(normalLine[i])
            );
        }
    }
    return 0;
}

/**
 * base32 隐写解密
 */
function base32StegoDecode(lines, table, padding = false) {
    let res = "";
    for (const line of lines) {
        const stegoLine = line.trim().slice(-8);
        if (!stegoLine.includes("=")) {
            continue;
        }

        const normalLine = base32Encode(base32Decode(stegoLine));
        const diff = getBase32DiffValue(stegoLine, normalLine, table);

        const padsNum = (line.match(/=/g) || []).length;
        if (diff) {
            res += (padding ? diff.toString(2).padStart(5 * (8 - padsNum) % 8, "0") : diff.toString(2));
        } else {
            res += (padding ? "0".repeat(5 * (8 - padsNum) % 8) : "0");
        }
    }
    return res;
}

/**
 * @param {string} input
 * @param {Object[]} args
 * @returns {byteArray}
 */
function base32Decode(input) {
    if (!input) return [];

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
        output = [];

    let chr1, chr2, chr3, chr4, chr5,
        enc1, enc2, enc3, enc4, enc5, enc6, enc7, enc8,
        i = 0;

    while (i < input.length) {
        enc1 = alphabet.indexOf(input.charAt(i++));
        enc2 = alphabet.indexOf(input.charAt(i++) || "=");
        enc3 = alphabet.indexOf(input.charAt(i++) || "=");
        enc4 = alphabet.indexOf(input.charAt(i++) || "=");
        enc5 = alphabet.indexOf(input.charAt(i++) || "=");
        enc6 = alphabet.indexOf(input.charAt(i++) || "=");
        enc7 = alphabet.indexOf(input.charAt(i++) || "=");
        enc8 = alphabet.indexOf(input.charAt(i++) || "=");

        chr1 = (enc1 << 3) | (enc2 >> 2);
        chr2 = ((enc2 & 3) << 6) | (enc3 << 1) | (enc4 >> 4);
        chr3 = ((enc4 & 15) << 4) | (enc5 >> 1);
        chr4 = ((enc5 & 1) << 7) | (enc6 << 2) | (enc7 >> 3);
        chr5 = ((enc7 & 7) << 5) | enc8;

        output.push(chr1);
        if (chr2 !== 0 && enc3 !== 32) output.push(chr2);
        if (chr3 !== 0 && enc5 !== 32) output.push(chr3);
        if (chr4 !== 0 && enc6 !== 32) output.push(chr4);
        if (chr5 !== 0 && enc8 !== 32) output.push(chr5);
    }

    return output;
}

/**
 * @param {ArrayBuffer} input
 * @param {Object[]} args
 * @returns {string}
 */
function base32Encode(input) {
    if (!input) return "";
    input = new Uint8Array(input);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=";
    let output = "",
        chr1, chr2, chr3, chr4, chr5,
        enc1, enc2, enc3, enc4, enc5, enc6, enc7, enc8,
        i = 0;
    while (i < input.length) {
        chr1 = input[i++];
        chr2 = input[i++];
        chr3 = input[i++];
        chr4 = input[i++];
        chr5 = input[i++];

        enc1 = chr1 >> 3;
        enc2 = ((chr1 & 7) << 2) | (chr2 >> 6);
        enc3 = (chr2 >> 1) & 31;
        enc4 = ((chr2 & 1) << 4) | (chr3 >> 4);
        enc5 = ((chr3 & 15) << 1) | (chr4 >> 7);
        enc6 = (chr4 >> 2) & 31;
        enc7 = ((chr4 & 3) << 3) | (chr5 >> 5);
        enc8 = chr5 & 31;

        if (isNaN(chr2)) {
            enc3 = enc4 = enc5 = enc6 = enc7 = enc8 = 32;
        } else if (isNaN(chr3)) {
            enc5 = enc6 = enc7 = enc8 = 32;
        } else if (isNaN(chr4)) {
            enc6 = enc7 = enc8 = 32;
        } else if (isNaN(chr5)) {
            enc8 = 32;
        }

        output += alphabet.charAt(enc1) + alphabet.charAt(enc2) + alphabet.charAt(enc3) +
            alphabet.charAt(enc4) + alphabet.charAt(enc5) + alphabet.charAt(enc6) +
            alphabet.charAt(enc7) + alphabet.charAt(enc8);
    }
    return output;
}

export default Base64Steg;
