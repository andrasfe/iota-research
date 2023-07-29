
 export enum Status {
  NEW,
  VISITED,
  COMPLETED
}

/**
 * Vertices defined here
 *
 * @export
 * @class Vertex
 * @template I
 * @template T
 */
export class Vertex<T> {
  data: T;
  parent: Vertex<T>;
  discoveryTime = 0;
  finishTime = 0;
  weight = 0;
  status = Status.NEW;
  /**
   * Creates an instance of Vertex.
   * @param {T} data
   * @memberof Vertex
   */
  constructor(data: T) {
    this.data = data;
  }
}