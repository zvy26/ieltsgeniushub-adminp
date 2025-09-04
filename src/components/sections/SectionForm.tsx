import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreateSection, useUpdateSection } from "@/api/mutations/sections"
import { useSectionsQuery } from "@/api/queries/sections"
import type { Section, CreateSectionData, UpdateSectionData } from "@/types/courses"

interface SectionFormProps {
  unitId: string
  section?: Section | null
  onClose: () => void
  onSuccess: () => void
}

export const SectionForm: React.FC<SectionFormProps> = ({ unitId, section, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
  })

  const { data: existingSections = [] } = useSectionsQuery(unitId)
  const createSectionMutation = useCreateSection()
  const updateSectionMutation = useUpdateSection()

  const isEditing = !!section

  useEffect(() => {
    if (section) {
      setFormData({
        title: section.title,
        description: section.description || "",
        order: section.order,
      })
    } else {
      const maxOrder = existingSections.reduce((max, s) => Math.max(max, s.order), 0)
      setFormData((prev) => ({ ...prev, order: maxOrder + 1 }))
    }
  }, [section, existingSections])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      return
    }

    try {
      if (isEditing && section) {
        const updateData: UpdateSectionData = {
          title: formData.title,
          description: formData.description || undefined,
          order: formData.order,
        }
        await updateSectionMutation.mutateAsync({ id: section._id, data: updateData })
      } else {
        const createData: CreateSectionData = {
          title: formData.title,
          description: formData.description || undefined,
          unitId,
          order: formData.order,
        }
        await createSectionMutation.mutateAsync(createData)
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving section:", error)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isLoading = createSectionMutation.isPending || updateSectionMutation.isPending

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEditing ? "Edit Section" : "Add New Section"}
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
              placeholder="Enter section title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter section description (optional)"
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
              placeholder="Section order"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim()}>
              {isLoading ? "Saving..." : isEditing ? "Update Section" : "Create Section"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
