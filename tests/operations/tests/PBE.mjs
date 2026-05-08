/**
 * PBE Decrypt tests.
 *
 * @author wolfyu [wolfyu1991@qq.com]
 *
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "PBE Decrypt: AES",
        input: "U2FsdGVkX18obONbFOMSCh3A5EKTA9kiaqel9F2Mh30=",
        expectedOutput: "HelloWorld!",
        recipeConfig: [
            {
                op: "PBE",
                args: [
                    "Decrypt",
                    "AES",
                    {"option": "Latin1", "string": "Passw0rd"}
                ]
            },
        ],
    },
    {
        name: "PBE Decrypt: DES",
        input: "U2FsdGVkX19xv5SajWrt0J75BzXOtDxuHHkyrXDTv0E=",
        expectedOutput: "HelloWorld!",
        recipeConfig: [
            {
                op: "PBE",
                args: [
                    "Decrypt",
                    "DES",
                    {"option": "Latin1", "string": "Passw0rd"}
                ]
            },
        ],
    },
    {
        name: "PBE Decrypt: TripleDES",
        input: "U2FsdGVkX1/nUTg3g7ER0/BpYJtEI3ceu1KkVrSgF/E=",
        expectedOutput: "HelloWorld!",
        recipeConfig: [
            {
                op: "PBE",
                args: [
                    "Decrypt",
                    "TripleDES",
                    {"option": "Latin1", "string": "Passw0rd"}
                ]
            },
        ],
    },
    {
        name: "PBE Decrypt: Rabbit",
        input: "U2FsdGVkX18uaxqV2vGm7jCH5978m3ndPazW",
        expectedOutput: "HelloWorld!",
        recipeConfig: [
            {
                op: "PBE",
                args: [
                    "Decrypt",
                    "Rabbit",
                    {"option": "Latin1", "string": "Passw0rd"}
                ]
            },
        ],
    },
    {
        name: "PBE Decrypt: RabbitLegacy",
        input: "U2FsdGVkX19rovPE7wSe3PYVfPLhBiW5PGg8",
        expectedOutput: "HelloWorld!",
        recipeConfig: [
            {
                op: "PBE",
                args: [
                    "Decrypt",
                    "RabbitLegacy",
                    {"option": "Latin1", "string": "Passw0rd"}
                ]
            },
        ],
    },
    {
        name: "PBE Decrypt: RC4",
        input: "U2FsdGVkX1++ZkiV9MnnIBAhBsKgKr11HhYu",
        expectedOutput: "HelloWorld!",
        recipeConfig: [
            {
                op: "PBE",
                args: [
                    "Decrypt",
                    "RC4",
                    {"option": "Latin1", "string": "Passw0rd"}
                ]
            },
        ],
    },
    {
        name: "PBE Decrypt Brute",
        input: "U2FsdGVkX1+B/NzBKGvLj8b7HHtNtiieSFOLGiRcmzA=",
        expectedMatch: /DES.{1,10}flag\{wolfyu\}/,
        recipeConfig: [
            {
                op: "PBE",
                args: [
                    "Decrypt",
                    "ALL",
                    {"option": "Latin1", "string": "password"}
                ]
            },
        ],
    }
]);
