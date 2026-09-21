/**
 * BaiJiaXing tests.
 *
 * @author wolfyu [wolfyu1991@qq.com]
 *
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "BaiJiaXing: Decode",
        input: "葛韩吕吕孔袁孔华吕沈!",
        expectedOutput: "HelloWorld!",
        recipeConfig: [
            {
                op: "百家姓编码",
                args: ["Decode"],
            },
        ],
    },
    {
        name: "BaiJiaXing: Encode",
        input: "HelloWorld!",
        expectedOutput: "葛韩吕吕孔袁孔华吕沈!",
        recipeConfig: [
            {
                op: "百家姓编码",
                args: ["Encode"],
            },
        ],
    },
]);
