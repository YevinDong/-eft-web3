import Lock, { type I_INSTANCE } from "./lock"
import { Web3Provider } from '@ethersproject/providers';
import { getInjected } from '@snapshot-labs/lock/src/utils';
import { formatUnits } from '@ethersproject/units';
import networks from "../../config/networks.json";
const defaultNetwork: any = 1;
type T_EVENT_NAME = 'login' | 'init' | 'logout' | 'networkChanged' | 'accountChanged' | 'chainChanged';
type T_OPTIONS = { chainId: number | string, web3stateReactive?: <T>(arg: T) => T };
let lock: I_INSTANCE, options: T_OPTIONS;
let state: {
    inited: boolean;
    account: string;
    network: Record<string, any>;
    walletConnectType: string | null;
    provider: Web3Provider;
} = {
    inited: false,
    account: '',
    network: networks[defaultNetwork],
    walletConnectType: null,
    provider: null
}
let bucket = new Map();
async function login(connector: 'injected' | 'walletconnect' | 'walletlink' = 'injected'): Promise<void> {
    if (!state.inited) return Promise.reject('Please call init first');
    return new Promise(async (resolve, reject) => {
        try {
            await lock.login(connector);
            if (lock.provider) {
                state.provider = new Web3Provider(lock.provider, 'any');
                await loadProvider();
            };
            emit('login');
            resolve();
        } catch (e) {
            reject(e)
        } finally {
        }
    });
}

function logout() {
    if (!state.inited) return Promise.reject('Please call init first');
    lock.logout();
    state.account = '';
    emit('logout');
    return Promise.resolve();
}
async function loadProvider() {
    try {
        lock.provider.removeAllListeners &&
            !lock.provider.isTorus &&
            lock.provider.removeAllListeners();


        if (lock.provider.on) {
            lock.provider.on('chainChanged', async chainId => {
                emit("chainChanged", chainId);
                handleChainChanged(parseInt(formatUnits(chainId, 0)));
            });
            lock.provider.on('accountsChanged', async accounts => {
                if (accounts.length !== 0) {
                    state.account = accounts[0];
                    emit('accountChanged', accounts[0]);
                    await login();
                }
            });
            lock.provider.on('disconnect', async () => { });
        }


        let network, accounts;
        try {
            [network, accounts] = await Promise.all([
                state.provider.getNetwork(),
                state.provider.listAccounts()
            ]);
            if (network.chainId != options.chainId) {
                await lock.provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${options.chainId}` }]
                });
                network = state.provider.getNetwork();
                emit('networkChanged');
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

function on(eventName: T_EVENT_NAME, fn: () => any) {
    bucket.has(eventName) || bucket.set(eventName, new Set());
    bucket.get(eventName).add(fn);
}
function off(eventName: T_EVENT_NAME, fn: () => any) {
    bucket.has(eventName) && bucket.get(eventName).delete(fn);
}
function emit(eventNames: T_EVENT_NAME | T_EVENT_NAME[], ...args) {
    if (eventNames instanceof Array) eventNames.forEach(eventName => run(eventName))
    else run(eventNames);

    function run(name) {
        bucket.has(name) && bucket.get(name).forEach(fn => fn(...args));
    }
}
function init(_options: T_OPTIONS): I_EXPORT {
    state.inited = true;
    lock = Lock();
    options = _options;
    if (options.web3stateReactive) {
        state = options.web3stateReactive(state);
        _export.state = state;
    };
    emit('init');
    return _export;
}
interface I_EXPORT {
    state: typeof state;
    login: typeof login;
    logout: typeof logout;
    on: typeof on;
    off: typeof off;
    init: typeof init;
    getAccount: () => string;
    getNetwork: () => Record<string, any>;
    getProvider: () => Web3Provider;
    getIsinited: () => boolean;
    getIsLoggedIn: () => Promise<boolean>;
    getConnectorName: () => Promise<string>;
    getInjected: () => any;
}
const _export: I_EXPORT = {
    state,
    login,
    logout,
    on,
    off,
    getAccount: () => state.account,
    getNetwork: () => state.network,
    getProvider: () => state.provider,
    getIsinited: () => state.inited,
    getIsLoggedIn: () => lock.getIsLoggedIn(),
    getConnectorName: () => lock.getConnectorName(),
    getInjected,
    init
}
export default _export; 