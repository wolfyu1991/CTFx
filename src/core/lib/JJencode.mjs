/**
 *
 */

import OperationError from "../errors/OperationError.mjs";

/**
 *
 */
function jjencode(gv, text) {
    let r = "";
    let n;
    // let t;
    const b = ["___", "__$", "_$_", "_$$", "$__", "$_$", "$$_", "$$$", "$___", "$__$", "$_$_", "$_$$", "$$__", "$$_$", "$$$_", "$$$$",];
    let s = "";
    for (let i = 0; i < text.length; i++) {
        n = text.charCodeAt(i);
        if (n === 0x22 || n === 0x5c) {
            s += "\\\\\\" + text.charAt(i).toString(16);
        } else if ((0x21 <= n && n <= 0x2f) || (0x3A <= n && n <= 0x40) || (0x5b <= n && n <= 0x60) || (0x7b <= n && n <= 0x7f)) {
            // }else if( (0x20 <= n && n <= 0x2f) || (0x3A <= n === 0x40) || ( 0x5b <= n && n <= 0x60 ) || ( 0x7b <= n && n <= 0x7f ) ){
            s += text.charAt(i);
        } else if ((0x30 <= n && n <= 0x39) || (0x61 <= n && n <= 0x66)) {
            if (s)
                r += "\"" + s + "\"+";
            r += gv + "." + b[n < 0x40 ? n - 0x30 : n - 0x57] + "+";
            s = "";
        } else if (n === 0x6c) { // 'l'
            if (s)
                r += "\"" + s + "\"+";
            r += "(![]+\"\")[" + gv + "._$_]+";
            s = "";
        } else if (n === 0x6f) { // 'o'
            if (s)
                r += "\"" + s + "\"+";
            r += gv + "._$+";
            s = "";
        } else if (n === 0x74) { // 'u'
            if (s)
                r += "\"" + s + "\"+";
            r += gv + ".__+";
            s = "";
        } else if (n === 0x75) { // 'u'
            if (s)
                r += "\"" + s + "\"+";
            r += gv + "._+";
            s = "";
        } else if (n < 128) {
            if (s)
                r += "\"" + s;
            else
                r += "\"";
            r += "\\\\\"+" + n.toString(8).replace(/[0-7]/g, function (c) {
                return gv + "." + b[c] + "+";
            });
            s = "";
        } else {
            if (s)
                r += "\"" + s;
            else
                r += "\"";
            r += "\\\\\"+" + gv + "._+" + n.toString(16).replace(/[0-9a-f]/gi, function (c) {
                return gv + "." + b[parseInt(c, 16)] + "+";
            });
            s = "";
        }
    }
    if (s)
        r += "\"" + s + "\"+";

    r =
        gv + "=~[];" +
        gv + "={___:++" + gv + ",$$$$:(![]+\"\")[" + gv + "],__$:++" + gv + ",$_$_:(![]+\"\")[" + gv + "],_$_:++" +
        gv + ",$_$$:({}+\"\")[" + gv + "],$$_$:(" + gv + "[" + gv + "]+\"\")[" + gv + "],_$$:++" + gv + ",$$$_:(!\"\"+\"\")[" +
        gv + "],$__:++" + gv + ",$_$:++" + gv + ",$$__:({}+\"\")[" + gv + "],$$_:++" + gv + ",$$$:++" + gv + ",$___:++" + gv + ",$__$:++" + gv + "};" +
        gv + ".$_=" +
        "(" + gv + ".$_=" + gv + "+\"\")[" + gv + ".$_$]+" +
        "(" + gv + "._$=" + gv + ".$_[" + gv + ".__$])+" +
        "(" + gv + ".$$=(" + gv + ".$+\"\")[" + gv + ".__$])+" +
        "((!" + gv + ")+\"\")[" + gv + "._$$]+" +
        "(" + gv + ".__=" + gv + ".$_[" + gv + ".$$_])+" +
        "(" + gv + ".$=(!\"\"+\"\")[" + gv + ".__$])+" +
        "(" + gv + "._=(!\"\"+\"\")[" + gv + "._$_])+" +
        gv + ".$_[" + gv + ".$_$]+" +
        gv + ".__+" +
        gv + "._$+" +
        gv + ".$;" +
        gv + ".$$=" +
        gv + ".$+" +
        "(!\"\"+\"\")[" + gv + "._$$]+" +
        gv + ".__+" +
        gv + "._+" +
        gv + ".$+" +
        gv + ".$$;" +
        gv + ".$=(" + gv + ".___)[" + gv + ".$_][" + gv + ".$_];" +
        gv + ".$(" + gv + ".$(" + gv + ".$$+\"\\\"\"+" + r + "\"\\\"\")())();";

    return r;
}

/**
 *
 */
export function encodejj(t, v, p) {
    v = v || "$";
    let r = jjencode(v, t);

    if (p) {
        r = r.replace(/[,;]$/, "");
        r = "\"'\\\"+'+\"," + r + ",'," + r.split("").reverse().join("") + ",\"+'+\"\\'\"";
    }

    return r;
}

// //////JJ解密
/**
 *
 */
export function jjdecode(t) {
    t = t.replace(/^\s+|\s+$/g, "");

    let startpos;
    let endpos;
    let gv;
    // let gvl;

    if (t.indexOf("\"'\\\"+'+\",") === 0) {
        // palindrome check
        // locate jjcode
        startpos = t.indexOf('$$+"\\""+') + 8;
        endpos = t.indexOf('"\\"")())()');

        // get gv
        gv = t.substring((t.indexOf('"\'\\"+\'+",') + 9), t.indexOf("=~[]"));
        // gvl = gv.length;
    } else {
        // get gv
        gv = t.substr(0, t.indexOf("="));
        // gvl = gv.length;

        // locate jjcode
        startpos = t.indexOf('"\\""+') + 5;
        endpos = t.indexOf('"\\"")())()');
    }

    if (startpos === endpos) {
        throw new OperationError("No data !");
        // return;
    }

    // start decoding
    let data = t.substring(startpos, endpos);

    // hex decode string
    const b = ["___+", "__$+", "_$_+", "_$$+", "$__+", "$_$+", "$$_+", "$$$+", "$___+", "$__$+", "$_$_+", "$_$$+", "$$__+", "$$_$+", "$$$_+", "$$$$+"];

    // lotu
    const strL = "(![]+\"\")[" + gv + "._$_]+";
    const strO = gv + "._$+";
    const strT = gv + ".__+";
    const strU = gv + "._+";

    // 0123456789abcdef
    const strHex = gv + ".";

    // s
    const strS = '"';
    const gvsig = gv + ".";

    const strQuote = '\\\\\\"';
    const strSlash = "\\\\\\\\";

    const strLower = "\\\\\"+";
    const strUpper = "\\\\\"+" + gv + "._+";

    const strEnd = '"+'; // end of s loop
    const result = [];
    while (data !== "") {
        // l o t u
        if (0 === data.indexOf(strL)) {
            data = data.substr(strL.length);
            result.push("l");
            continue;
        } else if (0 === data.indexOf(strO)) {
            data = data.substr(strO.length);
            result.push("o");
            continue;
        } else if (0 === data.indexOf(strT)) {
            data = data.substr(strT.length);
            result.push("t");
            continue;
        } else if (0 === data.indexOf(strU)) {
            data = data.substr(strU.length);
            result.push("u");
            continue;
        }

        // 0123456789abcdef
        if (0 === data.indexOf(strHex)) {
            data = data.substr(strHex.length);

            // check every element of hex decode string for a match
            // var i = 0;
            for (let i = 0; i < b.length; i++) {
                if (0 === data.indexOf(b[i])) {
                    data = data.substr((b[i]).length);
                    result.push(i.toString(16));
                    break;
                }
            }
            continue;
        }

        // start of s block
        if (0 === data.indexOf(strS)) {
            data = data.substr(strS.length);

            // check if "R
            // r4 n >= 128
            if (0 === data.indexOf(strUpper)) {
                data = data.substr(strUpper.length); // skip sig

                let chStr = "";
                // shouldn't be more than 2 hex chars
                for (let j = 0; j < 2; j++) {
                    // gv + "."+b[ c ]
                    if (0 === data.indexOf(gvsig)) {
                        data = data.substr(gvsig.length); // skip gvsig
                        // for every entry in b
                        for (let k = 0; k < b.length; k++) {
                            if (0 === data.indexOf(b[k])) {
                                data = data.substr(b[k].length);
                                chStr += k.toString(16) + "";
                                break;
                            }
                        }
                    } else {
                        break; // done
                    }
                }

                result.push(String.fromCharCode(parseInt(chStr, 16)));
                continue;
                // r3 check if "R // n < 128
            } else if (0 === data.indexOf(strLower)) {
                data = data.substr(strLower.length); // skip sig

                let chStr = "";
                let chLotux = "";
                let temp = "";
                let bCheckR1 = 0;
                // shouldn't be more than 3 octal chars
                for (let j = 0; j < 3; j++) {
                    // lotu check
                    if (j > 1) {
                        if (0 === data.indexOf(strL)) {
                            data = data.substr(strL.length);
                            chLotux = "l";
                            break;
                        } else if (0 === data.indexOf(strO)) {
                            data = data.substr(strO.length);
                            chLotux = "o";
                            break;
                        } else if (0 === data.indexOf(strT)) {
                            data = data.substr(strT.length);
                            chLotux = "t";
                            break;
                        } else if (0 === data.indexOf(strU)) {
                            data = data.substr(strU.length);
                            chLotux = "u";
                            break;
                        }
                    }

                    // gv + "."+b[ c ]
                    if (0 === data.indexOf(gvsig)) {
                        temp = data.substr(gvsig.length);
                        // for every entry in b octal
                        for (let k = 0; k < 8; k++) {
                            if (0 === temp.indexOf(b[k])) {
                                if (parseInt(chStr + k + "", 8) > 128) {
                                    bCheckR1 = 1;
                                    break;
                                }

                                chStr += k + "";
                                data = data.substr(gvsig.length); // skip gvsig
                                data = data.substr(b[k].length);
                                break;
                            }
                        }

                        if (1 === bCheckR1) {
                            if (0 === data.indexOf(strHex)) {
                                // 0123456789abcdef
                                data = data.substr(strHex.length);

                                // check every element of hex decode string for a match
                                // var i = 0;
                                for (let i = 0; i < b.length; i++) {
                                    if (0 === data.indexOf(b[i])) {
                                        data = data.substr((b[i]).length);
                                        chLotux = i.toString(16);
                                        break;
                                    }
                                }

                                break;
                            }
                        }
                    } else {
                        break; // done
                    }
                }

                result.push(String.fromCharCode(parseInt(chStr, 8)) + chLotux);
                continue; // step out of the while loop
            } else {
                // "S ----> "SR or "S+

                // if there is, loop s until R 0r +
                // if there is no matching s block, throw error

                let match = 0;
                let n;

                // searching for mathcing pure s block
                while (true) {
                    n = data.charCodeAt(0);
                    if (0 === data.indexOf(strQuote)) {
                        data = data.substr(strQuote.length);
                        result.push('"');
                        match += 1;
                        continue;
                    } else if (0 === data.indexOf(strSlash)) {
                        data = data.substr(strSlash.length);
                        result.push("\\");
                        match += 1;
                        continue;
                        // reached end off S block ? +
                    } else if (0 === data.indexOf(strEnd)) {
                        if (match === 0) {
                            throw new OperationError("+ no match S block: " + data);
                            // return;
                        }
                        data = data.substr(strEnd.length);

                        break; // step out of the while loop
                        // r4 reached end off S block ? - check if "R n >= 128
                    } else if (0 === data.indexOf(strUpper)) {
                        if (match === 0) {
                            throw new OperationError("no match S block n>128: " + data);
                            // return;
                        }

                        data = data.substr(strUpper.length); // skip sig

                        let chStr = "";
                        // let chLotux = "";
                        // shouldn't be more than 10 hex chars
                        for (let j = 0; j < 10; j++) {
                            // lotu check
                            if (j > 1) {
                                if (0 === data.indexOf(strL)) {
                                    data = data.substr(strL.length);
                                    // chLotux = "l";
                                    break;
                                } else if (0 === data.indexOf(strO)) {
                                    data = data.substr(strO.length);
                                    // chLotux = "o";
                                    break;
                                } else if (0 === data.indexOf(strT)) {
                                    data = data.substr(strT.length);
                                    // chLotux = "t";
                                    break;
                                } else if (0 === data.indexOf(strU)) {
                                    data = data.substr(strU.length);
                                    // chLotux = "u";
                                    break;
                                }
                            }

                            // gv + "."+b[ c ]
                            if (0 === data.indexOf(gvsig)) {
                                data = data.substr(gvsig.length); // skip gvsig
                                // for every entry in b
                                for (let k = 0; k < b.length; k++) {
                                    if (0 === data.indexOf(b[k])) {
                                        data = data.substr(b[k].length);
                                        chStr += k.toString(16) + "";
                                        break;
                                    }
                                }
                            } else {
                                break; // done
                            }
                        }

                        result.push(String.fromCharCode(parseInt(chStr, 16)));
                        break; // step out of the while loop
                        // r3 check if "R // n < 128
                    } else if (0 === data.indexOf(strLower)) {
                        if (match === 0) {
                            throw new OperationError("no match S block n<128: " + data);
                            // return;
                        }

                        data = data.substr(strLower.length); // skip sig

                        let chStr = "";
                        let chLotux = "";
                        let temp = "";
                        let bCheckR1 = 0;
                        // shouldn't be more than 3 octal chars
                        for (let j = 0; j < 3; j++) {
                            // lotu check
                            if (j > 1) {
                                if (0 === data.indexOf(strL)) {
                                    data = data.substr(strL.length);
                                    chLotux = "l";
                                    break;
                                } else if (0 === data.indexOf(strO)) {
                                    data = data.substr(strO.length);
                                    chLotux = "o";
                                    break;
                                } else if (0 === data.indexOf(strT)) {
                                    data = data.substr(strT.length);
                                    chLotux = "t";
                                    break;
                                } else if (0 === data.indexOf(strU)) {
                                    data = data.substr(strU.length);
                                    chLotux = "u";
                                    break;
                                }
                            }

                            // gv + "."+b[ c ]
                            if (0 === data.indexOf(gvsig)) {
                                temp = data.substr(gvsig.length);
                                // for every entry in b octal
                                for (let k = 0; k < 8; k++) {
                                    if (0 === temp.indexOf(b[k])) {
                                        if (parseInt(chStr + k + "", 8) > 128) {
                                            bCheckR1 = 1;
                                            break;
                                        }

                                        chStr += k + "";
                                        data = data.substr(gvsig.length); // skip gvsig
                                        data = data.substr(b[k].length);
                                        break;
                                    }
                                }

                                if (1 === bCheckR1) {
                                    // 0123456789abcdef
                                    if (0 === data.indexOf(strHex)) {
                                        data = data.substr(strHex.length);

                                        // check every element of hex decode string for a match
                                        // var i = 0;
                                        for (let i = 0; i < b.length; i++) {
                                            if (0 === data.indexOf(b[i])) {
                                                data = data.substr((b[i]).length);
                                                chLotux = i.toString(16);
                                                break;
                                            }
                                        }
                                    }
                                }
                            } else {
                                break; // done
                            }
                        }

                        result.push(String.fromCharCode(parseInt(chStr, 8)) + chLotux);
                        break; // step out of the while loop
                    } else if ((0x21 <= n && n <= 0x2f) || (0x3A <= n && n <= 0x40) || (0x5b <= n && n <= 0x60) || (0x7b <= n && n <= 0x7f)) {
                        result.push(data.charAt(0));
                        data = data.substr(1);
                        match += 1;
                    }

                }
                continue;
            }
        }

        throw new OperationError("no match : " + data);
        // break;
    }

    return result.join("");

}
