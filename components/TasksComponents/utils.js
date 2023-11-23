import { blockchains } from '~/util/onchain';
import { CHAIN_INFO } from '~/web3/constants';

export const taskData = (condition, walletAddress, userId, taskId) => {
  const fields = condition.chain_condition_fields;

  const chainName = fields.find((el) => el.name === 'blockchain')?.value;
  const contractAddress = fields.find((el) => el.name === 'contract_address')?.value;
  const tokenId = fields.find((el) => el.name === 'token_id')?.value;

  const baseQuery = {
    chainName: chainName?.charAt(0)?.toUpperCase() + chainName?.slice(1),
    userId,
    taskId,
  };

  switch (condition.name) {
    case 'user_holds_token':
      return {
        endpoint: 'get_balance',
        query: {
          ...baseQuery,
          contractAddress,
          walletAddress,
          minimumAmount: fields.find((el) => el.name === 'amount')?.value,
        },
      };
    case 'user_holds_nft':
      return {
        endpoint: 'get_nft',
        query: {
          ...baseQuery,
          walletAddress,
          tokenAddress: contractAddress,
          tokenId,
        },
      };
    case 'user_holds_poap':
      return {
        endpoint: 'get_poap',
        query: {
          ...baseQuery,
          walletAddress,
          tokenAddress: contractAddress,
          tokenId,
        },
      };
    case 'tx_not_done':
      return {
        endpoint: 'tx_not_done',
        query: {
          ...baseQuery,
          walletAddress,
          interactedWith: contractAddress,
        },
      };
    case 'token_nft_poap_native_transfers':
      return {
        endpoint: 'get_token_transfers',
        query: {
          ...baseQuery,
        },
      };
    case 'native_token_transfers':
      return {
        endpoint: 'get_token_transfers',
        query: {
          ...baseQuery,
        },
      };
    case 'user_has_ens_domain':
      return {
        endpoint: 'ens_name',
        query: {
          ...baseQuery,
          address: walletAddress,
        },
      };
    case 'user_has_native_token_balance':
      return {
        endpoint: 'native_token_balance',
        query: {
          ...baseQuery,
        },
      };
    case 'user_has_erc_20_tokens':
      return {
        endpoint: 'erc20_token_balance',
        query: {
          ...baseQuery,
        },
      };
    case 'user_has_erc_721_and_erc_1155_tokens':
      return {
        endpoint: 'get_nft',
        query: {
          ...baseQuery,
        },
      };
    case 'interacted_with_blockchain':
      return {
        endpoint: 'interacted_chains',
        query: {
          ...baseQuery,
          address: walletAddress,
        },
      };
    case 'any_chain_action':
      return {
        endpoint: 'any_on_chain_action',
        query: {
          ...baseQuery,
        },
      };
  }
};

export const ON_CHAIN_CONDITIONS = {
  USER_HOLDS_TOKEN: 'user_holds_token',
  USER_HOLDS_NFT: 'user_holds_nft',
  USER_HOLDS_POAP: 'user_holds_poap',
  TOKEN_NFT_POAP_NATIVE_TRANSFERS: 'token_nft_poap_native_transfers',
  TX_NOT_DONE: 'tx_not_done',
  NATIVE_TOKEN_TRANSFERS: 'native_token_transfers',
  ANY_CHAIN_ACTION: 'any_chain_action',
  USER_HAS_ENS_DOMAIN: 'user_has_ens_domain',
  USER_HAS_ERC_20_TOKENS: 'user_has_erc_20_tokens',
  USER_HAS_NATIVE_TOKEN_BALANCE: 'user_has_native_token_balance',
  USER_HAS_ERC_721_AND_ERC_1155_TOKENS: 'user_has_erc_721_and_erc_1155_tokens',
  INTERACTED_WITH_BLOCKCHAIN: 'interacted_with_blockchain',
};

export const getConditionName = (condition) => {
  switch (condition.name) {
    case ON_CHAIN_CONDITIONS.USER_HOLDS_TOKEN:
      return 'Hold Token';
    case ON_CHAIN_CONDITIONS.USER_HOLDS_NFT:
      return 'Hold NFT';
    case ON_CHAIN_CONDITIONS.USER_HOLDS_POAP:
      return 'Hold POAP';
    case ON_CHAIN_CONDITIONS.TX_NOT_DONE:
      return 'Interact with contract';
    case ON_CHAIN_CONDITIONS.USER_HAS_ENS_DOMAIN:
      return 'Have ENS domain';
    case ON_CHAIN_CONDITIONS.INTERACTED_WITH_BLOCKCHAIN:
      return 'Interact with blockchain';
    default:
      return condition.name;
  }
};

export const getConditionValues = (condition) => {
  return condition.chain_condition_fields.reduce(
    (res, field) => ({
      ...res,
      [field.name]:
        field.name === 'blockchain'
          ? blockchains.find((b) => b.value === field.value)?.name || field.value
          : field.value,
    }),
    {},
  );
};

export const getConditionDescription = (condition) => {
  const values = getConditionValues(condition);

  switch (condition.name) {
    case ON_CHAIN_CONDITIONS.USER_HOLDS_TOKEN: {
      const { amount = 0, blockchain, isNativeToken } = values;
      const token = isNativeToken === 'true' ? getNativeToken(blockchain)?.symbol : '';
      return `You must hold at least ${amount} ${token ? token : 'token'} 
      on ${blockchain}`;
    }
    case ON_CHAIN_CONDITIONS.USER_HOLDS_NFT: {
      const { blockchain, token_id, contract_address, nftName } = values;
      return `You must hold <span class="bold">${token_id ? `#${token_id}` : 'any'} ${
        nftName ? nftName : `${contract_address} NFT`
      }</span> on ${blockchain}.`;
    }
    case ON_CHAIN_CONDITIONS.USER_HOLDS_POAP: {
      const { blockchain, token_id, nftName } = values;
      return `You must hold ${token_id ? `#${token_id}` : ''} ${nftName || 'POAP'} on ${blockchain}`;
    }
    case ON_CHAIN_CONDITIONS.TX_NOT_DONE: {
      const { blockchain, contract_address } = values;
      return `You must interact with ${contract_address} on ${blockchain}.`;
    }
    case ON_CHAIN_CONDITIONS.USER_HAS_ENS_DOMAIN: {
      const { blockchain } = values;
      return `You must have ENS Domain on ${blockchain}`;
    }
    case ON_CHAIN_CONDITIONS.INTERACTED_WITH_BLOCKCHAIN: {
      const { blockchain } = values;
      return `You must have at least 1 transaction on ${blockchain}.`;
    }
    default: {
      return condition.name;
    }
  }
};

export const getConditionButtonLabel = (condition) => {
  const values = getConditionValues(condition);

  if (values.actionButtonTitle) return values.actionButtonTitle;

  switch (condition.name) {
    case ON_CHAIN_CONDITIONS.USER_HOLDS_TOKEN: {
      const { amount, blockchain, isNativeToken, tokenName } = values;

      const token = isNativeToken === 'true' ? getNativeToken(blockchain)?.symbol : tokenName;

      return `Buy ${amount} ${token || 'Token'} on ${blockchain}`;
    }
    case ON_CHAIN_CONDITIONS.USER_HOLDS_NFT: {
      const { blockchain } = values;
      return `Buy NFT on ${blockchain}`;
    }
    case ON_CHAIN_CONDITIONS.USER_HOLDS_POAP: {
      const { blockchain, token_id } = values;
      return `Buy POAP on ${blockchain}`;
    }
    case ON_CHAIN_CONDITIONS.TX_NOT_DONE: {
      const { blockchain } = values;
      return `Interact with contract on ${blockchain}.`;
    }
    case ON_CHAIN_CONDITIONS.USER_HAS_ENS_DOMAIN: {
      const { blockchain } = values;
      return `Register ENS Domain on ${blockchain}`;
    }
    case ON_CHAIN_CONDITIONS.INTERACTED_WITH_BLOCKCHAIN: {
      const { blockchain } = values;
      return `Make a transaction on ${blockchain}`;
    }
    default: {
      return condition.name;
    }
  }
};

export const getConditionButtonLink = (condition) => {
  const values = getConditionValues(condition);
  return values?.actionButtonLink;
};

export const conditionStatuses = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  ERROR: 'error',
};

export const getNativeToken = (blockchain) => {
  if (blockchain === 'BNB Chain') {
    blockchain = 'Binance';
  }
  return Object.values(CHAIN_INFO).find((i) => i.label === blockchain)?.nativeCurrency;
};

export const getChainIcon = (blockchain) => {
  if (blockchain === 'BNB Chain') {
    blockchain = 'BSC Test';
  }
  return blockchain;
};
