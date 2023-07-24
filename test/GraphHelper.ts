
export interface Edge {
    from: number,
    to: number
};

export interface Dummy {
    value: number;
};

export const generate = (nodeNo: number, fillFactor: number): Array<[number, number]> => {
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

