"use client"

import { use, useState } from "react"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import AddBooks from "@/components/ui/AddBooks"

export default function EditBookPage({ params }) {
  const { id } = use(params) // ✅ ปลด promise ด้วย `use()`
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <Sidebar currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} />
      <div className="flex-1 flex flex-col">
        <Header />
        <AddBooks isEdit={true} editId={id} />
      </div>
    </div>
  )
}
