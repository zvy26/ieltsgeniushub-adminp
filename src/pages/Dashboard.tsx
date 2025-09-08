import { useAuth } from "@/providers/AuthProvider"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useDashboardQuery } from "@/api/queries/dashboard"
import { Loader2, Users, BookOpen, TrendingUp, Award } from "lucide-react"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const { data: dashboardStats, isLoading, error } = useDashboardQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600">Error loading dashboard: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div >
        <Button className="text-red-600" onClick={logout} variant="outline">
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.monthlyActiveUsers || 0}</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-sm text-gray-600">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              {user?.phone && (
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-sm text-gray-600">{user?.phone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardStats?.recentActivities?.length ? (
              <div className="space-y-4">
                {dashboardStats.recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {activity.userName?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.userName}</p>
                      <p className="text-xs text-gray-500">
                        {activity.activityType} - Score: {activity.score}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>

      {dashboardStats?.courseStats?.length && (
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardStats.courseStats.slice(0, 6).map((course, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{course.title}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Rating: {course.averageRating}/5 ({course.totalRatings} reviews)</p>
                    <p>Enrolled: {course.enrolledUsers} students</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard