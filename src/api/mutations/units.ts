import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../api"
import type { Unit, CreateUnitData, UpdateUnitData } from "@/types/courses"

export const useCreateUnit = () => {
  const queryClient = useQueryClient()

  return useMutation<Unit, Error, CreateUnitData>({
    mutationFn: (unitData: CreateUnitData) => api.post("/admin/units", unitData).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["units", data.courseId] })
    },
  })
}

export const useUpdateUnit = () => {
  const queryClient = useQueryClient()

  return useMutation<Unit, Error, { id: string; data: UpdateUnitData }>({
    mutationFn: ({ id, data }) => api.put(`/admin/units/${id}`, data).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["units", data.courseId] })
    },
  })
}

export const useDeleteUnit = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { id: string; courseId: string }>({
    mutationFn: ({ id }) => api.delete(`/admin/units/${id}`).then((response) => response.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["units", variables.courseId] })
    },
  })
}
