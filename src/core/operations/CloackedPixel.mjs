/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { fromBinary } from "../lib/Binary.mjs";
import { isImage } from "../lib/FileType.mjs";
import jimp from "jimp";
import forge from "node-forge";
import Sha256 from "crypto-api/src/hasher/sha256.mjs";

/**
 * Extract LSB operation
 */
class CloackedPixel extends Operation {

    /**
     * CloackedPixel constructor
     */
    constructor() {
        super();

        this.name = "Cloacked Pixel";
        this.module = "CTF";
        this.description = "图片LSB隐写，提取图像中每个像素的最低有效位数据。这是在隐写术中隐藏数据的一种常见方法。支持文件格式：<code>PNG</code>";
        this.infoURL = "https://github.com/livz/cloacked-pixel";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Password",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Latin1", "UTF8", "Hex", "Base64"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    assemble(bytesData) {
        const payloadSizeBytes = new Uint8Array(bytesData.slice(0, 4));
        const payloadSize = new DataView(payloadSizeBytes.buffer).getUint32(0, true);

        if ((payloadSize - 16) % 32 === 0) {
            // Extract the payload data from the byte array
            const payloadIV = bytesData.slice(4, 20);
            const payloadData = bytesData.slice(20, payloadSize + 4);

            return [payloadIV, payloadData];
        } else {
            throw new OperationError("图像负载的AES信息大小不为32的倍数, 所以不存在该隐写!");
        }


    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        if (!isImage(input)) throw new OperationError("请提供有效的图像文件。");

        const password = Utils.convertToByteString(args[0].string, args[0].option),
            bit = 7,
            colours = [0, 1, 2],
            parsedImage = await jimp.read(input),
            rgba = parsedImage.bitmap.data;

        let i, combinedBinary = "";

        for (i = 0; i < rgba.length; i += 4) {
            for (const colour of colours) {
                combinedBinary += Utils.bin(rgba[i + colour])[bit];
            }
        }

        const hasher = new Sha256();
        hasher.update(password);
        const key = hasher.finalize();

        const [payloadIV, payloadData] = this.assemble(fromBinary(combinedBinary));

        const decipher = forge.cipher.createDecipher("AES-CBC", key);

        decipher.start({
            iv: payloadIV
        });

        decipher.update(forge.util.createBuffer(Utils.byteArrayToChars(payloadData)));
        const result = decipher.finish();

        if (result) {
            // return outputType === "Hex" ? decipher.output.toHex() : decipher.output.getBytes();
            return decipher.output.getBytes();
        } else {
            throw new OperationError("解密失败，请检查参数。");
        }
    }

}

export default CloackedPixel;
