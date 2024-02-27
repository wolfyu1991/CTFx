/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import CryptoJS from "crypto-js";
// import { format } from "../lib/Ciphers.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * emoji-aes operation
 */
class EmojiAES extends Operation {

    /**
     * EmojiAES constructor
     */
    constructor() {
        super();

        this.name = "emoji-aes";
        this.module = "CTF";
        this.description = "emoji-aes使用对称AES加密算法（使用crypto-js），对字符串数据进行加密，然后将Base64输出替换为表情符号。";
        this.infoURL = "https://aghorler.github.io/emoji-aes/#encrypt";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Type",
                "type": "option",
                "value": ["Decrypt", "Encrypt"]
            },
            {
                "name": "Key",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["UTF8", "UTF16", "UTF16LE", "UTF16BE", "Latin1", "Hex", "Base64"]
            },
            {
                name: "Rotation",
                type: "number",
                value: 0
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const emojisInit = ["🍎", "🍌", "🏎", "🚪", "👁", "👣", "😀", "🖐", "ℹ", "😂", "🥋", "✉", "🚹", "🌉", "👌", "🍍", "👑", "👉", "🎤", "🚰", "☂", "🐍", "💧", "✖", "☀", "🦓", "🏹", "🎈", "😎", "🎅", "🐘", "🌿", "🌏", "🌪", "☃", "🍵", "🍴", "🚨", "📮", "🕹", "📂", "🛩", "⌨", "🔄", "🔬", "🐅", "🙃", "🐎", "🌊", "🚫", "❓", "⏩", "😁", "😆", "💵", "🤣", "☺", "😊", "😇", "😡", "🎃", "😍", "✅", "🔪", "🗒"];
        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";

        const type = args[0],
            key = args[1].string,
            message = input,
            rotation = args[2];

        // Create a mapping for characters a-z, A-Z, 0-9, +, /, and =
        const charMap = {};

        /* Verify that message and key are not blank. */
        if (message !== "" && key !== "") {
            /* Verify that rotation is between 0 and 64. */
            if (rotation >= 0 && rotation <= 64) {
                /* Rotate emoji setting if customised. */
                const emojis = rotation !== 0 ? emojisInit.map((_, i) => emojisInit[(i + rotation) % emojisInit.length]) : [...emojisInit];
                if (type === "Decrypt") {
                    // 解密函数
                    for (let i = 0; i < characters.length; i++) {
                        charMap[emojis[i]] = characters[i];
                    }
                    // 构建正则表达式，用于匹配所有表情符号
                    const emojiRegex = new RegExp(emojis.join("|"), "g");
                    // Replace characters using the mapping
                    const unemojified = message.replace(emojiRegex, match => charMap[match]);
                    /* Decrypt Base64 string. */
                    const plaintext = CryptoJS.AES.decrypt(unemojified, key).toString(CryptoJS.enc.Utf8);
                    return plaintext;
                } else {
                    // 加密函数
                    const encrypted = CryptoJS.AES.encrypt(message, key).toString();
                    for (let i = 0; i < characters.length; i++) {
                        charMap[characters[i]] = emojis[i];
                    }
                    // Replace characters using the mapping
                    const emojified = encrypted.replace(/[a-zA-Z0-9+/=]/g, match => charMap[match]);

                    // Encrypt the message and return the result
                    return emojified;
                }
            } else {
                /* Display invalid rotation error. */
                throw new OperationError("错误：Rotation必须介于0和64之间。");
            }
        } else {
            /* Display blank message and/or key error. */
            throw new OperationError("错误：输入和密钥不能为空。");
        }

    }

}

export default EmojiAES;
