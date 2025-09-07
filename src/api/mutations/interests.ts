import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import type { CreateInterestData, UpdateInterestData, Interest } from '@/types/interests'

export const useCreateInterestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateInterestData): Promise<Interest> => {
      const response = await api.post('/interests', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] })
    },
  })
}

export const useUpdateInterestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateInterestData): Promise<Interest> => {
      const { id, ...updateData } = data
      const response = await api.put(`/interests/${id}`, updateData)
      return response.data
    },
    onSuccess: (updatedInterest: Interest) => {
      queryClient.invalidateQueries({ queryKey: ['interests'] })
      queryClient.invalidateQueries({ queryKey: ['interests', updatedInterest.id] })
    },
  })
}

export const useDeleteInterestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/interests/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] })
    },
  })
}