/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { decode } from "../lib/Base100.mjs";
// import OperationError from "../errors/OperationError.mjs";

/**
 * From Base100 operation
 */
class FromBase100 extends Operation {

    /**
     * FromBase100 constructor
     */
    constructor() {
        super();

        this.name = "From Base100";
        this.module = "CTF";
        this.description = "Encode things into Emoji.";
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
        this.checks = [
            {
                pattern: "^[\u{1F3F7}-\u{1F4F6}]{8,}$",
                flags: "u",
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
        return decode(input);
        // const [firstArg, secondArg] = args;

        // throw new OperationError("Test");
    }

}

export default FromBase100;
