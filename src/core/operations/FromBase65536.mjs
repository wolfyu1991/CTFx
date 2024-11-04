/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { decode } from "../lib/Base65536.mjs";

/**
 * From Base65536 operation
 */
class FromBase65536 extends Operation {

    /**
     * FromBase65536 constructor
     */
    constructor() {
        super();

        this.name = "From Base65536";
        this.module = "CTF";
        this.description = "Base65536\u7F16\u7801";
        this.infoURL = "https://github.com/qntm/base65536"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
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
                pattern: "^[^\x00-\u1500]{8,}$",
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

export default FromBase65536;
