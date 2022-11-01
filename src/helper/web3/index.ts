import Lock, { type I_INSTANCE } from "./lock"
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import networks from "../../config/networks.json";
const defaultNetwork: any = 1;
let lock: I_INSTANCE, web3: Web3Provider, options;
let state: {
    account: string;
    network: Record<string, any>;
    walletConnectType: string | null;
} = {
    account: '',
    network: networks[defaultNetwork],
    walletConnectType: null
}
async function login(connector: 'injected' | 'walletconnect' | 'walletlink' = 'injected'): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            await lock.login(connector);
            if (lock.provider) {
                web3 = new Web3Provider(lock.provider, 'any');
                await loadProvider();
            };
        } catch (e) {
            reject(e)
        } finally {
            resolve();
        }
    });

}

function logout() {
    lock.logout();
    state.account = '';
    return Promise.resolve();
}
async function loadProvider() {
    try {
        lock.provider.removeAllListeners &&
            !lock.provider.isTorus &&
            lock.provider.removeAllListeners();


        if (lock.provider.on) {
            lock.provider.on('chainChanged', async chainId => {
                handleChainChanged(parseInt(formatUnits(chainId, 0)));
            });
            lock.provider.on('accountsChanged', async accounts => {
                if (accounts.length !== 0) {
                    state.account = accounts[0];
                    await login();
                }
            });
            lock.provider.on('disconnect', async () => { });
        }


        let network, accounts;
        try {
            [network, accounts] = await Promise.all([
                web3.getNetwork(),
                web3.listAccounts()
            ]);
            if (network.chainId != options.chainId) {
                await lock.provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${options.chainId}` }]
                });
                network = web3.getNetwork();
            }
        } catch (e) {
            console.log(e);
        }

        console.log('Network', network);
        console.log('Accounts', accounts);

        handleChainChanged(network.chainId);
        const acc = accounts.length > 0 ? accounts[0] : null;

        state.account = acc;
        state.walletConnectType = lock.provider?.wc?.peerMeta?.name || null;
    } catch (e) {
        state.account = '';
        return Promise.reject(e);
    }
}
function handleChainChanged(chainId) {
    if (!networks[chainId]) {
        networks[chainId] = {
            ...networks[defaultNetwork],
            chainId,
            name: 'Unknown',
            network: 'unknown',
            unknown: true,
        };
    }
    state.network = networks[chainId];
}

const _export = {
    state,
    login,
    logout,
    getAccount: () => state.account,
    getNetwork: () => state.network,
}
export default function init(_options) {
    lock = Lock();
    options = _options;
    if(options.web3stateReactive) state = options.web3stateReactive(state);
    return _export;
}