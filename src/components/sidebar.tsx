'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, BarChart2, Users, Settings, LogOut } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Sidebar({ className, userName = "John Doe" }: { className?: string, userName?: string }) {
  const isCollapsed = false
  const [isTextVisible, setIsTextVisible] = useState(true)
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Track Finances', icon: Users, href: '/finance' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ]

  const handleLogout = () => {
    // Implement your logout logic here
    router.push('/auth/logout') // Redirect to login page after logout
  }

  const handleNavigation = useCallback((href: string) => {
    router.push(href)
  }, [router])

  useEffect(() => {
    if (isCollapsed) {
      setIsTextVisible(false)
    } else {
      timeoutRef.current = setTimeout(() => setIsTextVisible(true), 100)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isCollapsed])

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex items-center justify-between p-4">
        <h1 className={cn(
          "font-bold text-2xl text-blue-600 transition-opacity duration-200 ease-in-out",
          isCollapsed ? "opacity-0 w-0" : "opacity-100", isCollapsed && "hidden"
        )}>
          <Image src="/saarthi.png" alt="Saarthi Logo" width={85} height={53} className="mb-4" />
        </h1>
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="transition-transform duration-200 ease-in-out"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button> */}
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-all duration-200 ease-in-out",
                  isCollapsed && "justify-center"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {isTextVisible && <span className="transition-opacity duration-200 ease-in-out">{item.name}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-4">
        <div className={cn(
          "flex items-center justify-between transition-all duration-200 ease-in-out",
          isCollapsed && "flex-col"
        )}>
          <div className={cn(
            "text-sm font-medium transition-opacity duration-200 ease-in-out",
            isCollapsed ? "opacity-0 w-0" : "opacity-100"
          )}>
            {isTextVisible && userName}
          </div>
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            onClick={handleLogout}
            aria-label="Logout"
            className="transition-all duration-200 ease-in-out"
          >
            <LogOut className="h-5 w-5" />
            {isTextVisible && <span className="ml-2 transition-opacity duration-200 ease-in-out">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}