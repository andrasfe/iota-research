import { Graph } from "./Graph";
import { Vertex, Status } from "./Vertex";
import {Utils} from "./Utils"

// enum Result {success, failure, unknown}
// node equivalent implementation
class Result {
    static SUCCESS = new Result();
    static FAILURE = new Result();
    static CUTOFF = new Result();
}
export class CumulativeWeightCalculator<T> {
    
    searchTime: number;
    profiler = new Utils()

    constructor(public graph: Graph<T>) { }
    async countAllApprovers(startingSet: number[]): Promise<number> {
        const stack = [...startingSet];
        while (stack.length > 0) {
            const index = stack.shift();
            const approvers = this.graph.getAdjacentVertices(index);
            approvers.forEach((approver: number) => {
                if (!startingSet[approver]) {
                    startingSet.push(approver);
                    stack.push(approver);
                }
            });
        }
        return startingSet.length;
    }

    async calculateRatingBfs(edgeIndex: number): Promise<Map<number, number>> {
        const vertexToWeightMap: Map<number, number> = new Map();
        let grayVertices = this.graph.getAdjacentVertices(edgeIndex);
        while (grayVertices.length > 0) {
            let index = grayVertices.shift();
            const approvers = this.graph.getAdjacentVertices(index);
            if (!approvers) {
                vertexToWeightMap.set(index, 1);
            }
            else {
                approvers.forEach((approver: number) => {
                    if (!vertexToWeightMap.get(approver)) {
                        grayVertices.push(approver);
                    }
                });
                approvers.push(index);
                vertexToWeightMap.set(index, await this.countAllApprovers(approvers));
            }
        }
        if (!vertexToWeightMap.get(edgeIndex)) {
            vertexToWeightMap.set(edgeIndex, vertexToWeightMap.size + 1);
        }
        return vertexToWeightMap;
    }
    async getSubGraph(entryPoint: number): Promise<Array<number>> {
        const verticeIndexes = new Set<number>();
        verticeIndexes.add(entryPoint);
        const adjVertices = this.graph.getAdjacentVertices(entryPoint);
        while (adjVertices.length > 0) {
            const index = adjVertices.shift();
            const av = this.graph.getAdjacentVertices(index);
            av.forEach(v => adjVertices.push(v));
            verticeIndexes.add(index);
        }
        return Array.from(verticeIndexes.values());
    }
    /**
     * recursive depth-first search starting with vertex at index
     *
     * @param {number} index
     * @memberof Graph
     */
    dfsVisit(index: number, vertexToWeightMap: Map<number, number>) {
        this.searchTime++;
        const curIndex = this.graph.vertices[index];
        curIndex.status = Status.VISITED;
        this.graph.adj[index].forEach(adjIndex => {
            const adjVertex = this.graph.vertices[adjIndex]
            if (adjVertex.status === Status.NEW) {
                adjVertex.status = Status.VISITED;
                adjVertex.parent = this.graph.vertices[index];
                this.dfsVisit(adjIndex, vertexToWeightMap);
            }
        });
        curIndex.status = Status.COMPLETED;
        this.searchTime++;
        curIndex.finishTime = this.searchTime;
        curIndex.weight += 1;
        if (curIndex.parent) {
            curIndex.parent.weight += curIndex.weight;
        }
        vertexToWeightMap.set(index, curIndex.weight);
    }
    /**
     * Depth-first search function
     *
     * @memberof Graph
     */
    async calculateRatingDfs(entrypoint: number): Promise<Map<number, number>> {
        this.searchTime = 0;
        const verticeIndexes = await this.graph.getAdjacentVertices(entrypoint);
        const vertexToWeightMap: Map<number, number> = new Map();
        await this.graph.resetVertices();
        for (let i = 0; i < verticeIndexes.length; i++) {
            const origIndex = verticeIndexes[i];
            if (this.graph.vertices[origIndex].status === Status.NEW) {
                this.dfsVisit(origIndex, vertexToWeightMap);
            }
        }
        vertexToWeightMap.set(entrypoint, vertexToWeightMap.size + 1);
        return vertexToWeightMap;
    }
    // DLS abbreviation for Depth-limited search
    // https://en.wikipedia.org/wiki/Iterative_deepening_depth-first_search
    DLDFS(index: number, depthLimit:number, vertexToWeightMap: Map<number, number>, weigthGoal: number) {
        this.searchTime = 0;
        const curIndex = this.graph.vertices[index];
        curIndex.status = Status.VISITED;
        if (this.profiler.heapUsed() >= weigthGoal && depthLimit > 5) {
            // console.log('limit reached')
            return Result.SUCCESS;
        }
        else if (depthLimit == 0) {
            return Result.CUTOFF;
        }
        else {
            let cutoff_occurred = false;
            this.graph.adj[index].forEach(adjIndex => {
                const adjVertex = this.graph.vertices[adjIndex]
                if (adjVertex.status == Status.NEW) {
                    adjVertex.status = Status.VISITED;
                    adjVertex.parent = this.graph.vertices[index];
                    const result = this.DLDFS(adjIndex, depthLimit - 1, vertexToWeightMap, weigthGoal);
                    if (result == Result.CUTOFF) {
                        cutoff_occurred = true;
                    }
                    else if (result == Result.SUCCESS) {
                        return result;
                    }
                }
            });
            curIndex.status = Status.COMPLETED;
            this.searchTime++;
            curIndex.finishTime = this.searchTime;
            curIndex.weight += 1;
            if (curIndex.parent) {
                curIndex.parent.weight += curIndex.weight;
            }
            vertexToWeightMap.set(index, curIndex.weight);
            if (cutoff_occurred) {
                return Result.CUTOFF;
            }
            else {
                return Result.SUCCESS; 
            }
        }
    }

    async calculateRatingDFID(entrypoint: number, weightGoal:number): Promise<Map<number, number>> {
        let depthLimit = 1;

        while (true) {
            await this.graph.resetVertices();
            const vertexToWeightMap: Map<number, number> = new Map();
            const result = this.DLDFS(entrypoint, depthLimit, vertexToWeightMap, weightGoal);
            if (result == Result.CUTOFF) {
                depthLimit++;
            }
            else if(result == Result.FAILURE) {
                throw new Error("An error occurred while calculating the rating");
            }
            else if(result == Result.SUCCESS) {
                // vertexToWeightMap.set(entrypoint, vertexToWeightMap.size + 1);
                return vertexToWeightMap;
            }
        }
    }
}