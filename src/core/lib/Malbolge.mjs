const xlat1 = '+b(29e*j1VMEKLyC})8&m#~W>qxdRp0wkrUo[D7,XTcA"lI.v%{gJh4G\\-=O@5`_3i<?Z\';FNQuY]szf$!BS/|t:Pn6^Ha';
const xlat2 = '5z]&gqtyfr$(we4{WP)H-Zn,[%\\3dL+Q;>U!pJS72FhOA1CB6v^=I_0/8|jsb9m<.TVac`uY*MK\'X~xDl}REokN:#?G"i@';
const legal = "ji*p</vo";
const space = "\t\r\n\v\f ";
const EXIT = -1;
export const WANTS_INPUT = -2;

export const opc = {
    jump: 4,
    out: 5,
    in: 23,
    rot: 39,
    movd: 40,
    opr: 62,
    nop: 68,
    halt: 81
};
export const opcodes = [4, 5, 23, 39, 40, 62, 68, 81];
const assembly = {
    "i": 4,
    "<": 5,
    "/": 23,
    "*": 39,
    "j": 40,
    "p": 62,
    "o": 68,
    "v": 81
};

/*
VM format:
{mem: [], a: 0, c: 0, d: 0}
c points at the new instruction
*/

/**
 *
 */
export function loadVM(str, partially) {
    const vm = {
        mem: [],
        a: 0,
        c: 0,
        d: 0
    };
    let t, tt, pos = 0;

    for (t = 0; t < str.length; t++) {
        if (space.indexOf(str[t]) !== -1) continue;
        tt = str.charCodeAt(t);
        if (tt < 127 && tt > 32 && legal.indexOf(xlat1[(tt - 33 + pos) % 94]) === -1)
            throw "输入中包含无效字符。";

        if (pos === 59049) {
            throw "代码长度超出限制！";
        }

        vm.mem[pos++] = tt;
    }

    if (!partially)
        while (pos < 59049) {
            vm.mem[pos] = op(vm.mem[pos - 1], vm.mem[pos - 2]);
            pos++;
        }

    return vm;
}

/**
 *
 */
function step(vm, input) {
    if (vm.mem[vm.c] < 33 || vm.mem[vm.c] > 126)
        throw "可能会进入无限循环！";

    let output = null;
    const va = vm.a;
    const vc = vm.c;
    const vd = vm.d;
    const vmd = vm.mem[vm.d];

    const opcode = xlat1[(vm.mem[vc] - 33 + vc) % 94];

    switch (opcode) {
        case "j":
            vm.d = vmd;
            break;
        case "i":
            vm.c = vmd;
            break;
        case "*":
            vm.a = vm.mem[vd] = (vmd / 3 | 0) + vmd % 3 * 19683;
            break;
        case "p":
            vm.a = vm.mem[vd] = op(va, vmd);
            break;
        case "<":
            output = va % 256;
            break;
        case "/":

            if (input !== undefined && input !== null)
                vm.a = input;
            else throw WANTS_INPUT;

            break;
        case "v":
            return EXIT;
    }

    if (vm.mem[vm.c] < 33 || vm.mem[vm.c] > 126) {
        vm.a = va;
        vm.c = vc;
        vm.d = vd;
        vm.mem[vd] = vmd;
        throw "Illegal " + (opcode === "i" ? "jump" : "write") + "!";
    }

    vm.mem[vm.c] = xlat2.charCodeAt(vm.mem[vm.c] - 33);
    if (vm.c === 59048) vm.c = 0;
    else vm.c++;
    if (vm.d === 59048) vm.d = 0;
    else vm.d++;

    return output;
}

op.p9 = [1, 9, 81, 729, 6561];
op.o = [
    [4, 3, 3, 1, 0, 0, 1, 0, 0],
    [4, 3, 5, 1, 0, 2, 1, 0, 2],
    [5, 5, 4, 2, 2, 1, 2, 2, 1],
    [4, 3, 3, 1, 0, 0, 7, 6, 6],
    [4, 3, 5, 1, 0, 2, 7, 6, 8],
    [5, 5, 4, 2, 2, 1, 8, 8, 7],
    [7, 6, 6, 7, 6, 6, 4, 3, 3],
    [7, 6, 8, 7, 6, 8, 4, 3, 5],
    [8, 8, 7, 8, 8, 7, 5, 5, 4]
];

/**
 *
 */
function op(x, y) {
    let j, t = 0;

    for (j = 0; j < 5; j++)
        t += op.o[(y / op.p9[j] | 0) % 9][(x / op.p9[j] | 0) % 9] * op.p9[j];

    return t;
}

/**
 *
 */
export function exec(vm) {
    let t, output = "";
    while (vm.c < vm.mem.length && (t = step(vm)) !== EXIT) {
        if (t !== null)
            output += String.fromCharCode(t);
    }
    return output;
}

/**
 *
 */
export function appendAndPerform(vm, op, input, skip) {
    const l = skip ? vm.mem.length : vm.c;
    let t = (op - (l) % 94 + 94) % 94;

    if (t < 33)
        t += 94;

    vm.mem.push(t);

    if (!skip)
        step(vm, input);

    return String.fromCharCode(t);
}

/**
 *
 */
export function clone(vm) {
    return {
        a: vm.a,
        c: vm.c,
        d: vm.d,
        mem: vm.mem.slice(0)
    };
}

/**
 *
 */
export function decode(code, position) {
    return decodeInt(code.charCodeAt(0), position);
}

/**
 *
 */
function decodeInt(code, position) {
    return xlat1[(code - 33 + position) % 94];
}

/**
 *
 */
export function decodeNext(vm) {
    return decodeInt(vm.mem[vm.c], vm.c);
}

/**
 *
 */
function normalize(code, allowWildcard) {
    let t, ct, skipped = 0;
    let normalized = "";

    for (t = 0; t < code.length; t++) {
        ct = code.charCodeAt(t);

        if (ct < 127 && (ct > 32 || (allowWildcard && ct === 32)))
            normalized += code[t] === " " ? " " : decodeInt(ct, t - skipped);
        else {
            skipped++;
            normalized += code[t];
        }
    }
    return normalized;
}

/**
 *
 */
export function assemble(normalized, allowWildcard) {
    let t, ct, skipped = 0;
    let code = "";

    for (t = 0; t < normalized.length; t++) {
        ct = normalized.charCodeAt(t);

        if (ct < 127 && (ct > 32 || (allowWildcard && ct === 32)))
            code += normalized[t] === " " ? " " : encode(assembly[normalized[t]], t - skipped);
        else {
            skipped++;
            code += normalized[t];
        }
    }
    return code;
}

/**
 *
 */
export function rot(m) {
    return (m / 3 | 0) + m % 3 * 19683;
}

/**
 *
 */
function encode(code, position) {
    return String.fromCharCode(encodeInt(code, position));
}

/**
 *
 */
function encodeInt(code, position) {
    let t = (code - (position) % 94 + 94) % 94;

    if (t < 33)
        t += 94;

    return t;
}

/*
This intentionally does not allow newlines and other garbage characters
*/
/**
 *
 */
function validateCode(code, normalized, allowWildcard) {
    if (normalized)
        return (allowWildcard ? /^[o*p/<vij ]*$/ : /^[o*p/<vij]*$/).test(code);
    else
        return validateCode(normalize(code), true, allowWildcard);
}

/**
 *
 */
export function validate(code, normalized) {
    let trimmed = "";

    for (let t = 0, ct; t < code.length; t++) {
        ct = code.charCodeAt(t);

        if (ct < 127 && ct > 32)
            trimmed += code[t];
    };

    return validateCode(trimmed, normalized, false);
}

// module.exports.EXIT = EXIT;
// module.exports.WANTS_INPUT = WANTS_INPUT;
// module.exports.appendAndPerform = appendAndPerform;
// module.exports.clone = clone;
// module.exports.decode = decode;
// module.exports.decodeInt = decodeInt;
// module.exports.decodeNext = decodeNext;
// module.exports.normalize = normalize;
// module.exports.assemble = assemble;
// module.exports.rot = rot;
// module.exports.load = loadVM;
// module.exports.step = step;
// module.exports.exec = exec;
// module.exports.op = op;
// module.exports.rot = rot;
// module.exports.xlat1 = xlat1;
// module.exports.xlat2 = xlat2;
// module.exports.encode = encode;
// module.exports.encodeInt = encodeInt;
// module.exports.opc = opc;
// module.exports.opcodes = opcodes;
// module.exports.assembly = assembly;
// module.exports.validateCode = validateCode;
// module.exports.validate = validate;
