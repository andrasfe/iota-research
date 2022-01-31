var dag = require('random-dag');
import fs from 'fs';
import { Graph, Vertex, CumulativeWeightCalculator } from '../main/'

interface Edge {
    from: number,
    to: number
};

interface Dummy {
    value: number;
};

const generate = (nodeNo: number, fillFactor: number): Array<[number, number]> => {
    const max = fillFactor * nodeNo;
    const edges: Array<[number, number]> = [];
    for (let n = 0; n < nodeNo; n++) {
        for (let end = n + 1; end < nodeNo; end++) {
            const val = Math.floor(Math.random() * nodeNo + 1);
            if (val < max) {
                edges.push([n, end])
            }
        }
    }

    return edges;
}

(async () => {
    let nodeCnt = 2000 +  Math.floor(Math.random()*1000);
    let fillFactor = 0.001;

    const MAX = 10;
    const start = 0; //Math.floor(Math.random() * MAX);
    const end = MAX; //start + 300
    for (let i = start; i < end; i++) {
        console.log('iteration', i)

        fillFactor += 0.00011*i;
        nodeCnt += 500*i;

        const graph: Graph<Dummy> = new Graph();
        const edges = generate(nodeCnt, fillFactor);
        if(edges.length > 25000) {
            continue;
        }

        for (let i = 0; i < nodeCnt; i++) {
            graph.addVertex(new Vertex({ 'value': i }));
        }

        edges.forEach(edge => {
            graph.connect(edge[0], edge[1]);
        });

        try {
            let startTime = Date.now()
            await new CumulativeWeightCalculator(graph).calculateRatingBfs(1);
            const duration = Date.now() - startTime;
            fs.appendFileSync('benchmarks.bfs.csv', `${nodeCnt},${edges.length},${duration},${fillFactor}\n`);
        }
        catch (error) {
            console.log(error.toString)
        };
        try {
            let startTime = Date.now()
            await new CumulativeWeightCalculator(graph).calculateRatingDfs(1);
            const duration = Date.now() - startTime;
            fs.appendFileSync('benchmarks.dfs.csv', `${nodeCnt},${edges.length},${duration},${fillFactor}\n`);
        }
        catch (error) {
            console.log(error.toString)
        };

    }
})();

