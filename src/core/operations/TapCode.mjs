/**
 * @author wolfyu1991 [wolfyu1991@qq.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
// import OperationError from "../errors/OperationError.mjs";

/**
 * TapCode operation
 */
class TapCode extends Operation {

    /**
     * TapCode constructor
     */
    constructor() {
        super();

        this.name = "TapCode";
        this.module = "CTF";
        this.description = "Tap code\uff08\u6572\u51fb\u7801\uff09\u662f\u4e00\u79cd\u4ee5\u975e\u5e38\u7b80\u5355\u7684\u65b9\u5f0f\u5bf9\u6587\u672c\u4fe1\u606f\u8fdb\u884c\u7f16\u7801\u7684\u65b9\u6cd5\u3002\u56e0\u8be5\u7f16\u7801\u5bf9\u4fe1\u606f\u901a\u8fc7\u4f7f\u7528\u4e00\u7cfb\u5217\u7684\u70b9\u51fb\u58f0\u97f3\u6765\u7f16\u7801\u800c\u547d\u540d\uff0c\u6572\u51fb\u7801\u662f\u57fa\u4e8e5\xd75\u65b9\u683c\u6ce2\u5229\u6bd4\u5965\u65af\u65b9\u9635\u6765\u5b9e\u73b0\u7684\uff0c\u4e0d\u540c\u70b9\u662f\u662f\u7528K\u5b57\u6bcd\u88ab\u6574\u5408\u5230C\u4e2d\u3002\u6572\u51fb\u7801\u8868:<br>  1  2  3  4  5<br>1 A  B C/K D  E<br>2 F  G  H  I  J <br>3 L  M  N  O  P<br>4 Q  R  S  T  U<br>5 V  W  X  Y  Z";
        this.infoURL = ""; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "MODE",
                type: "option",
                value: ["Decode", "Encode"]
            }
        ];
        this.checks = [
            {
                pattern: "^(([1-5][1-5]\\s?)){2,}$",
                flags: "i",
                args: ["Decode"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (!input) return "";
        const tapCodeTable = this.getTapCodeTable();
        if (args[0] === "Decode") {
            let output = "";

            const wordDelim = " ";

            const reversedTable = {};

            for (const letter in tapCodeTable) {
                const signal = tapCodeTable[letter];
                reversedTable[signal] = letter;
            }

            let words = [input];
            if (wordDelim) {
                words = input.split(wordDelim);
            }
            words = Array.prototype.map.call(words, function (word) {

                const letters = [];
                for (let i = 0; i < word.length; i = i + 2) {
                    const val = word.substr(i, 2);
                    if (reversedTable[val]) {
                        letters.push(reversedTable[val]);
                    }
                }

                return letters.join("");
            });

            output = words.join(" ");
            return output;

        } else {
            let output = "";
            const wordDelim = " ";
            let words = input.split(wordDelim);
            words = Array.prototype.map.call(words, function (word) {
                word = word.toUpperCase();
                word.replace(/\\K/g, "");
                const letters = Array.prototype.map.call(word, function (character) {
                    const letter = character.toUpperCase();
                    if (typeof tapCodeTable[letter] == "undefined") {
                        return "";
                    }

                    return tapCodeTable[letter];
                });

                return letters.join("");
            });

            output = words.join(wordDelim);
            return output;

        }
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    getTapCodeTable() {
        return {
            A: "11",
            B: "12",
            C: "13",
            D: "14",
            E: "15",
            F: "21",
            G: "22",
            H: "23",
            I: "24",
            J: "25",
            L: "31",
            M: "32",
            N: "33",
            O: "34",
            P: "35",
            Q: "41",
            R: "42",
            S: "43",
            T: "44",
            U: "45",
            V: "51",
            W: "52",
            X: "53",
            Y: "54",
            Z: "55"
        };
    }

}

export default TapCode;
