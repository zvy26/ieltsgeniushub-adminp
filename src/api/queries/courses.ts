import { useQuery } from '@tanstack/react-query'
import api from '../api'
import type { Course } from '@/types/courses'

export const useCoursesQuery = () => {
  return useQuery<Course[], Error>({
    queryKey: ['courses'],
    queryFn: () =>
      api.get('/courses').then(response => response.data)
  })
}

export const useCourseDetailQuery = (id: string) => {
  return useQuery<Course, Error>({
    queryKey: ['course', id],
    queryFn: () =>
      api.get(`/courses/${id}`).then(response => response.data),
    enabled: !!id
  })
}
