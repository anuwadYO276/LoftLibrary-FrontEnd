"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import TextLink from "@/components/ui/TextLink"
import NowPlaying from "@/components/ui/NowPlaying"
import { Calendar, Clock, Bookmark, Book, Plus} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
    const { user, logout } = useAuth()
    const router = useRouter()

  return (
    <div className="w-64 bg-custom-bg border-r border-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-white text-2xl font-bold flex items-center gap-2">
          Loft <Book className="w-6 h-6 text-teal-300" />
        </h1>
        <h2 className="text-white text-2xl font-bold">Library</h2>
      </div>

      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <TextLink href="/" className="w-full flex items-center gap-3 text-white hover:bg-gray-700 p-2 rounded">
            <Calendar className="w-4 h-4" />
            Daily
          </TextLink>
          <TextLink href="/" className="w-full flex items-center gap-3 text-white hover:bg-gray-700 p-2 rounded">
            <Clock className="w-4 h-4" />
            History
          </TextLink>
          <TextLink href="/" className="w-full flex items-center gap-3 text-white hover:bg-gray-700 p-2 rounded">
            <Bookmark className="w-4 h-4" />
            Bookmark
          </TextLink>
          {user ? (
            <>
             {user.user.role != "reader" && (
              <TextLink href="/" className="w-full flex items-center gap-3 text-white hover:bg-gray-700 p-2 rounded">
                <Plus  className="w-4 h-4" />
                Add books
              </TextLink>
            )}
        </>
          ) : (
            <></>
          )}
        </nav>
      </div>

      {/* Now Playing Section */}
      <NowPlaying
        currentlyPlaying={currentlyPlaying}
        setCurrentlyPlaying={setCurrentlyPlaying}
      />
    </div>
  )
}
