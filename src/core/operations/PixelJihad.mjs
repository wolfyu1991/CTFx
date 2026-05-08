/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isImage } from "../lib/FileType.mjs";
import Jimp from "jimp/es/index.js";
import sjcl from "sjcl";

/**
 * PixelJihad operation
 */
class PixelJihad extends Operation {

    /**
     * PixelJihad constructor
     */
    constructor() {
        super();

        this.name = "PixelJihad";
        this.module = "CTF";
        this.description = "PixelJihad \u662f\u4e00\u4e2a JavaScript \u9690\u5199\u5de5\u5177\u3002";
        this.infoURL = "https://github.com/oakes/PixelJihad"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Password",
                type: "string",
                value: ""
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        if (!isImage(input)) throw new OperationError("请输入一个有效的图片文件！");

        const password = args[0];
        const passwordFail = "密码错误或隐写不存在！";
        if (password === "") throw new OperationError(passwordFail);
        const parsedImage = await Jimp.read(input);
        const bitmap = parsedImage.bitmap.data;
        const message = this.decodeMessage(bitmap, sjcl.hash.sha256.hash(password));

        // return sjcl.decrypt(password, message);
        // try to parse the JSON
        let obj = null;
        try {
            obj = JSON.parse(message);
        } catch (e) {
            if (password.length > 0) {
                throw new OperationError(passwordFail);
            }
        }

        // display the "reveal" view
        if (obj) {
            // decrypt if necessary
            if (obj.ct) {
                try {
                    obj.text = sjcl.decrypt(password, message);
                } catch (e) {
                    throw new OperationError(passwordFail);
                }
            }
            return obj.text;
        }
    }

    // returns a 1 or 0 for the bit in 'location'
    getBit = function (number, location) {
        return ((number >> location) & 1);
    };

    // sets the bit in 'location' to 'bit' (either a 1 or 0)
    setBit = function (number, location, bit) {
        return (number & ~(1 << location)) | (bit << location);
    };
    // returns the next 2-byte number
    getNumberFromBits = function (bytes, history, hash) {
        let number = 0, pos = 0;
        while (pos < 16) {
            const loc = this.getNextLocation(history, hash, bytes.length);
            const bit = this.getBit(bytes[loc], 0);
            number = this.setBit(number, pos, bit);
            pos++;
        }
        return number;
    };

    // gets the next location to store a bit
    getNextLocation = function (history, hash, total) {
        const pos = history.length;
        let loc = Math.abs(hash[pos % hash.length] * (pos + 1)) % total;
        while (true) {
            if (loc >= total) {
                loc = 0;
            } else if (history.indexOf(loc) >= 0) {
                loc++;
            } else if ((loc + 1) % 4 === 0) {
                loc++;
            } else {
                history.push(loc);
                return loc;
            }
        }
    };

    // returns the message encoded in the CanvasPixelArray 'colors'
    decodeMessage = function (colors, hash) {
        // this will store the color values we've already read from
        const history = [];

        // get the message size
        const messageSize = this.getNumberFromBits(colors, history, hash);

        // exit early if the message is too big for the image
        if ((messageSize + 1) * 16 > colors.length * 0.75) {
            return "";
        }

        // artificially limit the message size
        const maxMessageSize = 1000;
        // exit early if the message is above an artificial limit
        if (messageSize === 0 || messageSize > maxMessageSize) {
            return "";
        }

        // put each character into an array
        const message = [];
        for (let i = 0; i < messageSize; i++) {
            const code = this.getNumberFromBits(colors, history, hash);
            message.push(String.fromCharCode(code));
        }

        // the characters should parse into valid JSON
        return message.join("");
    };

}

export default PixelJihad;
