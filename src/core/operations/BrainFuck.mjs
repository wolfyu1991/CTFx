/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
// import OperationError from "../errors/OperationError.mjs";
import {runBrainFuck} from "../lib/Brainfuck.mjs";

/**
 * BrainFuck operation
 */
class BrainFuck extends Operation {

    /**
     * BrainFuck constructor
     */
    constructor() {
        super();

        this.name = "BrainFuck";
        this.module = "CTF";
        this.description = "Brainfuck，简称BF，是一种极小化的程序语言，由Urban Müller在1993年创造。Fuck在英语中是脏话，所以这种语言有时称为Brainf*ck或Brainf***，或者只用简称。";
        this.infoURL = "https://zh.wikipedia.org/wiki/Brainfuck";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "input",
                type: "string",
                value: ""
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
        return runBrainFuck(input, args[0]);
        // throw new OperationError("Test");
    }

}

export default BrainFuck;
