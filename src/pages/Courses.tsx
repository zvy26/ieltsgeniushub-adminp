import CoursesList from "@/components/courses/CoursesList"
import { useAuth } from "@/providers/AuthProvider"

export const Courses = () => {
    const {  loading } = useAuth()

    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <div className="container mx-auto py-8">
            <CoursesList />
        </div>
    )
}
