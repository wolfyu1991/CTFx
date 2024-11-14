/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { encode } from "../lib/JSFuck.mjs";

/**
 * JSFuck operation
 */
class JSFuck extends Operation {

    /**
     * JSFuck constructor
     */
    constructor() {
        super();

        this.name = "JSFuck";
        this.module = "CTF";
        this.description = "JSFuck \u662f\u4e00\u79cd\u57fa\u4e8e JavaScript \u7279\u6027\u7684\u6df7\u6dc6\u4e14\u6559\u80b2\u6027\u7684\u7f16\u7a0b\u98ce\u683c\u3002\u5b83\u4ec5\u4f7f\u7528\u516d\u4e2a\u4e0d\u540c\u7684\u5b57\u7b26\u6765\u7f16\u5199\u548c\u6267\u884c\u4ee3\u7801\u3002";
        this.infoURL = "https://jsfuck.com/"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
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
                pattern: "^[[\\]()!+]{10,}$",
                flags: "i",
                args: ["Decode"]
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
        if (!input) throw new OperationError("");
        if (args[0] === "Encode") {
            return encode(input);
        }
        return this.decode(input);

    }

    /**
     *
     */
    patternCreator(prefix, postfix) {
        const replacedPrefix = prefix.replace(/[[\]()+!]/g, "\\$&");
        const replacedPostfix = postfix.replace(/[[\]()+!]/g, "\\$&");

        return replacedPrefix + "(.*)" + replacedPostfix;
    }

    /**
     *
     */
    isMatching(string, pattern) {
        const result = string.match(new RegExp(pattern));
        if (result) return result[1];

        return null;
    }

    /**
     *
     */
    setDecoded(decodedCode) {
        // eslint-disable-next-line no-eval
        return eval(decodedCode);;
    }

    /**
     *
     */
    decode(code) {

        const functionNames = ["flat", "fill", "filter"];
        let prefix = "";
        let postfix = "";
        let result = null;

        for (let i = 0; i < functionNames.length; i++) {
            const functionName = functionNames[i];

            if (functionName !== "filter") {
                prefix = "[][" + encode(functionName) + "]" +
                    "[" + encode("constructor") + "]" +
                    "(" + encode("return eval") + ")()(";
                postfix = ")";
                result = this.isMatching(code, this.patternCreator(prefix, postfix));

                if (result) {
                    return this.setDecoded(result);
                }
            }

            prefix = "[][" + encode(functionName) + "]" +
                "[" + encode("constructor") + "](";
            postfix = ")()";
            result = this.isMatching(code, this.patternCreator(prefix, postfix));

            if (result) {
                return this.setDecoded(result);
            }
        }

    }

}

export default JSFuck;
