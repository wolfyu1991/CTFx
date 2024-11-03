/**
 *
 */
// 定义DNA二进制到碱基的映射
const dnaBin = new Map([
    ["00", "A"],
    ["10", "C"],
    ["01", "G"],
    ["11", "T"]
]);

// 创建解码二进制到DNA二进制的反向映射
// const decodeBin = new Map([...dnaBin.values()].map((value, index) => [value, [...dnaBin.keys()][index]]));

// 定义DNA编码到解码字符的映射
const dnaDecodeMap = new Map([
    ["AAA", "a"],
    ["AAC", "b"],
    ["AAG", "c"],
    ["AAT", "d"],
    ["ACA", "e"],
    ["ACC", "f"],
    ["ACG", "g"],
    ["ACT", "h"],
    ["AGA", "i"],
    ["AGC", "j"],
    ["AGG", "k"],
    ["AGT", "l"],
    ["ATA", "m"],
    ["ATC", "n"],
    ["ATG", "o"],
    ["ATT", "p"],
    ["CAA", "q"],
    ["CAC", "r"],
    ["CAG", "s"],
    ["CAT", "t"],
    ["CCA", "u"],
    ["CCC", "v"],
    ["CCG", "w"],
    ["CCT", "x"],
    ["CGA", "y"],
    ["CGC", "z"],
    ["CGG", "A"],
    ["CGT", "B"],
    ["CTA", "C"],
    ["CTC", "D"],
    ["CTG", "E"],
    ["CTT", "F"],
    ["GAA", "G"],
    ["GAC", "H"],
    ["GAG", "I"],
    ["GAT", "J"],
    ["GCA", "K"],
    ["GCC", "L"],
    ["GCG", "M"],
    ["GCT", "N"],
    ["GGA", "O"],
    ["GGC", "P"],
    ["GGG", "Q"],
    ["GGT", "R"],
    ["GTA", "S"],
    ["GTC", "T"],
    ["GTG", "U"],
    ["GTT", "V"],
    ["TAA", "W"],
    ["TAC", "X"],
    ["TAG", "Y"],
    ["TAT", "Z"],
    ["TCA", "1"],
    ["TCC", "2"],
    ["TCG", "3"],
    ["TCT", "4"],
    ["TGA", "5"],
    ["TGC", "6"],
    ["TGG", "7"],
    ["TGT", "8"],
    ["TTA", "9"],
    ["TTC", "0"],
    ["TTG", " "],
    ["TTT", "."]
]);

// 创建解码字符到DNA编码的反向映射
const dnaMap = new Map([...dnaDecodeMap.values()].map((value, index) => [value, [...dnaDecodeMap.keys()][index]]));

/**
 * 对输入字符串进行DNA解码的函数
 */
export function Decode(input) {
    return input.split(/[^01AGCTagct]/).map((it) => {
        if (it.match(/[0|1]/)) {
            const chunks = it.match(/.{1,2}/g);
            const decodedChunks = chunks.map((chunk) => dnaBin.get(chunk));
            return dnaDecodeMap.get(decodedChunks.join(""));
        } else {
            return dnaDecodeMap.get(it);
        }
    }).join("");
}


/**
 * 将字符转换为DNA编码的函数
 */
export function Encode(input) {
    return input.split("").map((it) => dnaMap.get(it) || it).join(" ");
}

// module.exports = runBrainFuck;
