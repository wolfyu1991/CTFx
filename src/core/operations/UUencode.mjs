/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {decode, encode} from "../lib/UUencode.mjs";

/**
 * UUencode operation
 */
class UUencode extends Operation {

    /**
     * UUencode constructor
     */
    constructor() {
        super();

        this.name = "UUencode";
        this.module = "CTF";
        this.description = "UUencode\u5373\u201cUnix\u5230Unix\u7f16\u7801\u201d\u662f\u4e00\u79cd\u5b89\u5168\u7684\u7f16\u7801\uff0c\u7528\u4e8e\u5c06\u4efb\u610f\u6587\u4ef6\u4ece\u4e00\u4e2aUnix\u7cfb\u7edf\u4f20\u8f93\u5230\u53e6\u4e00\u4e2aUnix\u7cfb\u7edf\uff0c\u4f46\u4e0d\u4fdd\u8bc1\u4e2d\u95f4\u7684\u94fe\u63a5\u90fd\u662fUnix\u7cfb\u7edf\u3002\u4e3b\u8981\u5e94\u7528\u5728\u90ae\u4ef6\u548c\u65b0\u95fb\u7ec4\u3002";
        this.infoURL = "https://en.wikipedia.org/wiki/Uuencoding"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [
            {
                name: "mode",
                type: "option",
                value: ["Decode", "Encode"]
            }
        ];
        this.checks = [
            {
                pattern: "^[ `!\"#\\$%&'()*+,-./0-9:;<=>?@A-Z[\\]^_\\r\\n]{20,}$",
                flags: "",
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

export default UUencode;
