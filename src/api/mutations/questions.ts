import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../api"
import type { QuizQuestion, CreateQuestionData, UpdateQuestionData } from "@/types/courses"

export const useCreateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation<QuizQuestion, Error, { lessonId: string; data: CreateQuestionData }>({
    mutationFn: ({ lessonId, data }) =>
      api.post(`/admin/lessons/${lessonId}/questions`, data).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["questions", data.lessonId] })
    },
  })
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation<QuizQuestion, Error, { id: string; data: UpdateQuestionData }>({
    mutationFn: ({ id, data }) => api.put(`/admin/questions/${id}`, data).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["questions", data.lessonId] })
    },
  })
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { id: string; lessonId: string }>({
    mutationFn: ({ id }) => api.delete(`/admin/questions/${id}`).then((response) => response.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questions", variables.lessonId] })
    },
  })
}

export const useBulkCreateQuestions = () => {
  const queryClient = useQueryClient()

  return useMutation<
    { message: string; createdCount: number; questions: QuizQuestion[] },
    Error,
    { lessonId: string; questions: CreateQuestionData[] }
  >({
    mutationFn: ({ lessonId, questions }) =>
      api.post(`/admin/lessons/${lessonId}/questions/bulk`, { questions }).then((response) => response.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questions", variables.lessonId] })
    },
  })
}
