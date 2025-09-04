import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { Unit } from "@/types/courses";

export const useUnitsQuery = (courseId: string) => {
  return useQuery<Unit[], Error>({
    queryKey: ["units", courseId],
    queryFn: () => 
      api.get(`/admin/courses/${courseId}/units`).then(res => res.data),
    enabled: !!courseId,
  });
};

export const useUnitDetail = (unitId: string) => {
  return useQuery<Unit, Error>({
    queryKey: ["unit", unitId],
    queryFn: () =>
      api.get(`/admin/units/${unitId}`).then(res => res.data),
    enabled: !!unitId,
  });
};