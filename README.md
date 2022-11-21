# web3 tools

## install

```bash
npm install eft-web3

# or

yarn add eft-web3
```

## use

```js
import eft_web3 from 'eft-web3';
const {Web3 , Vote } = eft_web3;
```

| Export Module |  quick Link   |
| :-----------: | :-----------: |
|     Web3      | [Jump](#web3) |
|     Vote      | [Jump](#vote) |
|   Bignumber   | [Jump](#web3) |

## web3

```javascript
    // init
    import {Web3} from "eft-web3";
    const web3 = Web3.init({
        chainId:1,
        // web3stateReactive:reactive,
    });
    

    // state
    web3.state => {
        account: string;
        network: Record<string, any>;
        walletConnectType: string | null;
        provider: Web3Provider;
    }
    

    // function 
    const {
        getAccount,
        getNetwork,
        getProvider,
        getIsLoggedIn,
        getIsinited
    } = web3;
    // asyc function 
    await web3.login('injected' | 'walletconnect' | 'walletlink');
    await web3.logout();


    // web hooks
    function hookFn(){// do something}
    web.on('login' | 'init' | 'logout' | 'networkChanged' | 'accountChanged' | 'chainChanged',hookFn)
    web.off('login' | 'init' | 'logout' | 'networkChanged' | 'accountChanged' | 'chainChanged',hookFn)
```

## Vote

## BigNumber

> BigNumber is a shortcut to the "@ethersproject/bignumber" file and does not rework the original library
