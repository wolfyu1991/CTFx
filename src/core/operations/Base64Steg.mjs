/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
// import OperationError from "../errors/OperationError.mjs";

/**
 * Base64Steg operation
 */
class Base64Steg extends Operation {

    /**
     * Base64Steg constructor
     */
    constructor() {
        super();

        this.name = "Base64隐写";
        this.module = "CTF";
        this.description = "Base64的编码过程就是将文本字符对应成二进制后，再六个一组对应成索引，转为编码字符。如果字符串长度不是3的 倍数，则对应的二进制位数不是6的倍数，需要在末尾用0填充。若剩1个字符则在编码结果后加2个‘=’；若剩2个字符则 加1个‘=’。\nBase64的解码过程，即先丢弃编码后面的‘=’，然后将每个base64字符对应索引转为6bit的二进制数，再8个一组转为ASCII码字符完成解码，最后若剩下不足8位的，则全部丢弃。\n所以某些bit位在解码时会被丢弃，换句话说，这些bit值不会对解码结果产生影响。一个简单直观的例子就是QUJDRA和QUJDRC解码后都是ABCD。由此我们便可以将隐藏信息插入这些bit位中实现隐写。\n一串Base64的编码最多也只有4bit的隐写空间，所以实现隐写往往需要大量编码串。隐写时把明文的每个字符用8位二进制数表示，由此将整个明文串转为bit串，按顺序填入Base64编码串的可隐写位中即可实现隐写。";
        this.infoURL = "https://github.com/Mz1z/b64steg/blob/master/b64steg/B64steger.py";
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
     * @param {string} text
     * @param {Object[]} args
     * @returns {string}
     */
    b64steg(encodedText) {
        // 解隐写
        // 行之间用\n分割
        const chunkSizeEnd = encodedText.indexOf("\n") + 1;
        const lineEndings = encodedText.charAt(chunkSizeEnd - 2) === "\r" ? "\r\n" : "\n";
        const texts = encodedText.split(lineEndings);
        let decodedBinary = "";
        const b64Table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

        for (const text of texts) {
            if (text.includes("==")) {
                // 隐写4bit
                decodedBinary += ("0000" + b64Table.indexOf(text.slice(-3, -2)).toString(2)).slice(-4);
            } else if (text.includes("=")) {
                // 隐写2bit
                decodedBinary += ("00" + b64Table.indexOf(text.slice(-2, -1)).toString(2)).slice(-2);
            } else {
                continue;
            }
        }

        // 将二进制数据转换为字节串
        let decodedText = "";
        for (let i = 0; i < decodedBinary.length; i += 8) {
            const _char = String.fromCharCode(parseInt(decodedBinary.slice(i, i + 8), 2));
            decodedText += _char;
        }

        return decodedText;
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        // const [firstArg, secondArg] = args;

        // throw new OperationError("Test");
        return this.b64steg(input);
    }

}

export default Base64Steg;
