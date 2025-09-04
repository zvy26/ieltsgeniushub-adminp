import type React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UnitsList } from "@/components/units/UnitsList"
import { useCourseDetailQuery } from "@/api/queries/courses"
import type { Unit } from "@/types/courses"

export const CourseUnits: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()

  const { data: course, isLoading } = useCourseDetailQuery(courseId!)

  const handleUnitSelect = (unit: Unit) => {
    navigate(`/courses/${courseId}/units/${unit._id}/sections`)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-20 bg-gray-200 rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
        <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/courses")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={() => navigate("/courses")} 
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <p className="text-gray-600 mt-1">{course.description}</p>
            </div>
            <Badge variant="secondary">{course.level}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Duration: {course.duration || 'Not set'}</span>
            <span>•</span>
            <span>Created: {new Date(course.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Course Units</h2>
        <UnitsList 
          courseId={courseId!} 
          courseTitle={course.title} 
          onUnitSelect={handleUnitSelect} 
        />
      </div>
    </div>
  )
}