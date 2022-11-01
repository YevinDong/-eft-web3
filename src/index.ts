import "./helper/fix"
import web3 from "./helper/web3/index"
import { I_OPTIONS } from "./index.d"
export default function init(options: I_OPTIONS) {
    return {
        web3: web3(options)
    }
}

