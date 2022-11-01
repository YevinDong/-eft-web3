import options from "./uath";
import Lock from "@snapshot-labs/lock/src/lock"
import type Connector from "@snapshot-labs/lock/src/connector"

export interface I_INSTANCE {
    isAuthenticated: boolean,
    provider: any,
    lockClient?: Lock,
    login: (string) => any,
    logout: () => void,
    getConnector: any
}

let instance: I_INSTANCE = {
    isAuthenticated: false,
    provider: undefined,
    lockClient: null,
    async login(connector) {
        const lockConnector: Connector = instance.lockClient.getConnector(connector);
        const localProvider = await lockConnector.connect();
        if (localProvider !== null) {
            instance.provider = localProvider;
        }
        if (instance.provider) {
            localStorage.setItem(`_${name}.connector`, connector);
            instance.isAuthenticated = true;
        }
        return instance.provider;
    },
    async logout() {
        const connector = await instance.getConnector();
        if (connector) {
            const lockConnector = instance.lockClient.getConnector(connector);
            await lockConnector.logout();
            localStorage.removeItem(`_${name}.connector`);
            instance.isAuthenticated = false;
            instance.provider = null;
        }
    },
    async getConnector() {
        const connector = localStorage.getItem(`_${name}.connector`);
        if (connector) {
            const lockConnector = instance.lockClient.getConnector(connector);
            const isLoggedIn = await lockConnector.isLoggedIn();
            return isLoggedIn ? connector : false;
        }
        return false;
    }
};

const useLock = ({ ...options }) => {
    if (instance.lockClient) return instance;
    instance.lockClient = new Lock();
    options.connectors.forEach(connector => {
        instance.lockClient.addConnector(connector);
    });
    return instance;
};


export default function init(): I_INSTANCE {
    return useLock(options);
}
