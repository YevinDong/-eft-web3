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
}