import { useQuery } from '@tanstack/react-query';
import api from '../api';

export interface Interest {
  _id: string;
  name: string;
  icon: string;
  isActive: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

const fetchInterests = async (): Promise<Interest[]> => {
  const response = await api.get('/admin/interests');
  return response.data;
};

export const useInterests = () => {
  return useQuery({
    queryKey: ['interests'],
    queryFn: fetchInterests,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// GET /interests - Get active interests for users
const fetchActiveInterests = async (): Promise<Interest[]> => {
  const response = await api.get('/interests');
  return response.data;
};

export const useActiveInterests = () => {
  return useQuery({
    queryKey: ['activeInterests'],
    queryFn: fetchActiveInterests,
    staleTime: 5 * 60 * 1000,
  });
};