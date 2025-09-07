import { useQuery } from '@tanstack/react-query'
import api from '../api'
import type { Interest } from '@/types/interests'

export const useInterestsQuery = () => {
  return useQuery({
    queryKey: ['interests'],
    queryFn: async (): Promise<Interest[]> => {
      const response = await api.get('/interests')
      return response.data
    },
  })
}

export const useInterestQuery = (id: string) => {
  return useQuery({
    queryKey: ['interests', id],
    queryFn: async (): Promise<Interest> => {
      const response = await api.get(`/interests/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}