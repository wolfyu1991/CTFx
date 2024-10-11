/**
 *
 */
const parse = (function () {
    let input;
    let output;
    let memory;
    let ptr;
    // const debug = false;

    const ops = {
        "+": function () {
            memory[ptr] = memory[ptr] || 0;
            if (memory[ptr] < 255) {
                memory[ptr]++;
            } else {
                memory[ptr] = 0;
            }
            // debug && console.log("+", memory[ptr], ptr, memory);
        },

        "-": function () {
            memory[ptr] = memory[ptr] || 0;
            memory[ptr]--;
            // debug && console.log("-", memory[ptr], ptr, memory);
        },

        "<": function () {
            ptr--;
            if (ptr < 0) {
                ptr = 0;
            }
            // debug && console.log("<", ptr, memory);
        },

        ">": function () {
            ptr++;
            // debug && console.log(">", ptr, memory);
        },

        ".": function () {
            const c = String.fromCharCode(memory[ptr]);
            output.push(c);
            // debug && console.log(".", c, memory[ptr], memory);
        },

        ",": function () {
            const c = input.shift();
            if (typeof c == "string") {
                memory[ptr] = c.charCodeAt(0);
            }
            // debug && console.log(",", c, memory[ptr], memory);
        },
    };

    /**
     *
     */
    function program(nodes) {
        return function (inputString) {
            output = [];
            memory = [];
            ptr = 0;

            input = inputString && inputString.split("") || [];

            nodes.forEach(function (node) {
                node();
            });

            return output.join("");
        };
    }

    /**
     *
     */
    function loop(nodes) {
        return function () {
            let loopCounter = 0;

            while (memory[ptr] > 0) {
                if (loopCounter++ > 20000) {
                    throw "Infinite loop detected";
                }

                nodes.forEach(function (node) {
                    node();
                });
            }
        };
    }


    let programChars;

    /**
     *
     */
    function parseProgram() {
        const nodes = [];
        let nextChar;

        while (programChars.length > 0) {
            nextChar = programChars.shift();
            if (ops[nextChar]) {
                nodes.push(ops[nextChar]);
            } else if (nextChar === "[") {
                nodes.push(parseLoop());
            } else if (nextChar === "]") {
                // throw "Missing opening bracket";
            } else {
                // ignore it
            }
        }

        return program(nodes);
    }

    /**
     *
     */
    function parseLoop() {
        const nodes = [];
        let nextChar;
        let loopCounter = 0;
        const maxLoopCount = 100000; // 设置一个最大循环次数，防止过多循环

        while (programChars[0] !== "]" && loopCounter < maxLoopCount) {
            nextChar = programChars.shift();
            if (nextChar === undefined) {
                // throw "Missing closing bracket";
            } else if (ops[nextChar]) {
                nodes.push(ops[nextChar]);
            } else if (nextChar === "[") {
                nodes.push(parseLoop());
            } else {
                // ignore
            }
            loopCounter++;
        }

        if (loopCounter === maxLoopCount) {
            throw "Exceeded maximum loop count";
        }

        if (programChars[0] === "]") {
            programChars.shift();
        }

        return loop(nodes);
    }

    /**
     *
     */
    function parse(str) {
        programChars = str.split("");
        return parseProgram();
    }

    return parse;
})();


// function runBrainFuck(code, input) {
//     return parse(code)(input);
// }

/**
 *
 */
export function runBrainFuck(code, input) {
    return parse(code)(input);
    // return new Promise((resolve, reject) => {
    //     resolve(parse(code)(input));
    // });
}

// module.exports = runBrainFuck;
