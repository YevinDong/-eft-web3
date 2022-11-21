import "./helper/fix"
import _Web3 from "./helper/web3/index"
import _Contract from "./helper/contract/index"
import _Vote from "./helper/vote/index"
import _BigNumber from "./helper/bignumber/index"

export const Web3 = _Web3;
export const Contract = _Contract;
export const Vote = _Vote;
export const BigNumber = _BigNumber;
console.log('eft-web3');
export default {
    Web3,
    Contract,
    Vote,
    BigNumber
}