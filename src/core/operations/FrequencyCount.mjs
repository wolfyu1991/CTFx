/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Frequency distribution operation
 */
class FrequencyCount extends Operation {

    /**
     * FrequencyCount constructor
     */
    constructor() {
        super();

        this.name = "词频分析";
        this.module = "CTF";
        this.description = "Displays the distribution of bytes in the data as a graph.";
        this.infoURL = "https://wikipedia.org/wiki/Frequency_distribution";
        this.inputType = "ArrayBuffer";
        this.outputType = "json";
        this.presentType = "html";
        this.args = [
            {
                "name": "Show 0%s",
                "type": "boolean",
                "value": true
            },
            {
                "name": "Show ASCII",
                "type": "boolean",
                "value": true
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {json}
     */
    run(input, args) {
        const data = new Uint8Array(input);
        if (!data.length) throw new OperationError("No data");

        const distrib = new Array(256).fill(0),
            percentages = new Array(256),
            len = data.length;
        let i;

        // Count bytes
        for (i = 0; i < len; i++) {
            distrib[data[i]]++;
        }

        // Calculate percentages
        let repr = 0;
        for (i = 0; i < 256; i++) {
            if (distrib[i] > 0) repr++;
            percentages[i] = distrib[i] / len * 100;
        }

        return {
            "percentages": percentages,
            "distribution": distrib,
            "bytesRepresented": repr
        };
    }

    /**
     * Displays the frequency distribution as a bar chart for web apps.
     *
     * @param {json} freq
     * @returns {html}
     */
    present(freq, args) {
        const [showZeroes, showAscii] = args;
        // 将频率分布转换为可排序的数组
        const freqArray = [];
        for (let i = 0; i < 256; i++) {
            if (freq.distribution[i] || showZeroes) {
                let c = "";
                if (showAscii) {
                    if (i <= 32) {
                        c = String.fromCharCode(0x2400 + i);
                    } else if (i === 127) {
                        c = String.fromCharCode(0x2421);
                    } else {
                        c = String.fromCharCode(i);
                    }
                }
                freqArray.push({
                    hex: Utils.hex(i, 2),
                    ascii: c,
                    times: freq.distribution[i],
                    percentage: freq.percentages[i].toFixed(2).replace(".00", "") + "%"
                });
            }
        }

        // 按频次降序排列
        freqArray.sort((a, b) => b.times - a.times);

        // 生成表格行
        let asciiString = "";
        let outputTable = "";
        for (const item of freqArray) {
            const bite = `<td>${item.hex}</td>`;
            const ascii = showAscii? `<td>${item.ascii}</td>` : "";
            const times = `<td>${item.times}</td>`;
            const percentage = `<td>${item.percentage.padEnd(8, " ")}</td>`;
            outputTable += `<tr>${bite}${ascii}${times}${percentage}</tr>`;
            asciiString += item.ascii;
        }
        // Print
        let output = `字符数: ${freq.bytesRepresented}
降序排列：${asciiString}
升序排列：${[...asciiString].reverse().join("")}
<script>
    var canvas = document.getElementById("chart-area"),
        parentRect = canvas.closest(".cm-scroller").getBoundingClientRect(),
        scores = ${JSON.stringify(freq.percentages)};

    canvas.width = parentRect.width * 0.95;
    canvas.height = parentRect.height * 0.9;

    CanvasComponents.drawBarChart(canvas, scores, "字符", "频率 %", 16, 6);
</script>
<table class="table table-hover table-sm">
    <tr><th>Hex</th>${showAscii ? "<th>ASCII</th>" : ""}<th>频次</th><th>频率</th></tr>`;
        output += outputTable;
        output += "</table>";
        output += "<canvas id='chart-area'></canvas>";
        return output;
    }

}

export default FrequencyCount;
