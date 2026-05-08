/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { encode } from "../lib/Base32768.mjs";

/**
 * To Base32768 operation
 */
class ToBase32768 extends Operation {

    /**
     * ToBase32768 constructor
     */
    constructor() {
        super();

        this.name = "To Base32768";
        this.module = "CTF";
        this.description = "Base32768 \u662f\u4e00\u79cd\u9488\u5bf9 UTF-16 \u7f16\u7801\u6587\u672c\u4f18\u5316\u7684\u4e8c\u8fdb\u5236\u7f16\u7801\u3002";
        this.infoURL = "https://github.com/qntm/base32768"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
        this.inputType = "byteArray";
        this.outputType = "string";
        this.args = [
            /* Example arguments. See the project wiki for full details.
            {
                name: "First arg",
                type: "string",
                value: "Don't Panic"
            },
            {
                name: "Second arg",
                type: "number",
                value: 42
            }
            */
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return encode(input);
    }

}

export default ToBase32768;
