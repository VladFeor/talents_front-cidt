import axios from 'axios';

export const claimReward = async (isOnChain, taskId, token) => {
    console.log(token);
  const url = isOnChain
    ? `v2/user-tasks/${taskId}/claim-on-chain`
    : `v2/user-tasks/claim/${taskId}`;

  return axios
    .post(useRuntimeConfig().public.apiBase + url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response);
};
