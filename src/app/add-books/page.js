"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import AddBooks from "@/components/ui/AddBooks"

export default function AddBookPage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [coverPreview, setCoverPreview] = useState(null)

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview)
      }
    }
  }, [coverPreview])

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <Sidebar currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} />
      <div className="flex-1 flex flex-col">
        <Header />
        <AddBooks isEdit={false} />
      </div>
    </div>
  )
}
