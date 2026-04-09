import api from "./axios";

export const claimItem = async (itemId: number) => {
  const res = await api.post("/claims", { itemId });
  return res.data;
};

export const approveClaim = async (claimId: number) => {
  const res = await api.put(`/claims/${claimId}/approve`);
  return res.data;
};

export const rejectClaim = async (claimId: number) => {
  const res = await api.put(`/claims/${claimId}/reject`);
  return res.data;
};
