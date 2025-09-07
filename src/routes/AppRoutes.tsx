import type React from "react"
import { Routes, Route } from "react-router-dom"
import { CourseUnits } from "@/pages/CourseUnits"
import Dashboard from "@/pages/Dashboard"
import { Courses } from "@/pages/Courses"
import { UnitSections } from "@/pages/UnitSections"
import { SectionLessons } from "@/pages/SectionLessons"
import { ManageUnits } from "@/pages/ManageUnits"
import ManageInterests from "@/pages/ManageInterests"

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/interests" element={<ManageInterests />} />
      <Route path="/manage-units" element={<ManageUnits />} />
      <Route path="/courses/:courseId/units" element={<CourseUnits />} />
      <Route path="/courses/:courseId/units/:unitId/sections" element={<UnitSections />} />
      <Route path="/courses/:courseId/units/:unitId/sections/:sectionId/lessons" element={<SectionLessons />} />
    </Routes>
  )
}
