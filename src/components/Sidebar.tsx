import { Link, useLocation } from "react-router-dom"
import { cn } from "../lib/utils"
import { BarChart3, BookOpen, Package, Settings } from "lucide-react"

const Sidebar = () => {
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "User stats", href: "/userstat", icon: Package },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="w-64 bg-white/95 backdrop-blur-sm shadow-xl h-[calc(100vh-73px)] fixed left-0 top-[73px] border-r border-gray-200/50 overflow-y-auto hidden md:block transition-all duration-300">
      <nav className="p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">Navigation</h2>
        </div>
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm hover:transform hover:scale-105"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-r-full"></div>
                  )}
                  <Icon className={cn(
                    "mr-3 h-5 w-5 transition-all duration-200",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
                  )} />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white/30 rounded-full"></div>
                  )}
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