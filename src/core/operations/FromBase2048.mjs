/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { decode } from "../lib/Base2048.mjs";

/**
 * From Base2048 operation
 */
class FromBase2048 extends Operation {

    /**
     * FromBase2048 constructor
     */
    constructor() {
        super();

        this.name = "From Base2048";
        this.module = "CTF";
        this.description = "Base2048\u7f16\u7801";
        this.infoURL = "https://github.com/qntm/base2048"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
        this.inputType = "string";
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
        this.checks = [
            {
                pattern: "^[\xb5\xba\xc0-\xff\u0100-\u{ffff}]{8,}$",
                flags: "",
                args: []
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const output = decode(input);
        return Utils.byteArrayToUtf8(output);
    }

}

export default FromBase2048;
