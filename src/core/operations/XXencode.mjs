/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { encode, decode } from "../lib/XXencode.mjs";

/**
 * XXencode operation
 */
class XXencode extends Operation {

    /**
     * XXencode constructor
     */
    constructor() {
        super();

        this.name = "XXencode";
        this.module = "CTF";
        this.description = "xxencode\u662f\u4e00\u79cd\u7c7b\u4f3c\u4e8euuencode\u7684\u4e8c\u8fdb\u5236\u5230\u6587\u672c\u7f16\u7801\uff0c\u5b83\u53ea\u4f7f\u7528\u5b57\u6bcd\u6570\u5b57\u5b57\u7b26\u548c\u52a0\u53f7\u548c\u51cf\u53f7\u3002\u5b83\u662f\u4f5c\u4e3a\u4e00\u79cd\u4f20\u8f93\u6587\u4ef6\u683c\u5f0f\u7684\u624b\u6bb5\u800c\u53d1\u660e\u7684\uff0c\u8fd9\u79cd\u683c\u5f0f\u53ef\u4ee5\u5728\u5b57\u7b26\u96c6\u7ffb\u8bd1\u4e2d\u5e78\u5b58\u4e0b\u6765\uff0c\u7279\u522b\u662f\u5728IBM\u5927\u578b\u673a\u4e0a\u4f7f\u7528\u7684ASCII\u548cEBCDIC\u7f16\u7801\u4e4b\u95f4\u3002";
        this.infoURL = "https://en.wikipedia.org/wiki/Xxencoding"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
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
                pattern: "^[0-9A-Z+-]{20,}$",
                flags: "i",
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
        if (!input) return "";
        if (args[0] === "Encode") {
            return encode(input);
        }
        return decode(input);
    }

}

export default XXencode;
