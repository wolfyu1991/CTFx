/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import * as z from "../lib/ZeroWidth.mjs";
import zs from "../lib/ZwspSteg.mjs";
import unicodeSteganographer from "../lib/UnicodeSteganography.mjs";


/**
 * ZeroWidth operation
 */
class ZeroWidth extends Operation {

    /**
     * ZeroWidth constructor
     */
    constructor() {
        super();

        this.name = "零宽隐写";
        this.module = "CTF";
        this.description = "零宽隐写合集，支持unicode_steganography、zwsp-steg-js、zero-width-lib功能。零宽连字，全称是Zero Width Joiner，简称：ZWJ，是一个不打印字符，放在某些需要复杂排版语言（如阿拉伯语、印地语）的两个字符之间，使得这两个本不会发生连字的字符产生了连字效果。零宽连字符的Unicode码位是U+200D (HTML: &#8205; &zwj;）。";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "MODE",
                type: "argSelector",
                value: [
                    {
                        name: "zero-width-lib",
                        off: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
                    },
                    {
                        name: "Unicode Steganography",
                        on: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                        off: [16]
                    },
                    {
                        name: "zwsp-steg",
                        off: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                        on: [16]
                    }
                ]
            },
            {
                "name": "U+034F",
                "type": "boolean",
                "value": false
            },
            {
                "name": "U+200B",
                "type": "boolean",
                "value": false
            },
            {
                "name": "U+200C",
                "type": "boolean",
                "value": true
            },
            {
                "name": "U+200D",
                "type": "boolean",
                "value": true
            },
            {
                "name": "U+200E",
                "type": "boolean",
                "value": false
            },
            {
                "name": "U+200F",
                "type": "boolean",
                "value": false
            },
            {
                "name": "U+2028",
                "type": "boolean",
                "value": false
            },
            {
                "name": "U+2029",
                "type": "boolean",
                "value": false
            },
            {
                "name": "U+202A",
                "type": "boolean",
                "value": false
            },
            {
                "name": "U+202C",
                "type": "boolean",
                "value": true
            },
            {
                "name": "U+202D",
                "type": "boolean",
                "value": false
            },
            {
                "name": "U+2061",
                "type": "boolean",
                "value": false
            },
            {
                "name": "U+2062",
                "type": "boolean",
                "value": false
            },
            {
                "name": "U+2063",
                "type": "boolean",
                "value": false
            },
            {
                "name": "U+FEFF",
                "type": "boolean",
                "value": true
            },
            {
                "name": "zwsp-steg Mode",
                "type": "option",
                "value": ["MODE_FULL", "MODE_ZWSP"]
            }
        ];
        this.checks = [
            {
                pattern: "^[‌|‍|​|﻿|‎|‏]*$",
                flags: "g",
                args: ["zero-width-lib"]
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
        if (args[0] === "zero-width-lib") {
            return z.decode(input);
        }
        if (args[0] === "zwsp-steg") {
            return args[16] === "MODE_FULL" ? zs.decode(input, zs.MODE_FULL) : args[16] === "MODE_ZWSP" ? zs.decode(input, zs.MODE_ZWSP) : null;
        }
        if (args[0] === "Unicode Steganography") {
            const allChars = ["\u034f", "\u200b", "\u200c", "\u200d", "\u200e", "\u200f", "\u2028", "\u2029", "\u202a", "\u202c", "\u202d", "\u2061", "\u2062", "\u2063", "\ufeff"];
            let chars = "";
            for (let j = 1; j < 16; j++) {
                if (args[j] === true) {
                    chars += allChars[j - 1];
                }
            }
            unicodeSteganographer.setUseChars(chars);
            const result = unicodeSteganographer.decodeText(input);

            return result.hiddenText;
        }
        return z.decode(input);
    }

}
export default ZeroWidth;
