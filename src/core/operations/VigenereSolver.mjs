/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
/**
 * VigenereSolver operation
 */
class VigenereSolver extends Operation {

    /**
     * VigenereSolver constructor
     */
    constructor() {
        super();

        this.name = "Vigenere Solver";
        this.module = "CTF";
        this.description = "维吉尼亚密码（法语：Chiffre de Vigenère，又译维热纳尔密码）是使用一系列凯撒密码组成密码字母表的加密算法，属于多表密码的一种简单形式。";
        this.infoURL = "https://wikipedia.org/wiki/Vigenère_cipher";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Key",
                "type": "string",
                "value": ""
            },
            {
                name: "KeyLen",
                type: "number",
                value: 0
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const alphabet = "abcdefghijklmnopqrstuvwxyz",
            ciphertext = input,
            cipherMin = ciphertext.toLowerCase().replace(/[^a-z]/g, ""),
            count = [],
            freq = [8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153, 0.772, 4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987, 6.327, 9.056, 2.758, 0.978, 2.360, 0.150, 1.974, 0.074];
        let output = "",
            fail = 0,
            keyIndex,
            msgIndex,
            chr,
            key = args[0].toLowerCase(),
            keyLen = args[1],
            bestKey = "";

        if (keyLen === 0) {
            // 猜测key长度3————12
            for (let bestLen = 3; bestLen < 13; bestLen++) {
                let sum = 0;
                for (let j = 0; j < bestLen; j++) {
                    for (let i = 0; i < 26; i++) {
                        count[i] = 0;
                    }
                    for (let i = j; i < cipherMin.length; i += bestLen) {
                        count[cipherMin[i].charCodeAt(0) - 97] += 1;
                    }
                    let ic = 0;
                    const num = cipherMin.length / bestLen;
                    for (let i = 0; i < count.length; i++) {
                        ic += Math.pow(count[i] / num, 2);
                    }
                    sum += ic;
                    // console.log(keyLen,ic);
                }
                // 确定密钥长度
                if (sum / bestLen > 0.065) {
                    keyLen = bestLen;
                    break;
                }
            }
        }

        // console.log(bestLen)
        for (let j = 0; j < keyLen; j++) {
            for (let i = 0; i < 26; i++) {
                count[i] = 0;
            }
            for (let i = j; i < cipherMin.length; i += keyLen) {
                count[cipherMin[i].charCodeAt(0) - 97] += 1;
            }
            let maxDp = -1000000;
            let besti = 0;

            for (let i = 0; i < 26; i++) {
                let curDp = 0.0;
                for (let k = 0; k < 26; k++) {
                    // 这里要找出频率分布匹配的key
                    curDp += freq[k] * count[(k + i) % 26];
                }
                if (curDp > maxDp) {
                    maxDp = curDp;
                    besti = i;
                }
            }
            bestKey += String.fromCharCode(besti + 97);
        }
        key = bestKey;

        if (!key) throw new OperationError("No key entered");
        if (!/^[a-zA-Z]+$/.test(key)) throw new OperationError("The key must consist only of letters");

        for (let i = 0; i < input.length; i++) {
            if (alphabet.indexOf(input[i]) >= 0) {
                chr = key[(i - fail) % key.length];
                keyIndex = alphabet.indexOf(chr);
                msgIndex = alphabet.indexOf(input[i]);
                // Subtract indexes from each other, add 26 just in case the value is negative,
                // modulo to remove if necessary
                output += alphabet[(msgIndex - keyIndex + alphabet.length) % 26];
            } else if (alphabet.indexOf(input[i].toLowerCase()) >= 0) {
                chr = key[(i - fail) % key.length].toLowerCase();
                keyIndex = alphabet.indexOf(chr);
                msgIndex = alphabet.indexOf(input[i].toLowerCase());
                output += alphabet[(msgIndex + alphabet.length - keyIndex) % 26].toUpperCase();
            } else {
                output += input[i];
                fail++;
            }
        }
        // this.args[0].value = bestKey;
        // this.args[1].value = keyLen;
        const result = `Key:${bestKey}\nKeylen:${keyLen}\nMessage:\n`;
        return result + output;
    }

    /**
     * Highlight VigenereSolver Decode
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight VigenereSolver in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }

}

export default VigenereSolver;
