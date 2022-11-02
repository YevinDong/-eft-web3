import { ethers } from 'ethers'
export default class Contract {
    private contract: ethers.Contract;
    private account: string;
    private contractAddress: string;
    private provider: ethers.providers.Web3Provider;
    private abi: any;

    constructor(contractAddress, account, provider, abi) {
        this.contractAddress = contractAddress;
        this.account = account;
        this.provider = provider;
        this.abi = abi;
        this.contract = new ethers.Contract(contractAddress, abi, provider);
    }

    static _wkMap = new WeakMap();
    static useContract(name, contractAddress, account, provider, abi): Promise<Contract> {
        return new Promise((resolve, reject) => {
            try {
                let res;
                if (this._wkMap.get(name)) {
                    res = this._wkMap.get(name);
                } else {
                    this._wkMap.set(name, res = new Contract(contractAddress, account, provider, abi));
                }
                resolve(res);
            } catch (e) {
                reject(e);
            }
        });
    }
    static setContractCache(name, contract) {
        this._wkMap.set(name, contract);
    }
}