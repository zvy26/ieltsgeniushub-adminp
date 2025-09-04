export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  identifier: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface AuthContextType {
  user: User | null
  login: (user: User, token: string) => void
  logout: () => void
  loading: boolean
}
