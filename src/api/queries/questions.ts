import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { QuizQuestion } from "@/types/courses";

export const useQuestionsQuery = (lessonId: string) => {
  return useQuery<QuizQuestion[], Error>({
    queryKey: ["questions", lessonId],
    queryFn: () =>
      api.get(`/admin/lessons/${lessonId}/questions`).then(res => res.data),
    enabled: !!lessonId,
  });
};

export const useQuestionDetail = (questionId: string) => {
  return useQuery<QuizQuestion, Error>({
    queryKey: ["question", questionId],
    queryFn: () =>
      api.get(`/admin/questions/${questionId}`).then(res => res.data),
    enabled: !!questionId,
  });
};