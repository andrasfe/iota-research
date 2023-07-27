import fs from 'fs';
import os from 'os';
import process from 'process';

import { Graph, CumulativeWeightCalculator } from '../main'

const ALGO_NAME = process.env["ALGO_NAME"] as string;

(async () => {

    try {

        const methodName = ALGO_NAME == "BFS" ? "calculateRatingBfs" : "calculateRatingDfs"
        const tangle = new Map<string, string[]>(Object.entries(JSON.parse(fs.readFileSync('./tangle.json').toString())));

        const graph = await Graph.fromTangle(tangle);

        for (let i = 0; i < graph.vertices.length; i++) {
            let startTime = Date.now();
            const cwc = new CumulativeWeightCalculator(graph);
            const weightMap = await cwc[methodName](i);

            const logStmt = `${os.totalmem()},${os.freemem()},${os.cpus().length},${process.memoryUsage().rss},${process.memoryUsage().heapTotal},${process.memoryUsage().heapUsed},${process.memoryUsage().external},${process.memoryUsage().arrayBuffers},${process.uptime()}\n`;
            fs.appendFileSync(`profile.${ALGO_NAME}.csv`, logStmt);

            let duration = Date.now() - startTime;

            const nodeCnt = weightMap.size;
            const edgeCnt = weightMap.get(i);

            fs.appendFileSync(`benchmarks.${ALGO_NAME}.csv`, `${nodeCnt},${edgeCnt},${duration}\n`);
        }
    }
    catch (error) {
        console.log(error.toString)
    };
}) ();
