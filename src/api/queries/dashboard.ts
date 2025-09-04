import { useQuery } from "@tanstack/react-query"
import api from "../api"
import type { DashboardStats } from "@/types/courses"

export const useDashboardQuery = () => {
  return useQuery<DashboardStats, Error>({
    queryKey: ["dashboard"],
    queryFn: () => api.get("/admin/dashboard").then((response) => response.data),
  })
}
