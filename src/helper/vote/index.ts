import snapshot from '@snapshot-labs/snapshot.js';
import Client from '@snapshot-labs/snapshot.js/dist/client';
import { getScores } from "@snapshot-labs/snapshot.js/dist/utils";
import { Vote as TypeVote } from '@snapshot-labs/snapshot.js/dist/sign/types';
let clients = new Map();
interface Strategy {
    name: string;
    network?: string;
    params: any;
}
export default class Vote {
    private client: Client;
    constructor(_hub: string) {
        if (!clients.has(_hub)) {
            clients.set(_hub, new snapshot.Client(_hub));
        }
        this.client = clients.get(_hub);
    }


    async castVote(provider, account, space, options: { proposal: any, choice: any }) {
        // {
        //     space: 'yam.eth',
        //     proposal: '0x21ea31e896ec5b5a49a3653e51e787ee834aaf953263144ab936ed756f36609f',
        //     type: 'single-choice',
        //     choice: 1,
        //     reason: 'Choice 1 make lot of sense',
        //     app: 'my-app'
        // }
        return new Promise((resolve, reject) => {
            this.client.vote(provider, account, space, options).then(receipt => {
                resolve(receipt)
            }).catch(err => reject(err))
        })
    }

    // async createProposal() {
    //     return new Promise(() => {
    //         new this.client.proposal(web3, account, {
    //             space: 'yam.eth',
    //             type: 'single-choice',
    //             title: 'Test proposal using Snapshot.js',
    //             body: 'This is the content of the proposal',
    //             choices: ['Alice', 'Bob', 'Carol'],
    //             start: 1636984800,
    //             end: 1637244000,
    //             snapshot: 13620822,
    //             network: '1',
    //             plugins: JSON.stringify({}),
    //             app: 'my-app'
    //         });
    //     })
    // }
    async getScores(space: string, strategies: Strategy[], network: string, voters: string[], blockNumber?: number | string, scoreApiUrl?: string) {
        return new Promise((resolve, reject) => {
            snapshot.utils.getScores(
                space,
                strategies,
                network,
                voters,
                blockNumber
            ).then(scores => resolve(scores)).catch(err => reject(err));
        })
    }
    public getClicent() {
        return this.client;
    }
    public getSnapshot() {
        return snapshot;
    }
}