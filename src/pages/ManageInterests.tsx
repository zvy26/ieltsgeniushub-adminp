import type React from "react"
import { useState } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Loader2,
  Heart,
  Music,
  Camera,
  BookOpen,
  Gamepad2,
  Car,
  Coffee,
  TreePine,
  Plane,
  Palette,
  Dumbbell,
  Film,
  Code,
  Globe,
  Mountain,
  Utensils
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useInterestsQuery } from "@/api/queries/interests"
import { useCreateInterestMutation, useUpdateInterestMutation, useDeleteInterestMutation } from "@/api/mutations/interests"
import type { Interest, CreateInterestData } from "@/types/interests"

// Icon mapping for dynamic icon rendering - this is key to fixing the icon display issue
const iconMap = {
  Heart,
  Music,
  Camera,
  BookOpen,
  Gamepad2,
  Car,
  Coffee,
  TreePine,
  Plane,
  Palette,
  Dumbbell,
  Film,
  Code,
  Globe,
  Mountain,
  Utensils
} as const

type IconName = keyof typeof iconMap

// Available icons for selection
const availableIcons: { name: IconName; label: string }[] = [
  { name: 'Heart', label: 'Heart' },
  { name: 'Music', label: 'Music' },
  { name: 'Camera', label: 'Photography' },
  { name: 'BookOpen', label: 'Reading' },
  { name: 'Gamepad2', label: 'Gaming' },
  { name: 'Car', label: 'Cars' },
  { name: 'Coffee', label: 'Coffee' },
  { name: 'TreePine', label: 'Nature' },
  { name: 'Plane', label: 'Travel' },
  { name: 'Palette', label: 'Art' },
  { name: 'Dumbbell', label: 'Fitness' },
  { name: 'Film', label: 'Movies' },
  { name: 'Code', label: 'Programming' },
  { name: 'Globe', label: 'World' },
  { name: 'Mountain', label: 'Adventure' },
  { name: 'Utensils', label: 'Cooking' }
]

// Dynamic icon component that renders the correct icon based on name
const DynamicIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  const IconComponent = iconMap[iconName as IconName]
  
  if (!IconComponent) {
    // Fallback icon if the stored icon name doesn't exist
    return <Heart className={className} />
  }
  
  return <IconComponent className={className} />
}

const ManageInterests = () => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInterest, setEditingInterest] = useState<Interest | null>(null)
  const [deleteInterestId, setDeleteInterestId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Heart" as IconName,
    isActive: true
  })

  const { data: interests = [], isLoading, error } = useInterestsQuery()
  const createMutation = useCreateInterestMutation()
  const updateMutation = useUpdateInterestMutation()
  const deleteMutation = useDeleteInterestMutation()

  const filteredInterests = interests.filter(interest =>
    interest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interest.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateInterest = () => {
    setEditingInterest(null)
    setFormData({
      name: "",
      description: "",
      icon: "Heart",
      isActive: true
    })
    setIsDialogOpen(true)
  }

  const handleEditInterest = (interest: Interest) => {
    setEditingInterest(interest)
    setFormData({
      name: interest.name,
      description: interest.description,
      icon: interest.icon as IconName,
      isActive: interest.isActive
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingInterest) {
        await updateMutation.mutateAsync({
          id: editingInterest.id,
          ...formData
        })
        toast({
          title: "Success",
          description: "Interest updated successfully",
        })
      } else {
        const createData: CreateInterestData = {
          name: formData.name,
          description: formData.description,
          icon: formData.icon, // This ensures the icon is properly saved
          isActive: formData.isActive
        }
        await createMutation.mutateAsync(createData)
        toast({
          title: "Success",
          description: "Interest created successfully",
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: editingInterest ? "Failed to update interest" : "Failed to create interest",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      toast({
        title: "Success",
        description: "Interest deleted successfully",
      })
      setDeleteInterestId(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete interest",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        Error loading interests. Please try again.
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Manage Interests</h1>
          <p className="text-gray-600">Create and manage student interests</p>
        </div>
        <Button onClick={handleCreateInterest}>
          <Plus className="h-4 w-4 mr-2" />
          Add Interest
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search interests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredInterests.map((interest) => (
          <Card key={interest.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* This DynamicIcon component properly renders icons based on the stored name */}
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <DynamicIcon iconName={interest.icon} className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{interest.name}</CardTitle>
                    <Badge variant={interest.isActive ? "default" : "secondary"} className="mt-1">
                      {interest.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditInterest(interest)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteInterestId(interest.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{interest.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInterests.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interests found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? "Try adjusting your search criteria" : "Get started by creating your first interest"}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreateInterest}>
              <Plus className="h-4 w-4 mr-2" />
              Add Interest
            </Button>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingInterest ? "Edit Interest" : "Create Interest"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Icon selector with preview - this ensures proper icon selection */}
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value as IconName })}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <DynamicIcon iconName={formData.icon} className="h-4 w-4" />
                      {availableIcons.find(icon => icon.name === formData.icon)?.label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map((icon) => (
                    <SelectItem key={icon.name} value={icon.name}>
                      <div className="flex items-center gap-2">
                        <DynamicIcon iconName={icon.name} className="h-4 w-4" />
                        {icon.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="isActive">Status</Label>
              <Select
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) => setFormData({ ...formData, isActive: value === "active" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {editingInterest ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteInterestId} onOpenChange={() => setDeleteInterestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this interest? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteInterestId && handleDelete(deleteInterestId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ManageInterests