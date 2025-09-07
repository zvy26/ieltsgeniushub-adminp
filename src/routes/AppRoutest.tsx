import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/providers/AuthProvider"
import Dashboard from "@/pages/Dashboard"
import Layout from "@/components/Layout"
import LoadingSpinner from "@/components/LoadingSpinner"
import Login from "@/pages/auth/Login"
import { Courses } from "@/pages/Courses"
import { CourseUnits } from "@/pages/CourseUnits"
import { UnitSections } from "@/pages/UnitSections"
import { SectionLessons } from "@/pages/SectionLessons"
import { ManageUnits } from "@/pages/ManageUnits"
import { ManageInterests } from "@/pages/ManageInterests"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner />

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

const protectedRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/courses",
    element: <Courses />,
  },
  {
    path: "/interests",
    element: <ManageInterests />,
  },
  {
    path: "/manage-units",
    element: <ManageUnits />,
  },
  {
    path: "/courses/:courseId/units",
    element: <CourseUnits />,
  },
  {
    path: "/courses/:courseId/units/:unitId/sections",
    element: <UnitSections />,
  },
  {
    path: "/courses/:courseId/units/:unitId/sections/:sectionId/lessons",
    element: <SectionLessons />,
  },
]

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {protectedRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <Layout>{element}</Layout>
            </ProtectedRoute>
          }
        />
      ))}

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes