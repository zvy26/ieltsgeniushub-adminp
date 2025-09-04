import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../api"
import type { Lesson, CreateLessonData, UpdateLessonData } from "@/types/courses"

export const useCreateLesson = () => {
  const queryClient = useQueryClient()

  return useMutation<Lesson, Error, CreateLessonData>({
    mutationFn: (lessonData: CreateLessonData) =>
      api.post("/admin/lessons", lessonData).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", data.sectionId] })
    },
  })
}

export const useUpdateLesson = () => {
  const queryClient = useQueryClient()

  return useMutation<Lesson, Error, { id: string; data: UpdateLessonData }>({
    mutationFn: ({ id, data }) => api.put(`/admin/lessons/${id}`, data).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", data.sectionId] })
    },
  })
}

export const useDeleteLesson = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { id: string; sectionId: string }>({
    mutationFn: ({ id }) => api.delete(`/admin/lessons/${id}`).then((response) => response.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", variables.sectionId] })
    },
  })
}
