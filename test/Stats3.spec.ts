
import fs from 'fs';
import { Graph, Vertex, CumulativeWeightCalculator } from '../main'


(async () => {

    try {
        const tangle = new Map<string, string[]>(Object.entries(JSON.parse(fs.readFileSync('./tangle.json').toString())));

        const graph = await Graph.fromTangle(tangle);

        for (let i = 0; i < graph.vertices.length; i++) {
            const cwc = new CumulativeWeightCalculator(graph);
 
            let startTime = Date.now();
            const weightMap = await cwc.calculateRatingDfs(i);
            let duration = Date.now() - startTime;

            const nodeCnt = weightMap.size;
            const edgeCnt = weightMap.get(i);

            fs.appendFileSync('benchmarks.ours.csv', `${nodeCnt},${edgeCnt},${duration}\n`);

            startTime = Date.now();
            await cwc.calculateRatingBfs(i);
            duration = Date.now() - startTime;

            fs.appendFileSync('benchmarks.real.iri.csv', `${nodeCnt},${edgeCnt},${duration}\n`);

            startTime = Date.now();
            await cwc.calculateRatingDFID(i, 10000);
            duration = Date.now() - startTime;
            fs.appendFileSync('benchmarks.ours.10000.dfid.csv', `${nodeCnt},${edgeCnt},${duration}\n`);


            startTime = Date.now();
            await cwc.calculateRatingDFID(i, 50);
            duration = Date.now() - startTime;
            fs.appendFileSync('benchmarks.ours.50.dfid.csv', `${nodeCnt},${edgeCnt},${duration}\n`);
        }
    }
    catch (error) {
        console.log(error.toString)
    };
}) ();
