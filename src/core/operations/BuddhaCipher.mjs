/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import crypto from "crypto";
import CryptoJS from "crypto-js";
// import OperationError from "../errors/OperationError.mjs";

/**
 * BuddhaCipher operation
 */
class BuddhaCipher extends Operation {

    /**
     * BuddhaCipher constructor
     */
    constructor() {
        super();

        this.name = "与佛论禅";
        this.module = "CTF";
        this.description = "\u4e0e\u4f5b\u8bba\u7985 \u4f5b\u66f0";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "MODE",
                type: "argSelector",
                value: [
                    {
                        name: "佛曰",
                        off: [1]
                    },
                    {
                        name: "魔曰(佛曰逆序)",
                        off: [1]
                    },
                    {
                        name: "如是我闻",
                        off: [1]
                    },
                    {
                        name: "佛又曰",
                        on: [1]
                    },
                    {
                        name: "新佛曰",
                        off: [1]
                    }
                ]
            },
            {
                "name": "KEY(可选)",
                "type": "string",
                "value": ""
            }
        ];
        this.checks = [
            {
                pattern: "^(佛曰:|佛曰：)",
                flags: "",
                args: ["佛曰"]
            },
            {
                pattern: "^(魔曰:|魔曰：)",
                flags: "",
                args: ["魔曰(佛曰逆序)"]
            },
            {
                pattern: "^(佛又曰:|佛又曰：)",
                flags: "",
                args: ["佛又曰", ""]
            },
            {
                pattern: "^(如是我闻:|如是我闻：)",
                flags: "",
                args: ["如是我闻"]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        if (!input) return "";
        if (args[0] === "佛曰") {
            if (input.startsWith("佛曰:") || input.startsWith("佛曰：")) {
                input = input.substring(3);
            }
            return this.foyue(input);
        } else if (args[0] === "魔曰(佛曰逆序)") {
            if (input.startsWith("魔曰:") || input.startsWith("魔曰：")) {
                input = input.substring(3);
            }
            return this.foyue(input.split("").reverse().join(""));
        } else if (args[0] === "佛又曰") {
            if (input.startsWith("佛又曰:") || input.startsWith("佛又曰：")) {
                input = input.substring(4);
            }
            // 如果 args[1] 不为空，则 key 将取 args[1] 的值，否则将使用默认值
            const key = args[1] || "takuron.top";
            return this.toman(input, key);
        } else if (args[0] === "如是我闻") {
            if (input.startsWith("如是我闻:") || input.startsWith("如是我闻：")) {
                input = input.substring(5);
            }
            return this.rushiwowen(input);
        } else if (args[0] === "新佛曰") {
            const output = "暂不支持，在线解码地址：http://hi.pcmoe.net/buddha.html";
            return output;

        }

    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    foyue(input) {
        const tudouChars = "滅苦婆娑耶陀跋多漫都殿悉夜爍帝吉利阿無南那怛喝羯勝摩伽謹波者穆僧室藝尼瑟地彌菩提蘇醯盧呼舍佛參沙伊隸麼遮闍度蒙孕薩夷迦他姪豆特逝朋輸楞栗寫數曳諦羅曰咒即密若般故不實真訶切一除能等是上明大神知三藐耨得依諸世槃涅竟究想夢倒顛離遠怖恐有礙心所以亦智道。集盡死老至";
        const tudouKeywordChars = "冥奢梵呐俱哆怯諳罰侄缽皤";

        const tudouKeyKEY = "XDXDtudou@KeyFansClub^_^Encode!!";
        const tudouKeyIV = "Potato@Key@_@=_=";

        // if (!input.match(new RegExp(`^佛曰：(([${tudouKeywordChars}]?[${tudouChars}]){16})*$`))) {
        //     throw new Error;
        // }

        const encodeBuffer = Array(input.length).fill(0);
        let j = 0;
        for (let i = 0; i < input.length; i++, j++) {
            if (tudouKeywordChars.includes(input[i])) {
                encodeBuffer[j] = tudouChars.indexOf(input[i + 1]) ^ 0x80;
                i++;
            } else {
                encodeBuffer[j] = tudouChars.indexOf(input[i]);
            }
        }
        const encodeArray = encodeBuffer.slice(0, j);
        const decipher = crypto.createDecipheriv("aes-256-cbc", tudouKeyKEY, tudouKeyIV);
        const encodeBuffers = Buffer.from(encodeArray);
        const decodeBuff = Buffer.concat([
            decipher.update(encodeBuffers),
            decipher.final()
        ]);

        // const decipher = forge.cipher.createDecipher("AES-CBC", tudouKeyKEY);
        // decipher.start({iv: tudouKeyIV});
        // decipher.update(forge.util.createBuffer(String.fromCharCode(...encodeArray)));

        // return Buffer.from(decipher.output.getBytes()).toString("utf16le");
        // return decipher.output.getBytes();

        return decodeBuff.toString("utf16le");
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    toman(msg, key) {
        const replacements = {
            "啰": "e", "羯": "E", "婆": "t", "提": "T", "摩": "a", "埵": "A",
            "诃": "o", "迦": "O", "耶": "i", "吉": "I", "娑": "n", "佛": "N",
            "夜": "s", "驮": "S", "那": "h", "谨": "H", "悉": "r", "墀": "R",
            "阿": "d", "呼": "D", "萨": "l", "尼": "L", "陀": "c", "唵": "C",
            "唎": "u", "伊": "U", "卢": "m", "喝": "M", "帝": "w", "烁": "W",
            "醯": "f", "蒙": "F", "罚": "g", "沙": "G", "嚧": "y", "他": "Y",
            "南": "p", "豆": "P", "无": "b", "孕": "B", "菩": "v", "伽": "V",
            "怛": "k", "俱": "K", "哆": "j", "度": "J", "皤": "x", "阇": "X",
            "室": "q", "地": "Q", "利": "z", "遮": "Z", "穆": "0", "参": "1",
            "舍": "2", "苏": "3", "钵": "4", "曳": "5", "数": "6", "写": "7",
            "栗": "8", "楞": "9", "咩": "+", "输": "/", "漫": "="
        };

        let str = msg;
        for (const [original, replacement] of Object.entries(replacements)) {
            str = str.replaceAll(original, replacement);
        }

        const encryptedStr = CryptoJS.AES.decrypt("U2FsdGVkX1" + str, key);
        return encryptedStr.toString(CryptoJS.enc.Utf8);
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    rushiwowen(input) {
        const tudouKeyKEY = "XDXDtudou@KeyFansClub^_^Encode!!";
        const tudouKeyIV = "Potato@Key@_@=_=";
        const ruShiWoWen = [
            "謹", "穆", "僧", "室", "藝", "瑟", "彌", "提", "蘇", "醯", "盧", "呼", "舍", "參", "沙", "伊",
            "隸", "麼", "遮", "闍", "度", "蒙", "孕", "薩", "夷", "他", "姪", "豆", "特", "逝", "輸", "楞",
            "栗", "寫", "數", "曳", "諦", "羅", "故", "實", "訶", "知", "三", "藐", "耨", "依", "槃", "涅",
            "竟", "究", "想", "夢", "倒", "顛", "遠", "怖", "恐", "礙", "以", "亦", "智", "盡", "老", "至",
            "吼", "足", "幽", "王", "告", "须", "弥", "灯", "护", "金", "刚", "游", "戏", "宝", "胜", "通",
            "药", "师", "琉", "璃", "普", "功", "德", "山", "善", "住", "过", "去", "七", "未", "来", "贤",
            "劫", "千", "五", "百", "万", "花", "亿", "定", "六", "方", "名", "号", "东", "月", "殿", "妙",
            "尊", "树", "根", "西", "皂", "焰", "北", "清", "数", "精", "进", "首", "下", "寂", "量", "诸",
            "多", "释", "迦", "牟", "尼", "勒", "阿", "閦", "陀", "中", "央", "众", "生", "在", "界", "者",
            "行", "于", "及", "虚", "空", "慈", "忧", "各", "令", "安", "稳", "休", "息", "昼", "夜", "修",
            "持", "心", "求", "诵", "此", "经", "能", "灭", "死", "消", "除", "毒", "害", "高", "开", "文",
            "殊", "利", "凉", "如", "念", "即", "说", "曰", "帝", "毘", "真", "陵", "乾", "梭", "哈", "敬",
            "禮", "奉", "祖", "先", "孝", "雙", "親", "守", "重", "師", "愛", "兄", "弟", "信", "朋", "友",
            "睦", "宗", "族", "和", "鄉", "夫", "婦", "教", "孫", "時", "便", "廣", "積", "陰", "難", "濟",
            "急", "恤", "孤", "憐", "貧", "創", "廟", "宇", "印", "造", "經", "捨", "藥", "施", "茶", "戒",
            "殺", "放", "橋", "路", "矜", "寡", "拔", "困", "粟", "惜", "福", "排", "解", "紛", "捐", "資"];
        // const data = Buffer.from(input, "binary");
        const decryptedBuffer = Buffer.alloc(input.length);
        for (let i = 0; i < input.length; i++) {
            decryptedBuffer[i] = ruShiWoWen.indexOf(input[i]);
        }
        const decipher = crypto.createDecipheriv("aes-256-cbc", tudouKeyKEY, tudouKeyIV);
        const decodeBuff = Buffer.concat([
            decipher.update(decryptedBuffer),
            decipher.final()
        ]);
        return decodeBuff.toString("hex");
    }

}

export default BuddhaCipher;
