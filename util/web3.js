import { ethers } from 'ethers';
import { ConnectionType } from '~/web3/connection';
import { metamask, walletconnect, petra, tronlink, compass } from '@/constants/icons';

export function shortenAddress(address, chars = 4) {
  // const parsed = ethers.utils.isAddress(address);
  // if (!parsed) {
  //   throw Error(`Invalid 'address' parameter '${address}'.`);
  // }
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

export const getAprosPetraProvider = () => {
  if (typeof window !== 'undefined' && window.aptos) {
    return window.aptos;
  } else {
    window.open('https://petra.app/', '_blank');
    return null;
  }
};

export const getCurrentWalletIcon = (type) => {
  switch (type) {
    case ConnectionType.METAMASK:
      return metamask;
    case ConnectionType.WALLET_CONNECT:
      return walletconnect;
    case ConnectionType.TRONLINK:
      return tronlink;
    case ConnectionType.APTOS_PETRA:
      return petra;
    case ConnectionType.COMPASS:
      return compass;

    default:
      return metamask;
  }
};