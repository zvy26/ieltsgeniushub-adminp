export interface Course {
  _id: string
  title: string
  description: string
  rating: number
  duration: string
  totalLessons: number
  level: string
  picture: string
  ratingCount: number
  instructor?: Instructor
  units?: Unit[]
  createdAt?: string
  updatedAt?: string
}

export interface Instructor {
  _id: string
  name: string
  email: string
  avatar?: string
  bio?: string
}

export interface Unit {
  _id: string
  id: string
  title: string
  description?: string
  courseId: string
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface Section {
  _id: string
  id: string
  title: string
  description?: string
  unitId: string
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface Lesson {
  _id: string
  title: string
  description?: string
  sectionId: string
  type: "Video" | "Text" | "Quiz" | "File"
  order: number
  videoUrl?: string
  textContent?: string
  fileUrl?: string
  fileName?: string
  createdAt?: string
  updatedAt?: string
}

export interface QuizQuestion {
  _id: string
  id: string
  question: string
  options: string[]
  correctOptionIndex: number
  type: string
  lessonId: string
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface DashboardStats {
  totalUsers: number
  monthlyActiveUsers: number
  dailyActiveUsers: number
  recentActivities: RecentActivity[]
  courseStats: CourseStats[]
}

export interface RecentActivity {
  userId: string
  userName: string
  activityType: string
  lessonTitle: string
  score: number
  createdAt: string
}

export interface CourseStats {
  courseId: string
  title: string
  averageRating: number
  totalRatings: number
  enrolledUsers: number
}

export interface CreateCourseData {
  title: string
  description: string
  duration: string
  level: string
  picture?: File
}

export interface UpdateCourseData {
  title?: string
  description?: string
  duration?: string
  level?: string
  picture?: File
}

export interface CreateUnitData {
  title: string
  description?: string
  courseId: string
  order: number
}

export interface UpdateUnitData {
  title?: string
  description?: string
  order?: number
}

export interface CreateSectionData {
  title: string
  description?: string
  unitId: string
  order: number
}

export interface UpdateSectionData {
  title?: string
  description?: string
  order?: number
}

export interface CreateLessonData {
  title: string
  description?: string
  sectionId: string
  type: "Video" | "Text" | "Quiz" | "File"
  order: number
  videoUrl?: string
  textContent?: string
  fileUrl?: string
  fileName?: string
}

export interface UpdateLessonData {
  title?: string
  description?: string
  type?: "Video" | "Text" | "Quiz" | "File"
  order?: number
  videoUrl?: string
  textContent?: string
  fileUrl?: string
  fileName?: string
}

export interface CreateQuestionData {
  question: string
  options: string[]
  correctOptionIndex: number
  order: number
}

export interface UpdateQuestionData {
  question?: string
  options?: string[]
  correctOptionIndex?: number
  order?: number
}
