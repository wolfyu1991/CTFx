/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {rot, rotl, rotlCarry} from "../lib/Rotate.mjs";


/**
 * Rotate left operation.
 */
class RotateLeft extends Operation {

    /**
     * RotateLeft constructor
     */
    constructor() {
        super();

        this.name = "循环左移";
        this.module = "Default";
        this.description = "将每个字节循环左移指定的位数，可选地将多余的位到下一个字节中。目前仅支持8-bit值。";
        this.infoURL = "https://wikipedia.org/wiki/Bitwise_operation#Bit_shifts";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.args = [
            {
                name: "Amount",
                type: "number",
                value: 1
            },
            {
                name: "Carry through",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        if (args[1]) {
            return rotlCarry(input, args[0]);
        } else {
            return rot(input, args[0], rotl);
        }
    }

    /**
     * Highlight rotate left
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight rotate left in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }
}

export default RotateLeft;
