/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { encode } from "../lib/Base2048.mjs";

/**
 * To Base2048 operation
 */
class ToBase2048 extends Operation {

    /**
     * ToBase2048 constructor
     */
    constructor() {
        super();

        this.name = "To Base2048";
        this.module = "CTF";
        this.description = "Base2048\u7f16\u7801";
        this.infoURL = "https://github.com/qntm/base2048"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
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

export default ToBase2048;
