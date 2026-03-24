import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "../api/client";

/**
 * Récupérer toutes les réalisations.
 */
export const useGetRealisations = () => {
  return useQuery({
    queryKey: ["useGetRealisations"],
    queryFn: () => request("/api/v1/realisation", "GET"),
    refetchOnWindowFocus: false,
  });
};

/**
 * Créer une nouvelle réalisation.
 */
export const useCreateRealisation = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, FormData>({
    mutationKey: ["useCreateRealisation"],
    mutationFn: (formData) => request("/api/v1/realisation", "POST", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetRealisations"] });
    },
  });
};

/**
 * Mettre à jour une réalisation existante.
 */
/**
 * Mettre à jour une réalisation existante.
 */
export const useUpdateRealisation = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { id: string | number; formData: FormData }>({
    mutationKey: ["useUpdateRealisation"],
    mutationFn: ({
      id,
      formData,
    }: {
      id: string | number;
      formData: FormData;
    }) => request(`/api/v1/realisation/${id}`, "PUT", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetRealisations"] });
    },
  });
};

/**
 * Supprimer une réalisation.
 */
type DeleteRealisationResponse = {
  success: boolean;
  message: string;
};

export const useDeleteRealisation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteRealisationResponse, Error, number>({
    mutationKey: ["useDeleteRealisation"],
    mutationFn: (id: number) => request(`/api/v1/realisation/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetRealisations"] });
    },
  });
};
