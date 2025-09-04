import type React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionsList } from "@/components/sections/SectionsList"
import { useUnitsQuery } from "@/api/queries/units"
import type { Section } from "@/types/courses"

export const UnitSections: React.FC = () => {
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>()
  const navigate = useNavigate()

  const { data: units = [], isLoading } = useUnitsQuery(courseId!)
  const unit = units.find((u) => u._id === unitId)

  const handleSectionSelect = (section: Section) => {
    navigate(`/courses/${courseId}/units/${unitId}/sections/${section._id}/lessons`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!unit) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Unit not found</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/courses/${courseId}/units`)}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Units
        </Button>
      </div>

      <SectionsList unitId={unitId!} unitTitle={unit.title} onSectionSelect={handleSectionSelect} />
    </div>
  )
}
