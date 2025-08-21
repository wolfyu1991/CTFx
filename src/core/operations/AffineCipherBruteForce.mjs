/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Affine Cipher Decode operation
 */
class AffineCipherDecode extends Operation {

    /**
     * AffineCipherDecode constructor
     */
    constructor() {
        super();

        this.name = "Affine Cipher Brute Force";
        this.module = "CTF";
        this.description = "仿射密码（Affine Cipher）是一种单表替换密码。解密时，将字母表中的每个字母映射为其对应的数值，通过数学函数进行解密，然后再转换回字母。";
        this.infoURL = "https://wikipedia.org/wiki/Affine_cipher";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Print a/b",
                type: "boolean",
                value: true
            },
            {
                name: "Crib (known plaintext string)",
                type: "string",
                value: ""
            },
        ];
        this.checks = [
            {
                pattern: "^[a-z]{4}{.*?}$",
                flags: "i",
                args: [false, "flag{"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if a or b values are invalid
     */
    run(input, args) {
        const [printkey, crib] = args;
        const cribLower = crib.toLowerCase();
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        const result = [];

        for (let a = 1; a < 26; a++) {
            const aModInv = Utils.modInv(a, 26); // Calculates modular inverse of a
            if (Utils.gcd(a, 26) === 1) {
                for (let b = 0; b < 26; b++) {
                    let line = "";
                    for (let i = 0; i < input.length; i++) {
                        if (alphabet.indexOf(input[i]) >= 0) {
                            // Uses the affine decode function (y-b * A') % m = x (where m is length of the alphabet and A' is modular inverse)
                            line += alphabet[Utils.mod((alphabet.indexOf(input[i]) - b) * aModInv, 26)];
                        } else if (alphabet.indexOf(input[i].toLowerCase()) >= 0) {
                            // Same as above, accounting for uppercase
                            line += alphabet[Utils.mod((alphabet.indexOf(input[i].toLowerCase()) - b) * aModInv, 26)].toUpperCase();
                        } else {
                            // Non-alphabetic characters
                            line += input[i];
                        }
                    }
                    if (line.toLowerCase().indexOf(cribLower) >= 0) {
                        if (printkey) {
                            const keyStr = "a= " + (" " + a).slice(-2) + ",b= " + (" " + b).slice(-2) + ": ";
                            result.push(keyStr + line.trim());
                        } else {
                            result.push(line.trim());
                        }
                    }
                }
            }
        }

        return result.join("\n");
    }

    /**
     * Highlight Affine Cipher Decode
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
     * Highlight Affine Cipher Decode in reverse
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

export default AffineCipherDecode;
