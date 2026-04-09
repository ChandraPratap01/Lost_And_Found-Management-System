import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  sub?: string;
};

export const getCurrentUserEmail = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.sub ?? null;
  } catch {
    return null;
  }
};
