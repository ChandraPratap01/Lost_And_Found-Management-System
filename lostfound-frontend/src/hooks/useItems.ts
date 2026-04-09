import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await api.get("/items");
      return res.data;
    },
  });
};