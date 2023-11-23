export const GATE_CONDITIONS = {
  ANY_NFT_FROM_COLLECTION: 'any_nft_from_a_collection',
  SPECIFIC_NFT_FROM_COLLECTION: 'specific_nft_from_a_collection',
  MINIMUN_AMOUNT_OF_TOKEN: 'minimum_amount_of_token',
  WHITELIST_OF_WALLET_ADRESSES: 'whitelist_of_wallet_addresses',
};

export const GATE_CONDITION_DATA = {
  [GATE_CONDITIONS.ANY_NFT_FROM_COLLECTION]: { icon: '@/assets/icons/NFT.svg', label: 'Any NFT from a collection' },
  [GATE_CONDITIONS.SPECIFIC_NFT_FROM_COLLECTION]: {
    icon: '@/assets/icons/NFT.svg',
    label: 'Specific NFT from a collection',
  },
  [GATE_CONDITIONS.MINIMUN_AMOUNT_OF_TOKEN]: { icon: '@/assets/icons/wallet/Wallet.svg', label: 'Minimum amount of token' },
  [GATE_CONDITIONS.WHITELIST_OF_WALLET_ADRESSES]: {
    icon: '@/assets/icons/File.svg',
    label: 'Whitelist of wallet addresses',
  },
};
