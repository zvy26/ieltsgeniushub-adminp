import { useAuth } from "@/providers/AuthProvider"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

const Header = () => {
  const { user } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">IE</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">IELTS Admin</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.role}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 