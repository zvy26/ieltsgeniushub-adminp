export interface Interest {
  id: string
  name: string
  description: string
  icon: string // This will store the Lucide icon name
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateInterestData {
  name: string
  description: string
  icon: string
  isActive?: boolean
}

export interface UpdateInterestData {
  id: string
  name?: string
  description?: string
  icon?: string
  isActive?: boolean
}