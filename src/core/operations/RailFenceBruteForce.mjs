/**
 * @author wolfyu
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
// import Utils from "../Utils.mjs";

/**
 * Rail Fence Force operation.
 */
class RailFenceBruteForce extends Operation {

    /**
     * RailFenceBruteForce constructor
     */
    constructor() {
        super();

        this.name = "Rail Fence Brute Force";
        this.module = "CTF";
        this.description = "栅栏密码爆破";
        this.infoURL = "https://wikipedia.org/wiki/Rail_fence_cipher";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Print amount",
                type: "boolean",
                value: true
            },
            {
                name: "Crib (known plaintext string)",
                type: "string",
                value: ""
            },
            {
                name: "Check flag",
                type: "boolean",
                value: false
            }
        ];
        this.checks = [
            {
                pattern: "^f.*({.*}|}.*{).*$",
                flags: "i",
                args: [false, "", true]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [printAmount, crib, flag] = args;
        const cribLower = crib.toLowerCase();
        const result = [];

        let string = input;
        if (this.isPrime(string.length)) {
            string = string + " ";
        }


        for (let n = 2; n < string.length; n++) {
            if (n > 100) {
                break;
            }

            let string1 = string;
            const m = Math.floor(string.length / n) + 1;
            const total = (Math.floor(string.length / n) + 1) * n;
            const y = total - string.length;
            let string2 = "";

            for (let i = 0; i < n; i++) {
                if (n - i > y) {
                    string2 += string1.slice(0, m);
                    string1 = string1.slice(m);
                } else {
                    string2 += string1.slice(0, m - 1) + " ";
                    string1 = string1.slice(m - 1);
                }
            }

            let fuilt = "";
            for (let j = 0; j < m; j++) {
                for (let i = 0; i < total; i += m) {
                    fuilt += string2[(i + j)];
                }
            }
            const output = fuilt.trim();
            if (flag === true) {
                const regex = /^(flag|ctf|key){.*?}$/i;
                if (regex.test(output)) {
                    if (printAmount) {
                        const amountStr = "Amount = " + (" " + n).slice(-2) + ": ";
                        result.push(amountStr + output);
                    } else {
                        result.push(output);
                    }
                }
            } else {
                if (output.toLowerCase().indexOf(cribLower) >= 0) {
                    if (printAmount) {
                        const amountStr = "Amount = " + (" " + n).slice(-2) + ": ";
                        result.push(amountStr + output);
                    } else {
                        result.push(output);
                    }
                }
            }
        }

        const cipher = input;
        for (let key = 2; key < cipher.length; key++) {
            const cycle = (key - 1) * 2;
            const plaintext = new Array(cipher.length);

            let j = 0;
            let x, y;
            const offset = 0;

            for (y = 0; y < key; y++) {
                for (x = 0; x < cipher.length; x++) {
                    if ((y + x + offset) % cycle === 0 || (y - x - offset) % cycle === 0) {
                        plaintext[x] = cipher[j++];
                    }
                }
            }
            const output = plaintext.join("").trim();
            if (flag === true) {
                const regex = /^(flag|ctf|key){.*?}$/i;
                if (regex.test(output)) {
                    if (printAmount) {
                        const amountStr = "Decode = " + (" " + key).slice(-2) + ": ";
                        result.push(amountStr + output);
                    } else {
                        result.push(output);
                    }
                }
            } else {
                if (output.toLowerCase().indexOf(cribLower) >= 0) {
                    if (printAmount) {
                        const amountStr = "Decode = " + (" " + key).slice(-2) + ": ";
                        result.push(amountStr + output);
                    } else {
                        result.push(output);
                    }
                }
            }
        }

        const plaintext = input;
        for (let key = 2; key < cipher.length; key++) {
            const cycle = (key - 1) * 2;
            const rows = new Array(key).fill("");
            const offset = 0;

            for (let pos = 0; pos < plaintext.length; pos++) {
                const rowIdx = key - 1 - Math.abs(cycle / 2 - (pos + offset) % cycle);

                rows[rowIdx] += plaintext[pos];
            }

            const output = rows.join("").trim();
            if (flag === true) {
                const regex = /^(flag|ctf|key){.*?}$/i;
                if (regex.test(output)) {
                    if (printAmount) {
                        const amountStr = "Encode = " + (" " + key).slice(-2) + ": ";
                        result.push(amountStr + output);
                    } else {
                        result.push(output);
                    }
                }
            } else {
                if (output.toLowerCase().indexOf(cribLower) >= 0) {
                    if (printAmount) {
                        const amountStr = "Encode = " + (" " + key).slice(-2) + ": ";
                        result.push(amountStr + output);
                    } else {
                        result.push(output);
                    }
                }
            }
        }

        return result.join("\n");
    }

    /**
     * 判断一个给定的数是否为质数。
     *
     * 质数是指在大于1的自然数中，除了1和它自身外，不能被其他自然数整除的数。
     *
     * @param {number} num - 要判断是否为质数的数。
     * @returns {boolean} - 如果 num 是质数，则返回 true；否则返回 false。
     */
    isPrime(num) {
        let i = 2;
        while (i < num) {
            const s = num % i;
            if (s === 0) {
                break;
            } else {
                i++;
            }
        }
        if (num === i) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @function fence
     * @description 对输入的字符串进行多种方式的分组处理以获取不同的解密结果，并将所有处理结果整理成一个字符串返回。
     * 具体处理过程包括：判断字符串长度是否为质数并按需添加空格，寻找字符串长度的因数并基于因数分组拼接字符串获取解密结果，
     * 同时对不符合因数条件的部分整数（2到100之间且不能整除字符串长度的数）也进行类似分组拼接操作获取其他解密结果。
     *
     * @param {string} string - 要进行处理的输入字符串。
     * @returns {string} - 包含所有处理结果信息的字符串，具体内容有：字符串长度的因数信息、基于因数分组的解密结果、
     * 以及对不符合因数条件整数分组后的解密结果等，各部分结果之间通过特定格式（换行符、分隔符等）进行区分。
     */
    fence(string) {
        if (this.isPrime(string.length)) {
            string = string + " ";
        }

        const result = [];

        for (let n = 2; n < string.length; n++) {
            if (n > 100) {
                break;
            }

            let string1 = string;
            const m = Math.floor(string.length / n) + 1;
            const total = (Math.floor(string.length / n) + 1) * n;
            const y = total - string.length;
            let string2 = "";

            for (let i = 0; i < n; i++) {
                if (n - i > y) {
                    string2 += string1.slice(0, m);
                    string1 = string1.slice(m);
                } else {
                    string2 += string1.slice(0, m - 1) + " ";
                    string1 = string1.slice(m - 1);
                }
            }

            let fuilt = "";
            for (let j = 0; j < m; j++) {
                for (let i = 0; i < total; i += m) {
                    fuilt += string2[(i + j)];
                }
            }
            const amountStr = "Amount = " + (" " + n).slice(-2) + ": ";

            result.push(amountStr + fuilt.replace(/\s/g, ""));
        }

        return result.join("\n");
    }

}

export default RailFenceBruteForce;
