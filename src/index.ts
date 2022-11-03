import "./helper/fix"
import _Web3 from "./helper/web3/index"
import _Contract from "./helper/contract/index"
import _Vote from "./helper/vote/index"
export let Web3 = _Web3;
export let Contract = _Contract;
export let Vote = _Vote;

export default {
    Web3,
    Contract,
    Vote
}