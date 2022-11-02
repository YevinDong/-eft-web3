# web3 tools

# web3 
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