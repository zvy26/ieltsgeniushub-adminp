import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import type { Interest } from '../queries/interests';

export interface CreateInterestData {
  name: string;
  isActive?: string;
  icon: File;
}

const createInterest = async (data: CreateInterestData): Promise<Interest> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('isActive', data.isActive || 'true');
  formData.append('icon', data.icon);

  const response = await api.post('/admin/interests', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const useCreateInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInterest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
      queryClient.invalidateQueries({ queryKey: ['activeInterests'] });
    },
  });
};

export interface UpdateInterestData {
  name?: string;
  isActive?: string;
  icon?: File | null;
}

const updateInterest = async ({ id, data }: { id: string; data: UpdateInterestData }): Promise<Interest> => {
  const formData = new FormData();
  if (data.name !== undefined) formData.append('name', data.name);
  if (data.isActive !== undefined) formData.append('isActive', data.isActive);
  if (data.icon) formData.append('icon', data.icon);

  const response = await api.put(`/admin/interests/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const useUpdateInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInterest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
      queryClient.invalidateQueries({ queryKey: ['activeInterests'] });
    },
  });
};

const deleteInterest = async (id: string): Promise<void> => {
  await api.delete(`/admin/interests/${id}`);
};

export const useDeleteInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInterest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
      queryClient.invalidateQueries({ queryKey: ['activeInterests'] });
    },
  });
};