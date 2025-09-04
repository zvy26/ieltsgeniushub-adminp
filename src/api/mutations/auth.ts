import { useMutation } from '@tanstack/react-query'
import type { LoginCredentials, LoginResponse } from '@/types/auth'
import api from '../api'

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => 
      api.post('/auth/login', credentials).then(response => response.data)
  })
}
