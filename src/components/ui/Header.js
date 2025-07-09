"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TextLink from "@/components/ui/TextLink"
import { Home, Search, Bell } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import UserProfileMenu from "./UserProfileMenu"
import NotificationCard from "@/components/ui/NotificationCard"

export default function Header({ data }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = (e) => {
    e.preventDefault()
    logout()
    router.push("/login")
  }


  return (
    <header className="bg-custom-bg border-b border-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* ปุ่ม Home */}
          <TextLink href="/" className="text-mint-light hover:text-mint-dark transition-colors font-bold text-lg">
            <Home className="w-8 h-8" />
          </TextLink>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search books..." className="pl-10 bg-white border-none rounded-full h-10" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
             <NotificationCard />

             <UserProfileMenu
                user={user}
                logout={handleLogout}
              />
            </>
          ) : (
            // ถ้าไม่มี user (ยังไม่ login) แสดง login/signup link (ถ้าต้องการ)
            <TextLink href="/login" className="text-mint-light hover:text-mint-dark transition-colors font-medium">
              Login / Signup
            </TextLink>
          )}
        </div>
      </div>
    </header>
  )
}
