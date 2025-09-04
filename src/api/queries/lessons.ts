import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { Lesson } from "@/types/courses";

export const useLessonsQuery = (sectionId: string) => {
  return useQuery<Lesson[], Error>({
    queryKey: ["lessons", sectionId],
    queryFn: () =>
      api.get(`/admin/sections/${sectionId}/lessons`).then(res => res.data),
    enabled: !!sectionId,
  });
};

export const useLessonDetail = (lessonId: string) => {
  return useQuery<Lesson, Error>({
    queryKey: ["lesson", lessonId],
    queryFn: () =>
      api.get(`/admin/lessons/${lessonId}`).then(res => res.data),
    enabled: !!lessonId,
  });
};