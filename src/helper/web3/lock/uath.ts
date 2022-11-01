import injected from '@snapshot-labs/lock/connectors/injected';
import walletconnect from '@snapshot-labs/lock/connectors/walletconnect';
import connectors from '../../../config/connectors.json';
import walletlink from '@snapshot-labs/lock/connectors/walletlink';

const options: any = { connectors: [] };
const lockConnectors = {
  injected,
  walletconnect,
  walletlink,  
};

Object.entries(connectors).forEach((connector: any) => {
  options.connectors.push({
    key: connector[0],
    connector: lockConnectors[connector[0]],
    options: connector[1].options
  });
});

export default options;
