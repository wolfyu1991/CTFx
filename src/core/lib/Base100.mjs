// 定义与Kotlin中类似的常量
const BASE100_BYTE1 = 0xf0 & 0xff;
const BASE100_BYTE2 = 0x9f & 0xff;

// 对字节数组进行编码的函数
/**
 *
 */
export function encode(byteArray) {
    // const resultArray = new Uint8Array(byteArray.length * 4);
    byteArray = new TextEncoder().encode(byteArray);
    const resultArray = [];
    for (let index = 0; index < byteArray.length; index++) {
        const byte = byteArray[index];
        // resultArray[index * 4] = BASE100_BYTE1;
        // resultArray[index * 4 + 1] = BASE100_BYTE2;
        // resultArray[index * 4 + 2] = (((byte & 0xFFFF) + 55) / 64 + 143) & 0xff;
        // resultArray[index * 4 + 3] = (((byte & 0xFF) + 55) % 64 + 128) & 0xff;
        resultArray.push(BASE100_BYTE1);
        resultArray.push(BASE100_BYTE2);
        resultArray.push((((byte & 0xFFFF) + 55) / 64 + 143) & 0xff);
        resultArray.push((((byte & 0xFF) + 55) % 64 + 128) & 0xff);
    }
    // return new TextDecoder().decode(resultArray);
    return resultArray;
}

// 对编码后的字符串进行解码的函数
/**
 *
 */
export function decode(encodedString) {
    const byteArray = new TextEncoder().encode(encodedString);
    const chunks = [];
    for (let i = 0; i < byteArray.length; i += 4) {
        chunks.push(byteArray.slice(i, i + 4));
    }
    const resultArray = [];
    for (let index = 0; index < chunks.length; index++) {
        const list = chunks[index];
        if (list[0] === BASE100_BYTE1 && list[1] === BASE100_BYTE2) {
            resultArray.push(((list[2] - 143) * 64 + list[3] - 128 - 55) & 0xff);
        }
    }
    return resultArray;
}

// 将解码后的字节数组转换为字符串的函数
// function base100Decode2String(encodedString) {
//     return new TextDecoder().decode(base100Decode(encodedString));
// }
