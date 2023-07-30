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
    DLDFS(index: number, depthLimit:number, vertexMap: Map<number, Vertex<T>>, weigthGoal: number) {

        this.searchTime = 0;
        let result = Result.CUTOFF;
        const curVertex = this.graph.vertices[index];

        if (curVertex.status == Status.NEW) {
            curVertex.status = Status.VISITED;
        }

        const vertexToWeightMap = this.convertMap(vertexMap);
        if (Math.max(...vertexToWeightMap.values()) >= weigthGoal) {
            return Result.SUCCESS;
        }
        else if (depthLimit == 0) {
            return Result.CUTOFF;
        }
        else {
            for (let adjIndex of this.graph.adj[index]) {         
                const adjVertex = this.graph.vertices[adjIndex]
                adjVertex.parent = curVertex;
                const adjIndexRes = this.DLDFS(adjIndex, depthLimit - 1, vertexMap, weigthGoal);
                if(adjIndexRes == Result.SUCCESS) {
                    result = Result.SUCCESS;
                    // break;
                }
            }
    
            if(curVertex.status == Status.VISITED) {
                this.searchTime++;
                curVertex.finishTime = this.searchTime;
                curVertex.weight += 1;
                if (curVertex.parent) {
                    let ancestor= curVertex.parent;
                    while(ancestor != null) {
                        ancestor.weight += curVertex.weight;
                        ancestor = ancestor.parent;
                    } 
                }
                vertexMap.set(index, curVertex);
                curVertex.status = Status.COMPLETED;
            }
            
            return result;
        }
    }

    convertMap(vertexMap: Map<number, Vertex<T>>) {
        const vertexToWeightMap: Map<number, number> = new Map();

        vertexMap.forEach((value, key) => {
            vertexToWeightMap.set(key, value.weight);
        });
        return vertexToWeightMap;
    }

    async calculateRatingDFID(entrypoint: number, maxDepth: number, weightGoal:number): Promise<Map<number, number>> {
        let depthLimit = 1;
        await this.graph.resetVertices();
        const vertexMap: Map<number, Vertex<T>> = new Map();

        while (true) {
            const result = this.DLDFS(entrypoint, depthLimit, vertexMap, weightGoal);
            if(depthLimit >= maxDepth || result == Result.SUCCESS) {
                // vertexToWeightMap.set(entrypoint, vertexToWeightMap.size + 1);
                const vertexToWeightMap = this.convertMap(vertexMap);
                return vertexToWeightMap;
            }
            depthLimit++;
        }
    }
}