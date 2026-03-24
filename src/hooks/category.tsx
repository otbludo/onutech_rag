import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "../api/client";

/**
 * Récupérer toutes les categories.
 */
export const useGetCategory = () => {
  return useQuery({
    queryKey: ["useGetCategory"],
    queryFn: () => request("/api/v1/category", "GET"),
    refetchOnWindowFocus: false,
  });
};
