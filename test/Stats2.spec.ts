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

const sumOfSum = (n:number) : number => {
    let sum = 0;
    for(let i = 0; i < n; i++) {
        sum += i*(i + 1)/2;
    }

    return sum;
}

const generateConstEdges = (nodeNo: number, edgeNo: number): Array<[number, number]> => {
    const edges: Array<[number, number]> = [];
    for (let n = 0; n < nodeNo; n++) {
        for (let end = n + 1; end < nodeNo; end++) {
            const val = Math.random();
            if (val < end/(n*10) && edges.length < edgeNo) {
                edges.push([n, end])
            }
        }
    }

    return edges;
}

(async () => {
    let nodeCnt = 1000 +  Math.floor(Math.random()*1000);
    let edgeCnt = 20000;

    const MAX = 25;
    const start = 0; //Math.floor(Math.random() * MAX);
    const end = MAX; //start + 300
    for (let i = start; i < end; i++) {
        console.log('iteration', i)
        nodeCnt += 10*i;


        const graph: Graph<Dummy> = new Graph();
        const edges = generateConstEdges(nodeCnt, edgeCnt);


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
            fs.appendFileSync('benchmarks.const.bfs.csv', `${nodeCnt},${edges.length},${duration},${edgeCnt}\n`);
            if(duration > 10000) {
                break;
            }
        }
        catch (error) {
            console.log(error.toString)
        };
    }
})();
