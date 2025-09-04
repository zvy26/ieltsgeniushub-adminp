import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCreateCourse, useUpdateCourse } from "@/api/mutations/courses"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, X } from "lucide-react"
import type { Course, CreateCourseData } from "@/types/courses"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  duration: z.string().min(1, "Duration is required"),
  level: z.string().min(1, "Level is required"),
  picture: z.instanceof(File).optional(),
})

interface CourseFormProps {
  course?: Course
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CourseForm({ course, onSuccess, onCancel }: CourseFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()
  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      duration: course?.duration || "",
      level: course?.level || "",
    },
  })

  useEffect(() => {
    if (course?.picture && !previewImage) {
      setPreviewImage(`https://dead.uz${course.picture}`)
    }
  }, [course?.picture, previewImage])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const courseData: CreateCourseData = {
      title: values.title,
      description: values.description,
      duration: values.duration,
      level: values.level,
      picture: values.picture,
    }

    if (course) {
      updateCourse.mutate(
        { id: course._id, data: courseData },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Course updated successfully",
            })
            onSuccess?.()
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to update course",
              variant: "destructive",
            })
          },
        },
      )
    } else {
      createCourse.mutate(courseData, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Course created successfully",
          })
          onSuccess?.()
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to create course",
            variant: "destructive",
          })
        },
      })
    }
  }

  const handleImageChange = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    form.setValue("picture", file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        handleImageChange(file)
      } else {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        })
      }
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    form.setValue("picture", undefined)
  }

  const isLoading = createCourse.isPending || updateCourse.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter course title" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter course description"
                  className="resize-none min-h-[100px]"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 15 hours" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <FormLabel>Course Image</FormLabel>
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Drag and drop an image here, or click to select</p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageChange(file)
                  }}
                  className="cursor-pointer"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>

            {previewImage && (
              <div className="relative inline-block">
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeImage}
                  disabled={isLoading}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {course ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
