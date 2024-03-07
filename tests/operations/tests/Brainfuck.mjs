/**
 * Brainfuck tests.
 *
 * @author wolfyu [wolfyu1991@qq.com]
 *
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "BrainFuck: helloworld",
        input: "++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.",
        expectedOutput: "Hello World!\n",
        recipeConfig: [
            {
                op: "BrainFuck",
                args: [""],
            },
        ],
    },
    {
        name: "BrainFuck: 冒泡排序",
        input: ">>,[>>,]<<[[<<]>>>>[<<[>+<<+>-]>>[>+<<<<[->]>[<]>>-]<<<[[-]>>[>+<-]>>[<<<+>>>-]]>>[[<+>-]>>]<]<<[>>+<<-]<<]>>>>[.>>]",
        expectedOutput: "12579",
        recipeConfig: [
            {
                op: "BrainFuck",
                args: ["57912"],
            },
        ],
    },
    {
        name: "BrainFuck: 插入排序",
        input: ">>+>,[<[[>>+<<-]>[<<+<[->>+[<]]>>>[>]<<-]<<<]>>[<<+>>-]<[>+<-]>[>>]<,]<<<[<+<]>[>.>]",
        expectedOutput: "011228",
        recipeConfig: [
            {
                op: "BrainFuck",
                args: ["211028"],
            },
        ],
    },
]);
