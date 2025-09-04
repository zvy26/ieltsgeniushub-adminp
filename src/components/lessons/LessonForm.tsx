import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreateLesson, useUpdateLesson } from "@/api/mutations/lessons"
import { useLessonsQuery } from "@/api/queries/lessons"
import type { Lesson, CreateLessonData, UpdateLessonData } from "@/types/courses"

interface LessonFormProps {
  sectionId: string
  lesson?: Lesson | null
  onClose: () => void
  onSuccess: () => void
}

export const LessonForm: React.FC<LessonFormProps> = ({ sectionId, lesson, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Text" as "Video" | "Text" | "Quiz" | "File",
    order: 1,
    videoUrl: "",
    textContent: "",
    fileUrl: "",
    fileName: "",
  })

  const { data: existingLessons = [] } = useLessonsQuery(sectionId)
  const createLessonMutation = useCreateLesson()
  const updateLessonMutation = useUpdateLesson()

  const isEditing = !!lesson

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        description: lesson.description || "",
        type: lesson.type,
        order: lesson.order,
        videoUrl: lesson.videoUrl || "",
        textContent: lesson.textContent || "",
        fileUrl: lesson.fileUrl || "",
        fileName: lesson.fileName || "",
      })
    } else {
      const maxOrder = existingLessons.reduce((max, l) => Math.max(max, l.order), 0)
      setFormData((prev) => ({ ...prev, order: maxOrder + 1 }))
    }
  }, [lesson, existingLessons])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      return
    }

    try {
      if (isEditing && lesson) {
        const updateData: UpdateLessonData = {
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          order: formData.order,
          videoUrl: formData.type === "Video" ? formData.videoUrl || undefined : undefined,
          textContent: formData.type === "Text" ? formData.textContent || undefined : undefined,
          fileUrl: formData.type === "File" ? formData.fileUrl || undefined : undefined,
          fileName: formData.type === "File" ? formData.fileName || undefined : undefined,
        }
        await updateLessonMutation.mutateAsync({ id: lesson._id, data: updateData })
      } else {
        const createData: CreateLessonData = {
          title: formData.title,
          description: formData.description || undefined,
          sectionId,
          type: formData.type,
          order: formData.order,
          videoUrl: formData.type === "Video" ? formData.videoUrl || undefined : undefined,
          textContent: formData.type === "Text" ? formData.textContent || undefined : undefined,
          fileUrl: formData.type === "File" ? formData.fileUrl || undefined : undefined,
          fileName: formData.type === "File" ? formData.fileName || undefined : undefined,
        }
        await createLessonMutation.mutateAsync(createData)
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving lesson:", error)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isLoading = createLessonMutation.isPending || updateLessonMutation.isPending

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case "Video":
        return (
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              value={formData.videoUrl}
              onChange={(e) => handleChange("videoUrl", e.target.value)}
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
            />
          </div>
        )
      case "Text":
        return (
          <div className="space-y-2">
            <Label htmlFor="textContent">Text Content</Label>
            <Textarea
              id="textContent"
              value={formData.textContent}
              onChange={(e) => handleChange("textContent", e.target.value)}
              placeholder="Enter lesson text content"
              rows={6}
            />
          </div>
        )
      case "File":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fileUrl">File URL</Label>
              <Input
                id="fileUrl"
                value={formData.fileUrl}
                onChange={(e) => handleChange("fileUrl", e.target.value)}
                placeholder="Enter file URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileName">File Name</Label>
              <Input
                id="fileName"
                value={formData.fileName}
                onChange={(e) => handleChange("fileName", e.target.value)}
                placeholder="Enter file name"
              />
            </div>
          </div>
        )
      case "Quiz":
        return (
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              Quiz questions can be managed after creating the lesson. Create the lesson first, then use the "Manage
              Questions" button to add quiz questions.
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEditing ? "Edit Lesson" : "Add New Lesson"}
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter lesson title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter lesson description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Lesson Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select lesson type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Text">Text Lesson</SelectItem>
                <SelectItem value="Video">Video Lesson</SelectItem>
                <SelectItem value="Quiz">Quiz Lesson</SelectItem>
                <SelectItem value="File">File/Document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderTypeSpecificFields()}

          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => handleChange("order", Number.parseInt(e.target.value) || 1)}
              placeholder="Lesson order"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim()}>
              {isLoading ? "Saving..." : isEditing ? "Update Lesson" : "Create Lesson"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
