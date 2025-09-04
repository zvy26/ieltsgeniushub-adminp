import type React from "react"
import { useState } from "react"
import { Plus, Edit, Trash2, BookOpen, ChevronRight } from "lucide-react"
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
import { useUnitsQuery } from "@/api/queries/units"
import { useDeleteUnit } from "@/api/mutations/units"
import type { Unit } from "@/types/courses"
import { UnitForm } from "./UnitForm"
import { toast } from "sonner"

interface UnitsListProps {
  courseId: string
  courseTitle: string
  onUnitSelect?: (unit: Unit) => void
}

export const UnitsList: React.FC<UnitsListProps> = ({ courseId, courseTitle, onUnitSelect }) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)

  const { data: units = [], isLoading, error } = useUnitsQuery(courseId)
  const deleteUnitMutation = useDeleteUnit()

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit)
    setIsFormOpen(true)
  }

  const handleDelete = async (unit: Unit) => {
    try {
      await deleteUnitMutation.mutateAsync({ id: unit._id, courseId })
      toast.success("Unit deleted successfully")
    } catch (error) {
      toast.error("Failed to delete unit")
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingUnit(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    toast.success(editingUnit ? "Unit updated successfully" : "Unit created successfully")
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
        <p className="text-red-600">Error loading units: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Units</h1>
          <p className="text-gray-600 mt-1">{courseTitle}</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Unit
        </Button>
      </div>

      {units.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No units yet</h3>
            <p className="text-gray-600 text-center mb-4">Start building your course by adding the first unit</p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Unit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {units.map((unit, index) => (
            <Card key={unit._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      Unit {index + 1}
                    </Badge>
                    <CardTitle className="text-lg">{unit.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(unit)} className="h-8 w-8 p-0">
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
                          <AlertDialogTitle>Delete Unit</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{unit.title}"? This action cannot be undone and will also
                            delete all sections and lessons within this unit.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(unit)} className="bg-red-600 hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {unit.description && <p className="text-gray-600 mb-4">{unit.description}</p>}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Order: {unit.order}</div>
                  {onUnitSelect && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUnitSelect(unit)}
                      className="flex items-center gap-2"
                    >
                      Manage Sections
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
        <UnitForm courseId={courseId} unit={editingUnit} onClose={handleFormClose} onSuccess={handleFormSuccess} />
      )}
    </div>
  )
}
