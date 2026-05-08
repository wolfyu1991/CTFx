/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {pduDecoder} from "../lib/PDUDecoder.mjs";


/**
 * PDU operation
 */
class PDU extends Operation {

    /**
     * PDU constructor
     */
    constructor() {
        super();

        this.name = "短信PDU编码";
        this.module = "CTF";
        this.description = "使用GSM/GPRS AT指令发送中文短信，汉字时，需要先将短信内容编码成PDU格式，然后通过AT+CMGS AT+CMGW等指令发送。";
        this.infoURL = "http://www.sendsms.cn/pdu/";
        this.inputType = "string";
        this.outputType = "string";
        this.presentType = "html";
        this.args = [
            {
                name: "仅包含用户数据",
                type: "argSelector",
                value: [
                    {
                        name: "否",
                        off: [1, 2]
                    },
                    {
                        name: "是",
                        on: [1, 2]
                    }
                ]
            },
            {
                name: "字符集",
                type: "option",
                value: ["GSM 7-Bit", "Unicode UCS2", "8 Bit binary Data"]
            },
            {
                name: "用户数据标头",
                type: "boolean",
                value: false
            }
        ];
        // this.checks = [
        //     {
        //         pattern: "^[富强|民主|文明|和谐|自由|平等|公正|法治|爱国|敬业|诚信|友善]*$",
        //         flags: "g",
        //         args: ["Decode"]
        //     },
        // ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (!input) return "";
        const UdOnly = args[0] === "是",
            alphabet = args[1],
            uhdi = args[2];

        let prefix = "00",
            pdu = input,
            len;

        if (UdOnly) {
            if (uhdi) {
                prefix += "41";
            } else {
                prefix += "01";
            }
            prefix += "000000";

            if (alphabet === "GSM 7-Bit") {
                prefix += "00";
            } else if (alphabet === "Unicode UCS2") {
                prefix += "08";
            } else if (alphabet === "8 Bit binary Data") {
                prefix += "04";
            }

            len = (pdu.length / 2).toString(16);
            prefix += len.length < 2 ? "0" + len : len;
            pdu = prefix + pdu;
        }

        return constructOutput(pdu);
    }

}

/**
 * Constructs the HTML markup with the information derived from two decoders.
 *
 * @param {string} pdu Contains the PDU decoded SMS
 * @return {string} HTML markup
 */
function constructOutput(pdu) {

    let i;
    const info = "";

    const data = pduDecoder(pdu);

    let datastr = "";

    if (typeof data === "object") {
        for (i = 0; i < data.length; ++i) {
            datastr += "<tr><td>" + data[i].replace(/\t/, "</td><td>") + "</td></tr>";
        }
    } else {
        // Probably an error text instead of decoded PDU information
        datastr = "<tr><td>" + data + "</td></tr>";
    }

    datastr = datastr.replace(/><td>\(hideable\)/g, " class=\"hideable\"><td>");

    return "<p>" + info.replace(/\n/g, "<br />") + "</p><table class=\"data\"><tbody>" + datastr + "</tbody></table>";
}

export default PDU;
