import type { ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      <Header />
      <div className="pt-[73px]"> {/* Add top padding for fixed header */}
        <Sidebar />
        <main className="ml-0 md:ml-64 p-4 md:p-6 bg-transparent min-h-[calc(100vh-73px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 mb-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout