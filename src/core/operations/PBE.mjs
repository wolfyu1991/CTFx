/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import CryptoJS from "crypto-js";
import { format } from "../lib/Ciphers.mjs";

/**
 * PBE operation
 */
class PBE extends Operation {

    /**
     * PBE constructor
     */
    constructor() {
        super();

        this.name = "PBE";
        this.module = "CTF";
        this.description = "PBE\uff08Password-Based Encryption\uff0c\u57fa\u4e8e\u5bc6\u7801\u7684\u52a0\u5bc6\uff09\u662f\u4e00\u79cd\u52a0\u5bc6\u6280\u672f\uff0c\u5b83\u4f7f\u7528\u5bc6\u7801\uff08\u6216\u53eb\u53e3\u4ee4\uff09\u6765\u52a0\u5bc6\u548c\u89e3\u5bc6\u6570\u636e\u3002\u5bc6\u6587\u7279\u5f81: \u5bc6\u6587\u5e38\u4ee5 U2FsdGVkX1 \u5f00\u5934, base64\u89e3\u7801\u4e3a Salted__";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "json";
        this.presentType = "html";
        this.args = [
            {
                name: "MODE",
                type: "option",
                value: ["Decrypt", "Encrypt"]
            },
            {
                "name": "Encrypt type",
                "type": "option",
                "value": ["ALL", "AES", "DES", "TripleDES", "Rabbit", "RabbitLegacy", "RC4", "RC4Drop"]
            },
            {
                "name": "Passphrase",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["UTF8", "UTF16", "UTF16LE", "UTF16BE", "Latin1", "Hex", "Base64"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const mode = args[0],
            type = args[1],
            passphrase = args[2].string,
            outformat = format.Latin1,
            charsets = ["AES", "DES", "TripleDES", "Rabbit", "RabbitLegacy", "RC4", "RC4Drop"];
        if (mode === "Decrypt") {
            if (type === "ALL") {
                const output = {};
                charsets.forEach(charset => {
                    try {
                        output[charset] = CryptoJS[charset].decrypt(input, passphrase).toString(outformat);
                    } catch (err) {
                        output[charset] = "解密失败！";
                    }
                });
                return this.buildTable(output);
            } else {
                const decrypted = CryptoJS[type].decrypt(input, passphrase);
                return decrypted.toString(outformat);
            }
        } else {
            if (type === "ALL") {
                const output = {};
                charsets.forEach(charset => {
                    try {
                        output[charset] = CryptoJS[charset].encrypt(input, passphrase).toString();
                    } catch (err) {
                        output[charset] = "加密失败！";
                    }
                });
                return this.buildTable(output);
            } else {
                const decrypted = CryptoJS[type].encrypt(input, passphrase);
                return decrypted.toString();
            }
        }

    }

    /**
     * Displays the encodings in an HTML table for web apps.
     *
     * @param {Object[]} encodings
     * @returns {html}
     */
    buildTable(encodings) {
        let table = "<table class='table table-hover table-sm table-bordered table-nonfluid'><tr><th>Type</th><th>Value</th></tr>";

        for (const enc in encodings) {
            const value = Utils.escapeHtml(Utils.escapeWhitespace(encodings[enc]));
            table += `<tr><td>${enc}</td><td>${value}</td></tr>`;
        }

        table += "<table>";
        return table;
    }

}

export default PBE;
