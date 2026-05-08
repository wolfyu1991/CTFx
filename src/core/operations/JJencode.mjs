/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { jjdecode, encodejj } from "../lib/JJencode.mjs";

/**
 * JJencode operation
 */
class JJencode extends Operation {

    /**
     * JJencode constructor
     */
    constructor() {
        super();

        this.name = "JJencode";
        this.module = "CTF";
        this.description = "\u7528\u4e8e\u7f16\u7801\u548c\u89e3\u7801 JavaScript \u4ee3\u7801\uff08\u4f7f\u7528 JJencode \u52a0\u5bc6\uff09";
        this.infoURL = "https://utf-8.jp/public/jjencode.html"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "mode",
                type: "argSelector",
                value: [
                    {
                        name: "Decode",
                        off: [1, 2]
                    },
                    {
                        name: "Encode",
                        on: [1, 2]
                    }
                ]
            },
            {
                "name": "全局变量",
                "type": "string",
                "value": "$"
            },
            {
                "name": "回文",
                "type": "boolean",
                "value": false
            },
        ];
        this.checks = [
            {
                pattern: "^[$_+.\"()[\\],:=!;{}'~\\\\]{8,}$",
                flags: "m",
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
            return encodejj(input, args[1], args[2]);
        }
        return jjdecode(input);
    }

}

export default JJencode;
