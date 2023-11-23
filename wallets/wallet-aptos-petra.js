import { WalletAbstract } from '@/wallets/wallet-abstract';
import { getAprosPetraProvider } from '~/util/web3';

export class WalletAptosPetra extends WalletAbstract {
  constructor() {
    super();
  }

  checkConnection = async () => {
    await this.connectWallet();
    return this;
  };

  connect = async () => {
    await this.connectWallet();
    return this;
  };

  getAccount = () => {
    return this.address;
  };

  connectWallet = async () => {
    if (typeof window !== 'undefined' && window.aptos) {
      try {
        const petraWallet = getAprosPetraProvider();

        const account = await petraWallet.connect();

        if (!account || (account && !account.address)) {
          return;
        }
        this.address = account.address;
        this.connector = window.aptos;

        return this;
      } catch (err) {
        this.error = err.message;
        console.log('APTOS err', err);

        this.resetWallet();
      }
    } else {
      this.error = 'Please install Petra';
      window.open(
        'https://chrome.google.com/webstore/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci',
        '_blank',
      );
    }
  };

  getChainId = async () => {
    const provider = this.getProvider();
    const response = await provider.network();
    console.log('response getNetwork APTOS', response);

    return 'APTOS_MAINNET';
  };

  getProvider = () => {
    return getAprosPetraProvider();
  };
}
