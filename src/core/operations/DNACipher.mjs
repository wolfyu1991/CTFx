/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { Decode, Encode } from "../lib/DNACipher.mjs";
// import OperationError from "../errors/OperationError.mjs";

/**
 * DNA Cipher operation
 */
class DNACipher extends Operation {

    /**
     * DNACipher constructor
     */
    constructor() {
        super();

        this.name = "DNA Cipher";
        this.module = "CTF";
        this.description = "A simple script to decode the genome DNA binary sequence (CTF Challenge)";
        this.infoURL = "https://github.com/karma9874/DNA-Cipher-Script-CTF"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "mode",
                type: "option",
                value: ["Decode", "Encode"]
            }
        ];
        this.checks = [
            {
                pattern: "^[ ACGT\r\n]{12,}$",
                flags: "i",
                args: ["Decode"]
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
        if (args[0] === "Encode") {
            return Encode(input);
        }
        return Decode(input);
    }

}

export default DNACipher;
