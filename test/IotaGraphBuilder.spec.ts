import * as fs from 'fs';
import { Graph, Vertex, IotaGraphBuilder } from '../main/'

(async () => {
    const graphBuilder = new IotaGraphBuilder();
    let references = await graphBuilder.collect();
    console.log(references.size);
    let content = JSON.stringify(references.toJSON());
    fs.writeFile("./tangle.json", content, function (err) {
        if (err) {
            console.log(err);
        }
    });
    let reverseRefs = await graphBuilder.reverseGraph(references);
    content = JSON.stringify(reverseRefs.toJSON());
    fs.writeFile("./reverse-tangle.json", content, function (err) {
        if (err) {
            console.log(err);
        }
    });

    let maxCnt = 0;
    const approvalCnt = new Array<number>();

    reverseRefs.forEach((v:string[], k:string) => {
        approvalCnt.push(v.length);
        if (v.length > maxCnt) {
            maxCnt = v.length;
        }
    });
    console.log('maximum approved messages', maxCnt);
    content = JSON.stringify(approvalCnt);
    fs.writeFile("./approval-cnt-distribution.json", content, function (err) {
        if (err) {
            console.log(err);
        }
    });


}) ();
