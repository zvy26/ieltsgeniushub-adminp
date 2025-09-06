import { useAuth } from "@/providers/AuthProvider"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

const Header = () => {
  const { user } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">IE</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">IELTS Genius</h1>
            <p className="text-xs text-gray-500 font-medium">Admin Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role || 'Administrator'}</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-blue-100">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 