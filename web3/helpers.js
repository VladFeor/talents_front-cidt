export function isValidSeiAddress(address) {
  const regex = /^[seiSEI][0-9A-Fa-f]{40}$/;

  return regex.test(address);
}

export function isValidTronAddress(address) {
  const regex = /^(T|A)[0-9A-HJ-NP-Za-km-z]{33}$/;

  return regex.test(address);
}

export function isValidAptosAddress(address) {
  const regex = /^(0x)?[0-9a-fA-F]{64}$/;

  return regex.test(address);
}
