import fs from 'fs';
import { Graph, CumulativeWeightCalculator } from '../main'

const ALGO_NAME = process.env["ALGO_NAME"] as string;

(async () => {

    try {

        const methodName = ALGO_NAME == "BFS" ? "calculateRatingBfs" : "calculateRatingDfs"
        const tangle = new Map<string, string[]>(Object.entries(JSON.parse(fs.readFileSync('./tangle.json').toString())));

        const graph = await Graph.fromTangle(tangle);
        const cwc = new CumulativeWeightCalculator(graph);

        for (let i = 0; i < graph.vertices.length; i++) {
            let startTime = Date.now();
            const weightMap = await cwc[methodName](i);
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
