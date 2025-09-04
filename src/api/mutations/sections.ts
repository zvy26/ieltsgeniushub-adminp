import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../api"
import type { Section, CreateSectionData, UpdateSectionData } from "@/types/courses"

export const useCreateSection = () => {
  const queryClient = useQueryClient()

  return useMutation<Section, Error, CreateSectionData>({
    mutationFn: (sectionData: CreateSectionData) =>
      api.post("/admin/sections", sectionData).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sections", data.unitId] })
    },
  })
}

export const useUpdateSection = () => {
  const queryClient = useQueryClient()

  return useMutation<Section, Error, { id: string; data: UpdateSectionData }>({
    mutationFn: ({ id, data }) => api.put(`/admin/sections/${id}`, data).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sections", data.unitId] })
    },
  })
}

export const useDeleteSection = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { id: string; unitId: string }>({
    mutationFn: ({ id }) => api.delete(`/admin/sections/${id}`).then((response) => response.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sections", variables.unitId] })
    },
  })
}
