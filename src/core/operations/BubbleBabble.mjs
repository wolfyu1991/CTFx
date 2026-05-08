/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {decode, encode} from "../lib/BubbleBabble.mjs";
import Utils from "../Utils.mjs";

/**
 * BubbleBabble operation
 */
class BubbleBabble extends Operation {

    /**
     * BubbleBabble constructor
     */
    constructor() {
        super();

        this.name = "BubbleBabble";
        this.module = "CTF";
        this.description = "\u6c14\u6ce1\u6df7\u4e32\u97f3\u7f16\u7801\u5c06\u4efb\u610f\u4e8c\u8fdb\u5236\u6570\u636e\u7f16\u7801\u4e3a\u5bf9\u4eba\u7c7b\u6765\u8bf4\u66f4\u81ea\u7136\u7684\u4f2a\u8bcd\uff0c\u53d1\u97f3\u76f8\u5bf9\u5bb9\u6613\u3002";
        this.infoURL = "http://wiki.yak.net/589/Bubble_Babble_Encoding.txt"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
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
                pattern: "^x([aeiouy][bcdfghklmnprstvzx]){2}(-([bcdfghklmnprstvzx][aeiouy]){2}[bcdfghklmnprstvzx])*-([bcdfghklmnprstvzx][aeiouy]){2}x$",
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
            return Utils.strToByteArray(encode(input));
        }
        return decode(input);
    }

}

export default BubbleBabble;
