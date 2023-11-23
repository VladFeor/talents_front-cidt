import { WalletAbstract } from './wallet-abstract';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { ethers } from 'ethers';
import { RPC_URLS } from '~/web3/web3';

const WALLET_METHODS = [
  'personal_sign',
  'eth_sendTransaction',
  'eth_accounts',
  'eth_requestAccounts',
  'eth_call',
  'eth_getBalance',
  'eth_sendRawTransaction',
  'eth_sign',
  'eth_signTransaction',
  'eth_signTypedData',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
  'wallet_switchEthereumChain',
  'wallet_addEthereumChain',
  'wallet_getPermissions',
  'wallet_requestPermissions',
  'wallet_registerOnboarding',
  'wallet_watchAsset',
  'wallet_scanQRCode',
];

const allChainIds = [
  1, 42161, 10, 137, 42220, 56, 97, 43114, 71402, 250, 100, 1284, 42262, 23294, 1313161554, 122,
  324, 1666600000, 1285, 128, 66, 40, 7001, 534353, 25, 338, 2046399126, 476158412, 4689, 4690,
];

const RPC_URLS_WITHOUT_FALLBACKS = Object.entries(RPC_URLS).reduce(
  (map, [chainId, urls]) => ({
    ...map,
    [chainId]: urls[0],
  }),
  {},
);

export class WalletConnectorV2 extends WalletAbstract {
  constructor() {
    super();

    this.initializeWalletConnect();
  }

  async initializeWalletConnect() {
    const chainIds = [1];

    this.connector = await EthereumProvider.init({
      projectId: '276d8971dd5b4b5490f107c75a0e280d',
      chains: [chainIds],
      showQrModal: true,
      optionalChains: allChainIds,
      rpcMap: RPC_URLS_WITHOUT_FALLBACKS,
      methods: WALLET_METHODS,
      optionalMethods: WALLET_METHODS,
    });
  }

  connect = async () => {
    try {
      await this.initializeWalletConnect();

      const accounts = await this.connector.enable();

      this.address = accounts[0];
    } catch (error) {
      console.log('WALLET CONNECT V2 CONNECT ERROR', error);
    }

    return this;
  };

  getProvider = () => {
    return new ethers.providers.Web3Provider(this.connector);
  };

  getConnector = () => {
    return this.connector;
  };

  getAccount = () => {
    return this.address;
  };

  getChainId = async () => {
    try {
      return this.connector.chainId;
    } catch (error) {
      console.log('getChainId error', error);
      return 1;
    }
  };

  getBalance = async () => {
    try {
      const provider = this.getProvider();
      if (provider) {
        const address = this.address;
        const balance = await provider.getBalance(address);

        return balance.toString();
      } else {
        return 0;
      }
    } catch (err) {
      console.error('Failed to retrieve balance:', err);
    }
  };
}
