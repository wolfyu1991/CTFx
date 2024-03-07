/**
 * @author Raka-loah [i@lotc.cc]
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Roar Cipher operation
 */
class RoarCipher extends Operation {

    /**
     * RoarCipher constructor
     */
    constructor() {
        super();

        this.name = "兽音译者";
        this.module = "CTF";
        this.description = "把各种“嗷呜啊”解密为原始文本，把输入的文本加密为各种“嗷呜啊”，支持自定义字典。";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "模式",
                type: "option",
                value: ["解密", "加密"]
            },
            {
                name: "字典(4个字符)",
                type: "editableOption",
                value: [
                    {
                        name: "默认",
                        value: "嗷呜啊~"
                    },
                    {
                        name: "自定义",
                        value: ""
                    }
                ]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [mode, alphabet] = args;

        if (alphabet.length !== 4) {
            throw new OperationError("错误：字典长度必须为4个字符！");
        }

        if (mode === "解密") {
            if (input.length <= 5) {
                throw new OperationError("错误：密文长度必须大于5个字符！");
            }

            const alphaList = alphabet.split("");
            const roarChunks = input.substring(3, input.length - 1).match(/.{2}/g);

            const rawHex = roarChunks.reduce(function (rawStr, roarChunk, currentIndex) {
                const roarValue1 = alphaList.indexOf(roarChunk[0]);
                const roarValue2 = alphaList.indexOf(roarChunk[1]);

                if (roarValue1 === -1 || roarValue2 === -1) {
                    throw new OperationError("错误：密文中包含不在字典中的字符！");
                }

                let temp = roarValue1 * 4 + roarValue2 - currentIndex % 0x10;
                if (temp < 0) {
                    temp += 0x10;
                }

                rawStr += temp.toString(16);

                return rawStr;
            }, "");

            const raw = rawHex.match(/.{4}/g).reduce((rawStr, hexChunk) => rawStr + String.fromCharCode(parseInt("0x" + hexChunk, 16)), "");
            return raw;
        } else {
            if (input.length === 0) {
                return "";
            }

            const alphaList = alphabet.split("");
            const hexInput = input.split("").map(character => character.charCodeAt(0).toString(16).padStart(4, "0")).join("");
            const roar = hexInput.split("").reduce(function (roarStr, hexStr, currentIndex) {
                let temp = 0;
                temp = parseInt("0x" + hexStr, 16) + currentIndex % 0x10;
                if (temp >= 0x10) {
                    temp -= 0x10;
                }
                roarStr += alphaList[parseInt(temp / 4, 10)] + alphaList[temp % 4];
                return roarStr;
            }, "");

            return alphaList[3] + alphaList[1] + alphaList[0] + roar + alphaList[2];
        }

    }
}

export default RoarCipher;
