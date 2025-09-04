import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCoursesQuery } from "@/api/queries/courses"
import { useDeleteCourse } from "@/api/mutations/courses"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  BookOpen, 
  Layers,
  Search,
  Loader2
} from "lucide-react"
import CourseForm from "./CourseForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CoursesList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [deletingCourse, setDeletingCourse] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const { data: courses, isLoading, error } = useCoursesQuery()
  const deleteCourse = useDeleteCourse()

  const handleDelete = (course: any) => {
    setDeletingCourse(course)
  }

  const confirmDelete = () => {
    if (deletingCourse) {
      deleteCourse.mutate(deletingCourse._id, {
        onSuccess: () => {
          setDeletingCourse(null)
        },
      })
    }
  }

  const handleManageUnits = (courseId: string) => {
    navigate(`/courses/${courseId}/units`)
  }

  const filteredCourses = courses?.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Courses</h2>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading courses: {error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Courses</h2>
          <p className="text-gray-600">{filteredCourses?.length || 0} courses total</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filteredCourses?.length === 0 && !searchQuery ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first course</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Course
          </Button>
        </div>
      ) : filteredCourses?.length === 0 && searchQuery ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search terms</p>
          <Button variant="outline" onClick={() => setSearchQuery('')}>Clear Search</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses?.map((course) => (
            <Card key={course._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {course.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleManageUnits(course._id)}>
                        <Layers className="h-4 w-4 mr-2" />
                        Manage Units
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingCourse(course)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(course)} 
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {course.picture && (
                    <img
                      src={`https://dead.uz${course.picture}`}
                      alt={course.title}
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  )}
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{course.level}</Badge>
                    <span className="text-sm text-gray-500">{course.duration}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                    <span>Created: {new Date(course.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span>ID: {course._id.slice(-6)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <CourseForm 
            onSuccess={() => setIsCreateDialogOpen(false)} 
            onCancel={() => setIsCreateDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          {editingCourse && (
            <CourseForm
              course={editingCourse}
              onSuccess={() => setEditingCourse(null)}
              onCancel={() => setEditingCourse(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingCourse} onOpenChange={() => setDeletingCourse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCourse?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCourse.isPending}
            >
              {deleteCourse.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}