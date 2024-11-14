/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { loadVM, exec, WANTS_INPUT } from "../lib/Malbolge.mjs";

/**
 * Malbolge operation
 */
class Malbolge extends Operation {

    /**
     * Malbolge constructor
     */
    constructor() {
        super();

        this.name = "Malbolge";
        this.module = "CTF";
        this.description = "Malbolge\u662F\u7531Ben Olmstead\u57281998\u5E74\u5F00\u53D1\u7684\u4E00\u79CD\u6DF1\u5965\u7684\u7F16\u7A0B\u8BED\u8A00\uFF0C\u5C5E\u4E8E\u516C\u5171\u9886\u57DF\u3002\u5176\u540D\u5B57\u6765\u81EA\u4E8E\u4F46\u4E01\u7684\u300A\u795E\u66F2\u300B\u4E2D\u7684\u7B2C\u516B\u5C42\u5730\u72F1Malebolge\uFF0C\u610F\u5927\u5229\u8BED\u4E2D\u610F\u4E3A\u201C\u90AA\u6076\u7684\u6C9F\u6E20\u201D\uFF08male bolge\uFF09\u3002Malbolge\u867D\u7136\u5177\u5907\u56FE\u7075\u5B8C\u5907\u6027\uFF0C\u4F46\u5E76\u975E\u5B9E\u7528\u7684\u7F16\u7A0B\u8BED\u8A00\u3002Malbolge\u7684\u7279\u522B\u4E4B\u5904\u5C31\u5728\u4E8E\uFF0C\u5B83\u88AB\u6545\u610F\u8BBE\u8BA1\u5F97\u6781\u5176\u7E41\u7410\u96BE\u89E3\u3002";
        this.infoURL = "https://zh.wikipedia.org/wiki/Malbolge"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
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
                pattern: "^D'`[!\"#$%&'()*+,\\-./0-9:;<=>?@A-Z[\\]^_`{|}~\\\\]{10,}$",
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
        const vm = loadVM(input);

        let result = "";

        try {
            // For simple code execution, use the exec function
            // exec function executes the VM and returns the output
            result = exec(vm);
        } catch (e) {
            // When it fails, it will throw an error message
            // or WANTS_INPUT if it would wait for user input
            if (e === WANTS_INPUT)
                throw new OperationError("错误：需要用户输入，请使用 malbolge-tools 调试！");
            else
                throw new OperationError("错误：" + e);
        }

        return result;
    }

}

export default Malbolge;
