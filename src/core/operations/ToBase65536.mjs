/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { encode } from "../lib/Base65536.mjs";

/**
 * To Base65536 operation
 */
class ToBase65536 extends Operation {

    /**
     * ToBase65536 constructor
     */
    constructor() {
        super();

        this.name = "To Base65536";
        this.module = "CTF";
        this.description = "Base65536\u89e3\u7801";
        this.infoURL = "https://github.com/qntm/base65536"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
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

export default ToBase65536;
