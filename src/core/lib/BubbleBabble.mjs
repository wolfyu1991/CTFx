const vowels = "aeiouy";
const consonants = "bcdfghklmnprstvzx";

/**
 *
 */
export function encode(input, encoding) {
    if (!Buffer.isBuffer(input)) {
        input = new Buffer(input, encoding);
    }

    let result = "x",
        checksum = 1,
        byte1, byte2,
        d, e, i;
    const len = input.length;

    // create full tuples
    for (i = 0; i + 1 < len; i += 2) {
        byte1 = input.readUInt8(i);
        result += oddPartial(byte1, checksum);

        byte2 = input.readUInt8(i + 1);
        d = (byte2 >> 4) & 15;
        e = byte2 & 15;

        result += consonants.charAt(d) + "-" + consonants.charAt(e);

        checksum = nextChecksum(checksum, byte1, byte2);
    }

    // handle partial tuple
    if (i < len) {
        byte1 = input.readUInt8(i);
        result += oddPartial(byte1, checksum);
    } else {
        result += evenPartial(checksum);
    }

    result += "x";
    return result;
};

const oddPartial = function (rawByte, checksum) {
    const a = (((rawByte >> 6) & 3) + checksum) % 6,
        b = (rawByte >> 2) & 15,
        c = ((rawByte & 3) + Math.floor(checksum / 6)) % 6;

    return vowels.charAt(a) + consonants.charAt(b) + vowels.charAt(c);
};

const evenPartial = function (checksum) {
    const a = checksum % 6,
        b = 16,
        c = Math.floor(checksum / 6);

    return vowels.charAt(a) + consonants.charAt(b) + vowels.charAt(c);
};

/**
 *
 */
export function decode(input) {
    if (input.substr(0, 1) !== "x" ||
        input.substr(-1, 1) !== "x") {
        throw new Error("Corrupt string");
    }

    const asciiTuples = input.substring(1, input.length - 1).match(/.{3,6}/g),
        len = asciiTuples ? asciiTuples.length : 0,
        charCodes = [];

    let checksum = 1,
        byte1, byte2, i,
        tuple;

    // handle full tuples
    for (i = 0; i < len - 1; ++i) {
        tuple = decodeTuple(asciiTuples[i]);

        byte1 = decode3partByte(tuple[0], tuple[1], tuple[2], checksum);
        byte2 = decode2partByte(tuple[3], tuple[4]);

        checksum = nextChecksum(checksum, byte1, byte2);

        charCodes.push(byte1);
        charCodes.push(byte2);
    }

    // handle partial tuple
    tuple = decodeTuple(asciiTuples[len - 1]);
    if (tuple[1] === 16) {
        if (tuple[0] !== checksum % 6 ||
            tuple[2] !== Math.floor(checksum / 6)) {
            throw new Error("Corrupt string");
        }
    } else {
        byte1 = decode3partByte(tuple[0], tuple[1], tuple[2], checksum);
        charCodes.push(byte1);
    }

    return charCodes;
};

const decodeTuple = function (asciiTuple) {
    return [
        vowels.indexOf(asciiTuple[0]),
        consonants.indexOf(asciiTuple[1]),
        vowels.indexOf(asciiTuple[2]),
        consonants.indexOf(asciiTuple[3]),
        consonants.indexOf(asciiTuple[5]),
    ];
};

const decode3partByte = function (a, b, c, checksum) {
    const high = (a - (checksum % 6) + 6) % 6,
        mid = b,
        low = (c - (Math.floor(checksum / 6) % 6) + 6) % 6;

    if (high >= 4 || low >= 4) {
        throw new Error("Corrupt string");
    }

    return (high << 6) | (mid << 2) | low;
};

const decode2partByte = function (d, e) {
    return (d << 4) | e;
};

const nextChecksum = function (checksum, byte1, byte2) {
    return ((checksum * 5) + (byte1 * 7) + byte2) % 36;
};
