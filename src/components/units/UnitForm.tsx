import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreateUnit, useUpdateUnit } from "@/api/mutations/units"
import { useUnitsQuery } from "@/api/queries/units"
import type { Unit, CreateUnitData, UpdateUnitData } from "@/types/courses"

interface UnitFormProps {
  courseId: string
  unit?: Unit | null
  onClose: () => void
  onSuccess: () => void
}

export const UnitForm: React.FC<UnitFormProps> = ({ courseId, unit, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
  })

  const { data: existingUnits = [] } = useUnitsQuery(courseId)
  const createUnitMutation = useCreateUnit()
  const updateUnitMutation = useUpdateUnit()

  const isEditing = !!unit

  useEffect(() => {
    if (unit) {
      setFormData({
        title: unit.title,
        description: unit.description || "",
        order: unit.order,
      })
    } else {
      const maxOrder = existingUnits.reduce((max, u) => Math.max(max, u.order), 0)
      setFormData((prev) => ({ ...prev, order: maxOrder + 1 }))
    }
  }, [unit, existingUnits])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      return
    }

    try {
      if (isEditing && unit) {
        const updateData: UpdateUnitData = {
          title: formData.title,
          description: formData.description || undefined,
          order: formData.order,
        }
        await updateUnitMutation.mutateAsync({ id: unit._id, data: updateData })
      } else {
        const createData: CreateUnitData = {
          title: formData.title,
          description: formData.description || undefined,
          courseId,
          order: formData.order,
        }
        await createUnitMutation.mutateAsync(createData)
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving unit:", error)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isLoading = createUnitMutation.isPending || updateUnitMutation.isPending

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEditing ? "Edit Unit" : "Add New Unit"}
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter unit title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter unit description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => handleChange("order", Number.parseInt(e.target.value) || 1)}
              placeholder="Unit order"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim()}>
              {isLoading ? "Saving..." : isEditing ? "Update Unit" : "Create Unit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
