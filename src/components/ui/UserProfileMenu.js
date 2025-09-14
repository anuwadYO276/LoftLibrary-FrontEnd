"use client"

import React, { useState, useRef, useEffect } from "react"
import TextLink from "@/components/ui/TextLink"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { getCoins, getProfile } from "@/lib/api/book"

const url = process.env.NEXT_PUBLIC_API_URL

export default function UserProfileMenu() {
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const [coins, setCoins] = useState(0)
  const menuRef = useRef(null)

  const { user, logout } = useAuth()   // ✅ ใช้ context แทน
  const router = useRouter()

  // ดึงข้อมูลโปรไฟล์จาก API
  useEffect(() => {
    if (!user?.id) return

    async function fetchProfileAndCoins() {
      try {
        const profileRes = await getProfile(user.id)
        setProfile(profileRes.detail)

        const coinsRes = await getCoins(user.id)
        setCoins(coinsRes?.detail?.totalCoins || 0)
      } catch (error) {
        console.error("Error fetching profile or coins:", error)
      }
    }

    fetchProfileAndCoins()
  }, [user])

  // ปิดเมนูเมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = (e) => {
    e.preventDefault()
    logout()
    router.push("/login")
  }

  if (!user || !profile) return null   // ✅ ป้องกัน render เปล่า

  return (
    <div className="relative" ref={menuRef}>
      {/* ปุ่มโปรไฟล์ */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
          <img
            src={
              profile?.avatar
                ? `${process.env.NEXT_PUBLIC_API_URL || url}/uploads/avatar/${profile.avatar}`
                : "https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-1.jpg"
            }
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {/* เมนูแบบการ์ด */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border text-white z-50">
          <div className="p-4 flex flex-col gap-3">
            {/* แถวบน: รูป + ชื่อ */}
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={
                    profile?.avatar
                      ? `${process.env.NEXT_PUBLIC_API_URL || url}/uploads/avatar/${profile.avatar}`
                      : "https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-1.jpg"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-teal-300 font-semibold text-lg truncate">
                {profile.username}
              </span>
            </div>

            <TextLink href="/my-coins" className="text-left text-white hover:text-mint-light font-medium">
              Coin: <span className="text-teal-300">{coins} C</span>
            </TextLink>

            {profile.pen_name && (
              <TextLink
                href="/my-writing"
                className="text-left text-white hover:text-mint-light font-medium"
              >
                My Writing
              </TextLink>
            )}

            <TextLink
              href="/my-profile"
              className="text-left text-white hover:text-mint-light font-medium"
            >
              My Profile
            </TextLink>

            <button
              onClick={handleLogout}
              className="text-center text-red-600 hover:text-red-800 font-medium mt-2 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
