/**
 * CoreValues tests.
 *
 * @author wolfyu [wolfyu1991@qq.com]
 *
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "CoreValues: Decode",
        input: "自由爱国公正平等公正诚信文明公正诚信文明公正诚信平等平等法治公正诚信平等法治文明公正友善公正公正自由文明民主",
        expectedOutput: "HelloWorld!",
        recipeConfig: [
            {
                op: "核心价值观编码",
                args: ["Decode"],
            },
        ],
    }
]);
