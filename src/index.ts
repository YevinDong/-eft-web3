import "./helper/fix"
import _Web3 from "./helper/web3/index"
import _Contract from "./helper/contract/index"

export let Web3 = _Web3;
export let Contract = _Contract;

export default {
    Web3,
    Contract
}