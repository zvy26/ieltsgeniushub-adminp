import { Link, useLocation } from "react-router-dom"
import { cn } from "../lib/utils"
import { BarChart3, BookOpen, Package, Settings, Heart } from "lucide-react"

const Sidebar = () => {
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Interests", href: "/interests", icon: Heart },
    { name: "User stats", href: "/userstat", icon: Package },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="w-64 bg-white shadow-sm h-[calc(100vh-73px)] sticky top-[73px] border-r border-gray-200">
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar