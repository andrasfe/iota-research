import { Status, Vertex } from './Vertex';


interface Simple {
  value: number;
};

/**
 * Class encapsulating graph functionality
 *
 * @export
 * @class Graph
 * @template T
 */
export class Graph<T> {
  adj: Array<number[]>;
  vertices: Array<Vertex<T>>;
  searchTime: number;

  /**
   * Creates an instance of Graph.
   * @memberof Graph
   */
  constructor() {
    this.adj = [];
    this.vertices = [];
  }

  /**
   * Add a vertex to the Graph. It is not connected at this point
   *
   * @param {Vertex<T>} vertex
   * @memberof Graph
   */
  addVertex(vertex: Vertex<T>) {
    this.adj.push([]);
    this.vertices.push(vertex);
  }
  /**
   * Prepare verticles for a new search
   *
   * @memberof Graph
   */
  async resetVertices() {
    this.vertices.forEach((vertex) => {
      vertex.status = Status.NEW;
      vertex.weight = 0;
    });
  }

  /**
   * Connects 2 vertices
   *
   * @param {I} fromIndex
   * @param {I} toIndex
   * @memberof Graph
   */
  connect(fromIndex: number, toIndex: number) {
    this.adj[fromIndex].push(toIndex);
  }

  getAdjacentVertices(index: number): number[] {
    return [...this.adj[index]];
  }

  static async fromTangle(tangle: Map<string, string[]>): Promise<Graph<Simple>> {
    const graph = new Graph<Simple>();
    const keyMap = new Map<string, number>();
    let last = 0;

    tangle.forEach((value, key) => {
      let fromKey = keyMap.get(key);

      if (fromKey == null) {
        keyMap.set(key, last);
        fromKey = last;
        graph.addVertex(new Vertex({ 'value': fromKey }));
        last++;
      }

      value.forEach(val => {
        let toKey = keyMap.get(val);

        if (toKey == null) {
          keyMap.set(val, last);
          toKey = last;
          graph.addVertex(new Vertex({ 'value': toKey }));
          last++;
        }

        graph.connect(fromKey, toKey)
      });

    });
    return graph;
  }
}

