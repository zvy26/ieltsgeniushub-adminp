import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import type { Course, CreateCourseData, UpdateCourseData } from '@/types/courses'

export const useCreateCourse = () => {
  const queryClient = useQueryClient()

  return useMutation<Course, Error, CreateCourseData>({
    mutationFn: (courseData: CreateCourseData) => {
      const formData = new FormData()
      
      formData.append('title', courseData.title)
      formData.append('description', courseData.description)
      formData.append('duration', courseData.duration)
      formData.append('level', courseData.level)
      
      if (courseData.picture) {
        formData.append('picture', courseData.picture)
      }

      return api.post('/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => response.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    }
  })
}

export const useUpdateCourse = () => {
  const queryClient = useQueryClient()

  return useMutation<Course, Error, { id: string; data: UpdateCourseData }>({
    mutationFn: ({ id, data }) => {
      const formData = new FormData()
      
      if (data.title) formData.append('title', data.title)
      if (data.description) formData.append('description', data.description)
      if (data.duration) formData.append('duration', data.duration)
      if (data.level) formData.append('level', data.level)
      
      if (data.picture) {
        formData.append('picture', data.picture)
      }

      return api.put(`/courses/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => response.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    }
  })
}

export const useDeleteCourse = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => 
      api.delete(`/courses/${id}`).then(response => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    }
  })
}
