# web3 tools

&nbsp;

## install

```bash
npm install eft-web3

# or

yarn add eft-web3
```

&nbsp;

## use

```js
import eft_web3 from 'eft-web3';
const {Web3 , Vote } = eft_web3;
```

| Export Module |   quick Link   |
| :-----------: | :------------: |
|     Web3      | [Jump](#web3)  |
|     Vote      | [Jump](#vote)  |
|   Bignumber   | [Jump](#web3)  |
|     utils     | [Jump](#utils) |

&nbsp;

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

&nbsp;

## Vote

`TODO`

&nbsp;

## BigNumber

> BigNumber is a shortcut to the "@ethersproject/bignumber" file and does not rework the original library

&nbsp;

## Utils

```javaScript
import {Utils} from "eft-web3";
const address = `0x1234567890123456789012345678901234567890`;

/**
 * @name shorten
 * @param {string} address
 * @param {key} number | 'symbol' | 'name' | 'choice' | undefinded
 */

// if key is undefinded , return Utils.shortenAddress(address) 
Utils.shorten(address) // 0x1234...7890 

// if key === number limit = key;
// if key === 'symbol' limit = 6;
// if key === 'name' limit = 64;
// if key === 'choice' limit = 12;
// return address.slice(0...limit)
Utils.shorten(address,5) // 0x123...
Utils.shorten(address,'symbol') // 0x1234...
```
