import axiosService from '~/service/axiosService';
import { GATE_CONDITIONS } from './utils';

export const getConditionGroups = (type, conditions) => {
  const groups = {};

  if (type === 'project') {
    for (let group in GATE_CONDITIONS) {
      const filtered = conditions.filter((el) => el.name === GATE_CONDITIONS[group]);
      if (filtered.length > 0) {
        groups[group] = filtered;
      }
    }
  } else if (type === 'task') {
    for (let group in GATE_CONDITIONS) {
      const groupObj = conditions.find(
        (el) => el.name === GATE_CONDITIONS[group] && el.type === 'gate',
      );
      if (groupObj && Object.keys(groupObj).length) {
        groups[group] = groupObj.chain_condition_fields;
      }
    }
  }

  return groups;
};

export const getTypeField = (type) => (type.toLowerCase() === 'project' ? 'field_name' : 'name');

export const getGateFields = (walletAddress, conditionGroups, type, condition) => {
  let dataObj = { walletAddress };

  const typeField = getTypeField(type);

  const blockchain = conditionGroups[condition].find((el) => el[typeField] === 'blockchain');
  const contractAddress = conditionGroups[condition].find(
    (el) => el[typeField] === 'contractAddress',
  );
  const quantity = conditionGroups[condition].find((el) => el[typeField] === 'quantity');
  const tokenId = conditionGroups[condition].find((el) => el[typeField] === 'tokenId');
  const nftName = conditionGroups[condition].find((el) => el[typeField] === 'nftName');
  const imgSrc = conditionGroups[condition].find((el) => el[typeField] === 'imgSrc');
  console.log('SDL', conditionGroups[condition]);
  dataObj = { ...dataObj, nftName, imgSrc };

  if (blockchain) {
    dataObj['chainName'] = blockchain.value;
  }
  if (contractAddress) {
    dataObj['contractAddress'] = contractAddress.value;
  }
  if (quantity) {
    dataObj['minAmount'] = quantity.value;
  }
  if (tokenId) {
    dataObj['tokenId'] = tokenId.value;
  }

  return dataObj;
};

export const verifyGateCondition = async (
  gateOf, // project || task
  gateOfId,
  condition,
  payload,
) => {
  switch (condition) {
    case 'WHITELIST_OF_WALLET_ADRESSES':
      return axiosService
        .get(useRuntimeConfig().public.apiBaseV2 + `${gateOf}s/${gateOfId}/whitelist`)
        .then(({ data: whitelisted }) => whitelisted);
    default:
      return axiosService
        .get(useRuntimeConfig().public.apiChain + `verifications/gate`, payload)
        .then(({ data }) => data.res?.canAccess);
  }
};

export const IPFS_PROVIDER_URL = 'https://ipfs.io/ipfs/'

export const getNFTImage = (url) => {
  return url?.startsWith('ipfs://') ? url.replace('ipfs://', IPFS_PROVIDER_URL) : url;
};
