/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
// import OperationError from "../errors/OperationError.mjs";

/**
 * BaiJiaXing operation
 */
class BaiJiaXing extends Operation {

    /**
     * BaiJiaXing constructor
     */
    constructor() {
        super();

        this.name = "百家姓编码";
        this.module = "CTF";
        this.description = "\u767e\u5bb6\u59d3\u7f16\u7801\uff1a\u5c06\u5b57\u7b26\u4e32\u66ff\u6362\u6210\u5bf9\u5e94\u7684\u767e\u5bb6\u59d3\u6c49\u5b57";
        this.infoURL = "https://github.com/xiang0818/jsurl/blob/main/bjx.js";
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
                pattern: "^[赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻福水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳唐罗薛伍余米贝姚孟顾尹江钟]+$",
                flags: "g",
                args: ["Decode"]
            },
        ];
    }

    /**
     * @param {string} bjx
     * @param {Object[]} args
     * @returns {string}
     */
    bjx2text(bjx) {
        const str = bjx.replace(/^\s\s*/, "").replace(/\s\s*$/, "").split("");
        const obja = {
            "赵": "0", "钱": "1", "孙": "2", "李": "3", "周": "4", "吴": "5",
            "郑": "6", "王": "7", "冯": "8", "陈": "9", "褚": "a", "卫": "b",
            "蒋": "c", "沈": "d", "韩": "e", "杨": "f", "朱": "g", "秦": "h",
            "尤": "i", "许": "j", "何": "k", "吕": "l", "施": "m", "张": "n",
            "孔": "o", "曹": "p", "严": "q", "华": "r", "金": "s", "魏": "t",
            "陶": "u", "姜": "v", "戚": "w", "谢": "x", "邹": "y", "喻": "z",
            "福": "A", "水": "B", "窦": "C", "章": "D", "云": "E", "苏": "F",
            "潘": "G", "葛": "H", "奚": "I", "范": "J", "彭": "K", "郎": "L",
            "鲁": "M", "韦": "N", "昌": "O", "马": "P", "苗": "Q", "凤": "R",
            "花": "S", "方": "T", "俞": "U", "任": "V", "袁": "W", "柳": "X",
            "唐": "Y", "罗": "Z", "薛": ".", "伍": "-", "余": "_", "米": "+",
            "贝": "=", "姚": "/", "孟": "?", "顾": "#", "尹": "%", "江": "&",
            "钟": "*"
        };
        let c = "";
        for (const i of str) {
            c += obja[i] || i;
        }

        return c;
    }

    /**
     * @param {string} text
     * @param {Object[]} args
     * @returns {string}
     */
    text2bjx(text) {
        const obja = {
            "0": "赵", "1": "钱", "2": "孙", "3": "李", "4": "周", "5": "吴",
            "6": "郑", "7": "王", "8": "冯", "9": "陈", "a": "褚", "b": "卫",
            "c": "蒋", "d": "沈", "e": "韩", "f": "杨", "g": "朱", "h": "秦",
            "i": "尤", "j": "许", "k": "何", "l": "吕", "m": "施", "n": "张",
            "o": "孔", "p": "曹", "q": "严", "r": "华", "s": "金", "t": "魏",
            "u": "陶", "v": "姜", "w": "戚", "x": "谢", "y": "邹", "z": "喻",
            "A": "福", "B": "水", "C": "窦", "D": "章", "E": "云", "F": "苏",
            "G": "潘", "H": "葛", "I": "奚", "J": "范", "K": "彭", "L": "郎",
            "M": "鲁", "N": "韦", "O": "昌", "P": "马", "Q": "苗", "R": "凤",
            "S": "花", "T": "方", "U": "俞", "V": "任", "W": "袁", "X": "柳",
            "Y": "唐", "Z": "罗", ".": "薛", "-": "伍", "_": "余", "+": "米",
            "=": "贝", "/": "姚", "?": "孟", "#": "顾", "%": "尹", "&": "江",
            "*": "钟"
        };
        const chars = text.split("");
        let bjx = "";
        for (const char of chars) {
            bjx += obja[char] || char; // 如果找不到映射，保留原字符
        }
        return bjx;
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (args[0] === "Encode") {
            return this.text2bjx(input);
        }
        return this.bjx2text(input);
    }

}

export default BaiJiaXing;
