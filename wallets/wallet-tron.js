import { WalletAbstract } from './wallet-abstract';

export class WalletTron extends WalletAbstract {
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

  connectWallet = async () => {
    const nuxtApp = useNuxtApp();
    if (typeof window !== 'undefined' && window.tronWeb) {
      if (window.tronLink.ready) {
        try {
          const address = window.tronWeb.defaultAddress.base58;

          this.address = address;
        } catch (err) {
          this.error = err.message;
          this.resetWallet();
        }

        return this;
      } else {
        nuxtApp.$alert.show(`Connect Tronlink wallet`, {
          type: 'error',
          timeout: 5000,
        });
        try {
          const res = await window.tronLink.request({ method: 'tron_requestAccounts' });
          if (res.code === 200) {
            await this.connectWallet();
          }
        } catch (error) {
          console.log('error TRONLINK', error);
        }
      }
    } else {
      this.error = 'Please install TronLink';
      return window.open(
        'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
        '_blank',
      );
    }
  };

  getBalance = async () => {
    return await window.tronWeb.trx.getBalance(this.address);
  };

  getAccount = () => {
    return this.address;
  };

  getNetwork = (chainId) => {
    window.tronWeb.trx
      .getNetwork()
      .then((network) => {
        if (network === 'nile') {
          console.log('Tron Nile network');
        } else if (network === 'grid') {
          console.log('Tron Grid network');
        } else {
          console.log('Unknown network');
        }
      })
      .catch((error) => {
        console.error('Failed to get Tron network:', error);
      });
  };

  getProvider = () => {
    if (typeof window !== 'undefined' && window.tronLink) {
      return window.tronLink.tronWeb;
    } else {
      throw new Error('TronLink not available');
    }
  };
}
