/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runBrainFuck} from "../lib/Brainfuck.mjs";

/**
 * Ook operation
 */
class Ook extends Operation {

    /**
     * Ook constructor
     */
    constructor() {
        super();

        this.name = "Ook!";
        this.module = "CTF";
        this.description = "";
        this.infoURL = "https://www.splitbrain.org/services/ook"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            /* Example arguments. See the project wiki for full details.
            {
                name: "First arg",
                type: "string",
                value: "Don"t Panic"
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
                pattern: "^[ .!?]{20,}$",
                flags: "i",
                args: []
            },
            {
                pattern: "^[Ook .!?]{20,}$",
                flags: "i",
                args: []
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        // const [firstArg, secondArg] = args;

        const lookup = {
            ".?": ">",
            "?.": "<",
            "..": "+",
            "!!": "-",
            "!.": ".",
            ".!": ",",
            "!?": "[",
            "?!": "]"
        };
        input = input.replace(/[^\\.?!]+/g, "");
        const len = input.length;
        let output = "";
        for (let i = 0; i < len - 1; i += 2) {
            output += lookup[input[i] + input[i + 1]];
        }

        return runBrainFuck(output);
    }
}

export default Ook;
