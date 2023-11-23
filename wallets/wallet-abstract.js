export class WalletAbstract {
  type;
  address;
  error;
  connector;
  provider;

  constructor() {
    this.type = '';
    this.address = '';
    this.error = '';
    this.connector = '';
    this.provider = '';
  }

  checkConnection = async () => {
    return this;
  };

  connect = async () => {
    return this;
  };

  getNetwork = (chainId) => {
    // Add implementation
  };

  getChainId = async () => {
    // Add implementation
  };

  getBalance = async () => {
    // Add implementation
  };

  getProvider = () => {
    // Add implementation
  };

  switchNetwork = async (chainId) => {
    // Add implementation
  };
}
