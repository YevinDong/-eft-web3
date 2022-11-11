import snapshot from '@snapshot-labs/snapshot.js';
import Client from '@snapshot-labs/snapshot.js/dist/client';
import Client712 from '@snapshot-labs/snapshot.js/src/sign/index';
import { Vote as TypeVote } from '@snapshot-labs/snapshot.js/dist/sign/types';
let clients = new Map();
interface Strategy {
    name: string;
    network?: string;
    params: any;
}
export default class Vote {
    private client: Client | Client712;
    constructor(_hub: string, is712: boolean = false) {
        if (!clients.has(_hub)) {
            clients.set(_hub,
                is712 ?
                    new snapshot.Client712(_hub) :
                    new snapshot.Client(_hub)
            );
        }
        this.client = clients.get(_hub);
    }

    async castVote(provider, account, space, options: { proposal: any, choice: any });
    async castVote(provider, account, options: TypeVote)
    async castVote(...args) {
        return new Promise((resolve, reject) => {
            this.client.vote.apply(this.client, args).then(receipt => {
                resolve(receipt)
            }).catch(err => reject(err))
        })
    }

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