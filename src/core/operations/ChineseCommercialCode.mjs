/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
// import OperationError from "../errors/OperationError.mjs";
import {encode, decode} from "../lib/ChineseCommercialCode.mjs";

/**
 * ChineseCommercialCode operation
 */
class ChineseCommercialCode extends Operation {

    /**
     * ChineseCommercialCode constructor
     */
    constructor() {
        super();

        this.name = "中文电码";
        this.module = "CTF";
        this.description = "Chinese Commercial Code 中文电码，又称中文商用电码、中文电报码或中文电报明码，原本是于电报之中传送中文信息的方法。它是第一个把汉字化作电子讯号的编码表。如果查询不到则返回****、[]。";
        this.infoURL = "https://zh.m.wikipedia.org/wiki/%E7%94%B5%E6%8A%A5%E7%A0%81";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "MODE",
                type: "option",
                value: ["Decode", "Encode"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (!input) return "";
        if (args[0] === "Decode") {
            return decode(input);
        } else {
            return encode(input);
        }

        // throw new OperationError("Test");
    }

}

export default ChineseCommercialCode;
