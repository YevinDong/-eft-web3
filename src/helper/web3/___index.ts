import Lock, { type I_INSTANCE } from "./lock"
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import networks from "../../config/networks.json";
import options from './lock/uath';
export declare interface I_OPTIONS {
    hook?: I_HOOK,
    chainId: number | string,
    isCover?: boolean,
    web3stateReactive?: <T>(data: T) => T,
}
export declare interface I_HOOK {

}
const defaultNetwork: any = 1;
function def_params() {
    return {
        account: '',
        network: networks[defaultNetwork],
        walletConnectType: null,
        provider: null,
    }
}
class Web3 {
    public state: {
        account: string;
        network: Record<string, any>;
        walletConnectType: string | null;
        provider: Web3Provider;
    }
    private lock: I_INSTANCE;
    private options: I_OPTIONS;

    static clinet: Web3;
    static getWeb3 = () => Web3.clinet;

    constructor(_options: I_OPTIONS) {
        console.log('_options: ', _options);
        let temp = def_params();
        this.lock = Lock();
        this.options = _options;
        if (this.options.web3stateReactive) this.state = this.options.web3stateReactive(temp);
        else this.state = temp;
        Web3.clinet = this;
    }

    private async loadProvider() {
        try {
            this.lock.provider.removeAllListeners &&
                !this.lock.provider.isTorus &&
                this.lock.provider.removeAllListeners();


            if (this.lock.provider.on) {
                this.lock.provider.on('chainChanged', async chainId => {
                    this.handleChainChanged(parseInt(formatUnits(chainId, 0)));
                });
                this.lock.provider.on('accountsChanged', async accounts => {
                    if (accounts.length !== 0) {
                        this.state.account = accounts[0];
                        await this.login();
                    }
                });
                this.lock.provider.on('disconnect', async () => { });
            }


            let network, accounts;
            try {
                [network, accounts] = await Promise.all([
                    this.state.provider.getNetwork(),
                    this.state.provider.listAccounts()
                ]);
                if (network.chainId != this.options.chainId) {
                    await this.lock.provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${this.options.chainId}` }]
                    });
                    network = this.state.provider.getNetwork();
                }
            } catch (e) {
                console.log(e);
            }

            console.log('Network', network);
            console.log('Accounts', accounts);

            this.handleChainChanged(network.chainId);
            const acc = accounts.length > 0 ? accounts[0] : null;

            this.state.account = acc;
            this.state.walletConnectType = this.lock.provider?.wc?.peerMeta?.name || null;
        } catch (e) {
            this.state.account = '';
            return Promise.reject(e);
        }
    }

    private handleChainChanged(chainId) {
        if (!networks[chainId]) {
            networks[chainId] = {
                ...networks[defaultNetwork],
                chainId,
                name: 'Unknown',
                network: 'unknown',
                unknown: true,
            };
        }
        this.state.network = networks[chainId];
    }

    public async login(connector: 'injected' | 'walletconnect' | 'walletlink' = 'injected'): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.lock.login(connector);
                if (this.lock.provider) {
                    this.state.provider = new Web3Provider(this.lock.provider, 'any');
                    await this.loadProvider();
                };
            } catch (e) {
                reject(e)
            } finally {
                resolve();
            }
        });

    }

    public logout() {
        this.lock.logout();
        this.state.account = '';
        return Promise.resolve();
    }
    public getAccount = () => this.state.account;
    public getNetwork = () => this.state.network;
    public getProvider = () => this.state.provider;
    public getIsLoggedIn = () => this.lock.getIsLoggedIn();

}

export default Web3;