import "./helper/fix"
import _Web3 from "./helper/web3/index"
import _Contract from "./helper/contract/index"
import _Vote from "./helper/vote/index"
import _BigNumber from "./helper/bignumber/index"
import _Utils from "./helper/utils/index"
import { version } from "../package.json"
export const Web3 = _Web3;
export const Contract = _Contract;
export const Vote = _Vote;
export const BigNumber = _BigNumber;
export const Utils = _Utils;
console.log(`✅ eft-web3 version: v${version}` );
export default {
    Web3,
    Contract,
    Vote,
    BigNumber,
    Utils
}