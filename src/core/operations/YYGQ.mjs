/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * YYGQ operation
 */
class YYGQ extends Operation {

    /**
     * YYGQ constructor
     */
    constructor() {
        super();

        this.name = "阴阳怪气";
        this.module = "CTF";
        this.description = "\u9634\u9633\u602a\u6c14\u7f16\u7801";
        this.infoURL = "https://github.com/mmdjiji/yygq.js"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
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
                pattern: "^((就 这 ¿ |不 会 吧 ？ )+)$",
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
        if (!input) return "";
        const wordList = ["就 这 ¿ ", "不 会 吧 ？ "];
        if (args[0] === "Encode") {
            let retval = "";
            for (let i = 0; ; i++) {
                const charCode = input.charCodeAt(i);
                if (isNaN(charCode)) break;
                const binaryStr = charCode.toString(2);
                if (charCode < 127) {
                    retval += "0" + binaryStr.padStart(8, "0");
                } else {
                    retval += "1" + binaryStr.padStart(16, "0");
                }
            }
            retval = retval.replace(/./g, i => wordList[i]);
            return retval;
        }

        let retval = "";
        const regList = wordList.map(x => x.replace(/\s/g, ""));
        let src = input.replace(/\s/g, "");
        src = [...src].filter(x => wordList.join("").split(" ").includes(x)).join("");
        src = src.match(RegExp(regList.join("|"), "g")).map(i => regList.indexOf(i)).join("");
        for (let i = 0; i + 8 < src.length; i++) {
            if (src[i] === "0") {
                retval += String.fromCharCode(parseInt(src.substr(i + 1, 8), 2));
                i += 8;
            } else if (src[i] === "1") {
                if (i + 16 < src.length) {
                    retval += String.fromCharCode(parseInt(src.substr(i + 1, 16), 2));
                    i += 16;
                } else break;
            } else break;
        }
        return retval;
    }

}

export default YYGQ;
