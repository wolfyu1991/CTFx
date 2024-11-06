/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { encode } from "../lib/Base100.mjs";

/**
 * To Base100 operation
 */
class ToBase100 extends Operation {

    /**
     * ToBase100 constructor
     */
    constructor() {
        super();

        this.name = "To Base100";
        this.module = "CTF";
        this.description = "Decode Emoji to string.";
        this.infoURL = "https://github.com/AdamNiederer/base100"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
        this.inputType = "string";
        this.outputType = "byteArray";
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

export default ToBase100;
