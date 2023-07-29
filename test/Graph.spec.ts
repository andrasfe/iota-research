import { expect } from 'chai';
import { Graph, Vertex, CumulativeWeightCalculator } from '../main/'
import * as fs from 'fs';

interface Dummy {
    value: number;
};

const expected_map = {7:1, 3:2, 4:1, 5:1, 1:6, 6:1, 2:3, 0:8}


describe('VertexTest', () => {
    const graph: Graph<Dummy> = new Graph();

    before(() => {
        graph.addVertex(new Vertex({ 'value': 0 }));
        graph.addVertex(new Vertex({ 'value': 1 }));
        graph.addVertex(new Vertex({ 'value': 2 }));
        graph.addVertex(new Vertex({ 'value': 3 }));
        graph.addVertex(new Vertex({ 'value': 4 }));
        graph.addVertex(new Vertex({ 'value': 5 }));
        graph.addVertex(new Vertex({ 'value': 6 }));
        graph.addVertex(new Vertex({ 'value': 7 }));
    });

    describe('unit tests', () => {
        it('should allow adding connections', async () => {
            graph.connect(0, 1);
            graph.connect(0, 2);
            graph.connect(0, 7);
            graph.connect(2, 6);
            graph.connect(1, 3);
            graph.connect(1, 4);
            graph.connect(1, 5);
            graph.connect(3, 7);
        });


        it('should calculate calculateRatingBfs correctly', async () => {
            try {
                const cwc = new CumulativeWeightCalculator(graph);
                const res = await cwc.calculateRatingBfs(0);
                console.log(res);
                expect(res.get(0)).to.equal(8);
            }
            catch (err) {
                console.error(err);
            }
        });

        it('should return complete subgraph', async () => {
            const cwc = new CumulativeWeightCalculator(graph);
            const res = await cwc.getSubGraph(0);
            console.log(res);
            expect(res.length).to.equal(cwc.graph.vertices.length);
        })

        it('should calculate calculateRatingDfs correctly', async () => {
            try {
                const cwc = new CumulativeWeightCalculator(graph);
                const res = await cwc.calculateRatingDfs(0);
                console.log(res);
                expect(res.get(0)).to.equal(8);
            }
            catch (err) {
                console.error(err);
            }
        });

        it('should calculate calculateRatingDFID correctly', async () => {
            try {
                const cwc = new CumulativeWeightCalculator(graph);
                let res = await cwc.calculateRatingDFID(0, 50);
                console.log(res);
                expect(res.get(0)).to.equal(8);
                res = await cwc.calculateRatingDFID(0, 60);
                console.log(res);
                expect(res.get(0)).to.equal(8);

            }
            catch (err) {
                console.error(err);
            }
        });


        it('should load tangle subgraph into our structures', async () => {
            const tangle = new Map<string,string[]>(Object.entries(JSON.parse(fs.readFileSync('./reverse-tangle.json').toString())));

            const graph = await Graph.fromTangle(tangle);
            expect(graph.vertices.length).to.equal(graph.adj.length);
        });
    });
});
