import { ClientBuilder } from '@iota/client'
import { TSMap } from "typescript-map"

const IOTA_NODE = 'https://chrysalis-nodes.iota.org';
const TIMEOUT = 1800000;
const TOPICS = ['messages', 'messages/referenced'];
const MESSAGE_ID = 'messageId';
const PARENT_MESSAGE_IDS = 'parentMessageIds';

export class IotaGraphBuilder {
    node: string;
    timeout: number;

    constructor(node = IOTA_NODE, timeout = TIMEOUT) {
        this.node = node;
        this.timeout = timeout;
    }

    /**
     * Method for collecting subtangle for a duration defined by TIMEOUT
     *
     * @return {*}  {Promise<TSMap<string, Array<string>>>}
     * @memberof IotaGraphBuilder
     */
    async collect(): Promise<TSMap<string, Array<string>>> {
        let references = new Map<string, Set<string>>();

        // client connects to a node that has MQTT enabled
        const client = new ClientBuilder()
            .node(this.node)
            .build();

        client.subscriber().topics(TOPICS).subscribe((err: any, data: any) => {
            const payload = JSON.parse(data.payload)
            const key = payload[MESSAGE_ID]
            if (key != undefined) {
                const value = payload[PARENT_MESSAGE_IDS]
                let existing = references.get(key)
                if (existing == null) {
                    existing = new Set<string>();
                }
                const newSet = new Set(value);
                newSet.forEach((elem: string) => {
                    if(elem != key) {
                        existing.add(elem)
                    }
                    else {
                        console.log('key is also value!!');
                    }
                });
                references.set(key, existing)
            }
        })

        await new Promise(resolve => setTimeout(resolve, this.timeout));
        // unsubscribe from 'messages' topic, will continue to receive events for 'milestones/confirmed'
        client.subscriber().topics(TOPICS).unsubscribe((err: any, data: any) => {
            console.log(data);
        })

        const output = new TSMap<string, Array<string>>();
        references.forEach((value: Set<string>, key: string) => { output.set(key, Array.from(value.values())) })
        return output;
    }

    /**
     * This method required for statistical analysis purposes. we create a histogram to show number of
     * approvals performed by tips.
     *
     * @param {TSMap<string, Array<string>>} tranToParents
     * @return {*}  {Promise<TSMap<string, Array<string>>>}
     * @memberof IotaGraphBuilder
     */
    async reverseGraph(tranToParents:TSMap<string, Array<string>>): Promise<TSMap<string, Array<string>>> {
        const output = new TSMap<string, Array<string>>();
        tranToParents.forEach((value: Array<string>, key: string) => { 
           value.forEach((item)=> {
               let adj = output.get(item);

               if(adj == null) {
                   adj = [];
               }

               adj.push(key);
               output.set(item, adj);
           });
        });

        return output;
    } 

    
}
