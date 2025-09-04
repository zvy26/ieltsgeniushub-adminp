import type React from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Edit, Trash2, Video, FileText, HelpCircle, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useLessonsQuery } from "@/api/queries/lessons"
import { useDeleteLesson } from "@/api/mutations/lessons"
import { useSectionsQuery } from "@/api/queries/sections"
import type { Lesson } from "@/types/courses"
import { LessonForm } from "@/components/lessons/LessonForm"
import { QuestionsList } from "@/components/questions/QuestionsList"
import { toast } from "sonner"

export const SectionLessons: React.FC = () => {
  const { courseId, unitId, sectionId } = useParams<{
    courseId: string
    unitId: string
    sectionId: string
  }>()
  const navigate = useNavigate()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  const { data: sections = [] } = useSectionsQuery(unitId!)
  const section = sections.find((s) => s._id === sectionId)

  const { data: lessons = [], isLoading, error } = useLessonsQuery(sectionId!)
  const deleteLessonMutation = useDeleteLesson()

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setIsFormOpen(true)
  }

  const handleDelete = async (lesson: Lesson) => {
    try {
      await deleteLessonMutation.mutateAsync({ id: lesson._id, sectionId: sectionId! })
      toast.success("Lesson deleted successfully")
    } catch (error) {
      toast.error("Failed to delete lesson")
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingLesson(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    toast.success(editingLesson ? "Lesson updated successfully" : "Lesson created successfully")
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="h-4 w-4" />
      case "Text":
        return <FileText className="h-4 w-4" />
      case "Quiz":
        return <HelpCircle className="h-4 w-4" />
      case "File":
        return <File className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case "Video":
        return "bg-blue-100 text-blue-800"
      case "Text":
        return "bg-green-100 text-green-800"
      case "Quiz":
        return "bg-purple-100 text-purple-800"
      case "File":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (selectedLesson && selectedLesson.type === "Quiz") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setSelectedLesson(null)} className="flex items-center gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Lessons
          </Button>
        </div>
        <QuestionsList lessonId={selectedLesson._id} lessonTitle={selectedLesson.title} />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!section) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Section not found</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/courses/${courseId}/units/${unitId}/sections`)}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sections
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Section Lessons</h1>
            <p className="text-gray-600 mt-1">{section.title}</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Lesson
          </Button>
        </div>

        {lessons.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
              <p className="text-gray-600 text-center mb-4">Start building your section by adding the first lesson</p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Lesson
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {lessons.map((lesson, index) => (
              <Card key={lesson._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        Lesson {index + 1}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {getLessonIcon(lesson.type)}
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getLessonTypeColor(lesson.type)}>{lesson.type}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(lesson)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{lesson.title}"? This action cannot be undone and will
                              also delete all questions if this is a quiz lesson.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(lesson)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {lesson.description && <p className="text-gray-600 mb-4">{lesson.description}</p>}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Order: {lesson.order}</div>
                    {lesson.type === "Quiz" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLesson(lesson)}
                        className="flex items-center gap-2"
                      >
                        Manage Questions
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isFormOpen && (
          <LessonForm
            sectionId={sectionId!}
            lesson={editingLesson}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
  )
}
