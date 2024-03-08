/**
 * @author wolfyu [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import XRegExp from "xregexp";
// import OperationError from "../errors/OperationError.mjs";

/**
 * AAencode operation
 */
class AAencode extends Operation {

    /**
     * BrainFuck constructor
     */
    constructor() {
        super();

        this.name = "AAencode 颜文字加密";
        this.module = "CTF";
        this.description = "AAencode将JavaScript代码转换成颜文字网络表情的编码，本工具可以将JavaScript代码转换成颜文字网编码，同时可以将转换后的颜文字网编码的JavaScript代码解密。";
        this.infoURL = "https://utf-8.jp/public/aaencode.html";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Type",
                type: "option",
                value: ["Decode", "Decode2", "Encode"]
            }
        ];
        this.checks = [
            {
                pattern: "^ﾟωﾟ",
                flags: "",
                args: ["Decode"]
            },
        ];
    }

    /**
     *
     */
    decode(code) {
        // const feature = {
        //     "header": "(ﾟεﾟ+(ﾟДﾟ)[ﾟoﾟ]+ ",
        //     "footer": "(ﾟДﾟ)[ﾟoﾟ]) (ﾟΘﾟ)) ('_');",
        //     "label": "(ﾟДﾟ)[ﾟεﾟ]+",
        //     "end": "(oﾟｰﾟo)+ "
        // };
        // const replaces = [
        //     "(c^_^o)+",
        //     "(ﾟΘﾟ)+",
        //     "((o^_^o) - (ﾟΘﾟ))+",
        //     "(o^_^o)+",
        //     "(ﾟｰﾟ)+",
        //     "((ﾟｰﾟ) + (ﾟΘﾟ))+",
        //     "((o^_^o) +(o^_^o))+",
        //     "((ﾟｰﾟ) + (o^_^o))+",
        //     "((ﾟｰﾟ) + (ﾟｰﾟ))+",
        //     "((ﾟｰﾟ) + (ﾟｰﾟ) + (ﾟΘﾟ))+",
        //     "(ﾟДﾟ) .ﾟωﾟﾉ+",
        //     "(ﾟДﾟ) .ﾟΘﾟﾉ+",
        //     "(ﾟДﾟ) ['c']+",
        //     "(ﾟДﾟ) .ﾟｰﾟﾉ+",
        //     "(ﾟДﾟ) .ﾟДﾟﾉ+",
        //     "(ﾟДﾟ) [ﾟΘﾟ]+"
        // ];
        const feature = {
            "header": "(ﾟεﾟ+(ﾟДﾟ)[ﾟoﾟ]+",
            "footer": "(ﾟДﾟ)[ﾟoﾟ])(ﾟΘﾟ))('_');",
            "label": "(ﾟДﾟ)[ﾟεﾟ]+",
            "end": "(oﾟｰﾟo)+"
        };
        const replaces = [
            "(c^_^o)+",
            "(ﾟΘﾟ)+",
            "((o^_^o)-(ﾟΘﾟ))+",
            "(o^_^o)+",
            "(ﾟｰﾟ)+",
            "((ﾟｰﾟ)+(ﾟΘﾟ))+",
            "((o^_^o)+(o^_^o))+",
            "((ﾟｰﾟ)+(o^_^o))+",
            "((ﾟｰﾟ)+(ﾟｰﾟ))+",
            "((ﾟｰﾟ)+(ﾟｰﾟ)+(ﾟΘﾟ))+",
            "(ﾟДﾟ).ﾟωﾟﾉ+",
            "(ﾟДﾟ).ﾟΘﾟﾉ+",
            "(ﾟДﾟ)['c']+",
            "(ﾟДﾟ).ﾟｰﾟﾉ+",
            "(ﾟДﾟ).ﾟДﾟﾉ+",
            "(ﾟДﾟ)[ﾟΘﾟ]+"
        ];

        // 去除空格
        code = code.replace(new XRegExp(Utils.parseEscapedChars(" "), "g"), "");
        code = code.replace(new XRegExp(Utils.parseEscapedChars("\r"), "g"), "");
        code = code.replace(new XRegExp(Utils.parseEscapedChars("\n"), "g"), "");
        // 掐头去尾
        code = code.replace(new XRegExp(".*?" + Utils.escapeRegex(feature.header)), "");
        code = code.replace(new XRegExp(Utils.escapeRegex(feature.footer) + "|" + Utils.escapeRegex(feature.end), "g"), "");

        // 字符转数字
        for (let i = 15; i > -1; i--) {
            const find = new XRegExp(Utils.escapeRegex(replaces[i]), "g");
            code = code.replace(find, i.toString(16));
        }

        code = code.replace(new XRegExp(" ", "g"), "");
        code = code.replace(new XRegExp(Utils.escapeRegex(feature.label), "g"), " ");

        if (code.startsWith(" ")) {
            code = code.replace(" ", "");
        }

        // 八进制转字符
        if (code.length === 0) return [];
        return code.split(" ").map(num => {
            if (num.length > 3) {
                return String.fromCharCode(parseInt(num, 16));
            } else {
                return String.fromCharCode(parseInt(num, 8));
            }
        }).join("");
    }

    /**
     *
     */
    decode2(t) {
        t = t.replace(") ('_')", "");
        t = t.replace("(ﾟДﾟ) ['_'] (", "return ");
        const x = new Function(t);
        // const r = x();
        return x.toString();
    }

    /**
     *
     */
    aaencode(text) {
        let t = "";
        const b = [
            "(c^_^o)",
            "(ﾟΘﾟ)",
            "((o^_^o) - (ﾟΘﾟ))",
            "(o^_^o)",
            "(ﾟｰﾟ)",
            "((ﾟｰﾟ) + (ﾟΘﾟ))",
            "((o^_^o) +(o^_^o))",
            "((ﾟｰﾟ) + (o^_^o))",
            "((ﾟｰﾟ) + (ﾟｰﾟ))",
            "((ﾟｰﾟ) + (ﾟｰﾟ) + (ﾟΘﾟ))",
            "(ﾟДﾟ) .ﾟωﾟﾉ",
            "(ﾟДﾟ) .ﾟΘﾟﾉ",
            "(ﾟДﾟ) ['c']",
            "(ﾟДﾟ) .ﾟｰﾟﾉ",
            "(ﾟДﾟ) .ﾟДﾟﾉ",
            "(ﾟДﾟ) [ﾟΘﾟ]"
        ];
        let r = "ﾟωﾟﾉ= /｀ｍ´）ﾉ ~┻━┻   //*´∇｀*/ ['_']; o=(ﾟｰﾟ)  =_=3; c=(ﾟΘﾟ) =(ﾟｰﾟ)-(ﾟｰﾟ); ";

        if (/ひだまりスケッチ×(365|３５６)\s*来週も見てくださいね[!！]/.test(text)) {
            r += "X=_=3; ";
            r += "\r\n\r\n    X / _ / X < \"来週も見てくださいね!\";\r\n\r\n";
        }
        r += "(ﾟДﾟ) =(ﾟΘﾟ)= (o^_^o)/ (o^_^o);" +
            "(ﾟДﾟ)={ﾟΘﾟ: '_' ,ﾟωﾟﾉ : ((ﾟωﾟﾉ==3) +'_') [ﾟΘﾟ] " +
            ",ﾟｰﾟﾉ :(ﾟωﾟﾉ+ '_')[o^_^o -(ﾟΘﾟ)] " +
            ",ﾟДﾟﾉ:((ﾟｰﾟ==3) +'_')[ﾟｰﾟ] }; (ﾟДﾟ) [ﾟΘﾟ] =((ﾟωﾟﾉ==3) +'_') [c^_^o];" +
            "(ﾟДﾟ) ['c'] = ((ﾟДﾟ)+'_') [ (ﾟｰﾟ)+(ﾟｰﾟ)-(ﾟΘﾟ) ];" +
            "(ﾟДﾟ) ['o'] = ((ﾟДﾟ)+'_') [ﾟΘﾟ];" +
            "(ﾟoﾟ)=(ﾟДﾟ) ['c']+(ﾟДﾟ) ['o']+(ﾟωﾟﾉ +'_')[ﾟΘﾟ]+ ((ﾟωﾟﾉ==3) +'_') [ﾟｰﾟ] + " +
            "((ﾟДﾟ) +'_') [(ﾟｰﾟ)+(ﾟｰﾟ)]+ ((ﾟｰﾟ==3) +'_') [ﾟΘﾟ]+" +
            "((ﾟｰﾟ==3) +'_') [(ﾟｰﾟ) - (ﾟΘﾟ)]+(ﾟДﾟ) ['c']+" +
            "((ﾟДﾟ)+'_') [(ﾟｰﾟ)+(ﾟｰﾟ)]+ (ﾟДﾟ) ['o']+" +
            "((ﾟｰﾟ==3) +'_') [ﾟΘﾟ];(ﾟДﾟ) ['_'] =(o^_^o) [ﾟoﾟ] [ﾟoﾟ];" +
            "(ﾟεﾟ)=((ﾟｰﾟ==3) +'_') [ﾟΘﾟ]+ (ﾟДﾟ) .ﾟДﾟﾉ+" +
            "((ﾟДﾟ)+'_') [(ﾟｰﾟ) + (ﾟｰﾟ)]+((ﾟｰﾟ==3) +'_') [o^_^o -ﾟΘﾟ]+" +
            "((ﾟｰﾟ==3) +'_') [ﾟΘﾟ]+ (ﾟωﾟﾉ +'_') [ﾟΘﾟ]; " +
            "(ﾟｰﾟ)+=(ﾟΘﾟ); (ﾟДﾟ)[ﾟεﾟ]='\\\\'; " +
            "(ﾟДﾟ).ﾟΘﾟﾉ=(ﾟДﾟ+ ﾟｰﾟ)[o^_^o -(ﾟΘﾟ)];" +
            "(oﾟｰﾟo)=(ﾟωﾟﾉ +'_')[c^_^o];" +// TODO
            "(ﾟДﾟ) [ﾟoﾟ]='\\\"';" +
            "(ﾟДﾟ) ['_'] ( (ﾟДﾟ) ['_'] (ﾟεﾟ+";
        r += "(ﾟДﾟ)[ﾟoﾟ]+ ";
        for (let i = 0; i < text.length; i++) {
            const n = text.charCodeAt(i);
            t = "(ﾟДﾟ)[ﾟεﾟ]+";
            if (n <= 127) {
                t += n.toString(8).replace(/[0-7]/g, function (c) {
                    return b[c] + "+ ";
                });
            } else {
                const m = /[0-9a-f]{4}$/.exec("000" + n.toString(16))[0];
                t += "(oﾟｰﾟo)+ " + m.replace(/[0-9a-f]/gi, function (c) {
                    return b[parseInt(c, 16)] + "+ ";
                });
            }
            r += t;

        }
        r += "(ﾟДﾟ)[ﾟoﾟ]) (ﾟΘﾟ)) ('_');";
        return r;


    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (input.length < 1) return "";
        const type = args[0];
        if (type === "Decode") {
            return this.decode(input);
        } else if (type === "Decode2") {
            return this.decode2(input);
        } else {
            return this.aaencode(input);
        }

        // throw new OperationError("Test");
    }

}

export default AAencode;
