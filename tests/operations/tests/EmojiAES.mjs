/**
 * Emojiaes tests.
 *
 * @author wolfyu [wolfyu1991@qq.com]
 *
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Emoji AES",
        input: "⏩😡🍴✖ℹ🚨😁🍍💵😇🏎🍌😀😡✉😇⏩🍴📂🤣⏩🌪🚹🍌🚹😍✅🐅😁👉📂❓🎃ℹ✖🚫🦓🌏🌪🎈🗒😁🔄👁",
        expectedOutput: "HelloWorld!",
        recipeConfig: [
            {
                op: "Emoji AES",
                args: [
                    "Decrypt",
                    {"option": "Latin1", "string": "password"},
                    5
                ]
            },
        ],
    }
]);
