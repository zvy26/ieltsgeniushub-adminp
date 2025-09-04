import type React from "react"
import { useState } from "react"
import { Plus, Edit, Trash2, FileText, ChevronRight } from "lucide-react"
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
import { useSectionsQuery } from "@/api/queries/sections"
import { useDeleteSection } from "@/api/mutations/sections"
import type { Section } from "@/types/courses"
import { SectionForm } from "./SectionForm"
import { toast } from "sonner"

interface SectionsListProps {
  unitId: string
  unitTitle: string
  onSectionSelect?: (section: Section) => void
}

export const SectionsList: React.FC<SectionsListProps> = ({ unitId, unitTitle, onSectionSelect }) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)

  const { data: sections = [], isLoading, error } = useSectionsQuery(unitId)
  const deleteSectionMutation = useDeleteSection()

  const handleEdit = (section: Section) => {
    setEditingSection(section)
    setIsFormOpen(true)
  }

  const handleDelete = async (section: Section) => {
    try {
      await deleteSectionMutation.mutateAsync({ id: section._id, unitId })
      toast.success("Section deleted successfully")
    } catch (error) {
      toast.error("Failed to delete section")
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingSection(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    toast.success(editingSection ? "Section updated successfully" : "Section created successfully")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error loading sections: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unit Sections</h1>
          <p className="text-gray-600 mt-1">{unitTitle}</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
            <p className="text-gray-600 text-center mb-4">Start organizing your unit by adding the first section</p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sections.map((section, index) => (
            <Card key={section._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      Section {index + 1}
                    </Badge>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(section)} className="h-8 w-8 p-0">
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
                          <AlertDialogTitle>Delete Section</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{section.title}"? This action cannot be undone and will
                            also delete all lessons within this section.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(section)}
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
                {section.description && <p className="text-gray-600 mb-4">{section.description}</p>}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Order: {section.order}</div>
                  {onSectionSelect && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSectionSelect(section)}
                      className="flex items-center gap-2"
                    >
                      Manage Lessons
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <SectionForm unitId={unitId} section={editingSection} onClose={handleFormClose} onSuccess={handleFormSuccess} />
      )}
    </div>
  )
}
