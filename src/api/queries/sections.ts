import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { Section } from "@/types/courses";

export const useSectionsQuery = (unitId: string) => {
  return useQuery<Section[], Error>({
    queryKey: ["sections", unitId],
    queryFn: () => 
      api.get(`/admin/units/${unitId}/sections`).then(res => res.data),
    enabled: !!unitId,
  });
};

export const useSectionDetail = (sectionId: string) => {
  return useQuery<Section, Error>({
    queryKey: ["section", sectionId],
    queryFn: () =>
      api.get(`/admin/sections/${sectionId}`).then(res => res.data),
    enabled: !!sectionId,
  });
};