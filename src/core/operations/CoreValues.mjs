/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {decode, encode} from "../lib/CoreValues.mjs";


/**
 * CoreValues operation
 */
class CoreValues extends Operation {

    /**
     * CoreValues constructor
     */
    constructor() {
        super();

        this.name = "核心价值观编码";
        this.module = "CTF";
        this.description = "\u793e\u4f1a\u4e3b\u4e49\u6838\u5fc3\u4ef7\u503c\u89c2\uff1a\u5bcc\u5f3a\u3001\u6c11\u4e3b\u3001\u6587\u660e\u3001\u548c\u8c10\uff1b\u81ea\u7531\u3001\u5e73\u7b49\u3001\u516c\u6b63\u3001\u6cd5\u6cbb\uff1b\u7231\u56fd\u3001\u656c\u4e1a\u3001\u8bda\u4fe1\u3001\u53cb\u5584";
        this.infoURL = "https://github.com/wTool/Core-Values-Encoder";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "mode",
                type: "option",
                value: ["Decode", "Encode"]
            }
        ];
        this.checks = [
            {
                pattern: "^[富强|民主|文明|和谐|自由|平等|公正|法治|爱国|敬业|诚信|友善]*$",
                flags: "g",
                args: ["Decode"]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (args[0] === "Encode") {
            return encode(input);
        }
        return decode(input);
    }

}
export default CoreValues;
