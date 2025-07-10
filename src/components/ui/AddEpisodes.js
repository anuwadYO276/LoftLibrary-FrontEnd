"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import NoSSRSelect from "@/components/ui/NoSSRSelect"

const options = [
  { value: "Horror", label: "Horror" },
  { value: "Scifi", label: "Scifi" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Thriller", label: "Thriller" },
  { value: "Comedy", label: "Comedy" },
  { value: "Drama", label: "Drama" },
]

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

export default function AddEpisodes({ isEdit = false, editId = null, bookId, router }) {
  const [chapterTitle, setChapterTitle] = useState("")
  const [chapterContent, setChapterContent] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [price, setPrice] = useState("")
  const [pdfFile, setPdfFile] = useState(null)
  const [mp3File, setMp3File] = useState(null)
  const [status, setStatus] = useState("draft")

  // โหลดข้อมูลตอนถ้า isEdit = true และมี editId
  useEffect(() => {
    if (isEdit && editId) {
      fetch(`/api/episodes/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          setChapterTitle(data.chapterTitle || "")
          setChapterContent(data.chapterContent || "")
          setReleaseDate(data.releaseDate || "")
          setPrice(data.price || "")
          setStatus(data.status || "draft")
          // หากมีลิงก์ไฟล์ PDF หรือ MP3 อาจเก็บไว้แสดง (ถ้ามี)
        })
    }
  }, [isEdit, editId])

  const handlePdfChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
    } else {
      alert("Please upload a PDF file only.")
    }
  }

  const handleMp3Change = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file && (file.type === "audio/mpeg" || file.type === "audio/mp3")) {
      setMp3File(file)
    } else {
      alert("Please upload an MP3 audio file only.")
    }
  }

  const handleSubmit = async () => {
    if (!bookId) {
      alert("Book ID is missing.")
      return
    }
    if (!chapterTitle || !chapterContent) {
      alert("Please fill in chapter title and content.")
      return
    }

    const formData = new FormData()
    formData.append("bookId", bookId)
    formData.append("chapterTitle", chapterTitle)
    formData.append("chapterContent", chapterContent)
    formData.append("releaseDate", releaseDate)
    formData.append("price", price)
    formData.append("status", status)
    categories.forEach((c) => formData.append("categories[]", c.value))

    if (pdfFile) formData.append("pdfFile", pdfFile)
    if (mp3File) formData.append("mp3File", mp3File)

    try {
      const endpoint = isEdit ? `/api/episodes/${editId}` : "/api/episodes"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(endpoint, {
        method,
        body: formData,
      })

      if (res.ok) {
        alert(isEdit ? "Episode updated successfully!" : "Episode added successfully!")
        router.push(`/book/${bookId}`)
      } else {
        alert("Failed to save episode.")
      }
    } catch (err) {
      console.error(err)
      alert("An error occurred. Please try again.")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-teal-300 mb-6">
        {isEdit ? "Edit Episode" : "Add New Episode"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12 space-y-4">
          {/* Chapter Title */}
          <div>
            <label className="block text-sm mb-1 text-teal-300">Chapter Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              required
            />
          </div>

          {/* Chapter Content */}
          <div>
            <label className="block text-sm mb-1 text-teal-300">Chapter Content</label>
            <textarea
              className="w-full border p-2 rounded"
              rows={6}
              value={chapterContent}
              onChange={(e) => setChapterContent(e.target.value)}
              required
            />
          </div>

         

          {/* Release Date */}
          <div>
            <label className="block text-sm mb-1 text-teal-300">Release Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm mb-1 text-teal-300">Price</label>
            <input
              type="number"
              min="0"
              className="w-full border p-2 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm mb-1 text-teal-300">Status</label>
            <NoSSRSelect
              options={statusOptions}
              value={statusOptions.find((opt) => opt.value === status)}
              onChange={(selected) => setStatus(selected.value)}
              className="text-black"
              classNamePrefix="select"
            />
          </div>

          {/* Upload PDF */}
          <div>
            <label className="block text-sm font-medium text-teal-300 mb-1">Upload Chapter PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfChange}
              className="w-full border border-dashed border-gray-300 rounded-md p-2 cursor-pointer"
            />
            {pdfFile && <p className="text-sm text-white mt-1">📄 {pdfFile.name}</p>}
          </div>

          {/* Upload MP3 */}
          <div>
            <label className="block text-sm font-medium text-teal-300 mb-1">Upload Chapter Audio (MP3)</label>
            <input
              type="file"
              accept=".mp3,audio/mpeg"
              onChange={handleMp3Change}
              className="w-full border border-dashed border-gray-300 rounded-md p-2 cursor-pointer"
            />
            {mp3File && <p className="text-sm text-white mt-1">🎵 {mp3File.name}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex space-x-4">
        <Button
          className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
          onClick={handleSubmit}
        >
          {isEdit ? "Update Episode" : "Save Episode"}
        </Button>
    
        <Button
          className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
          onClick={() => router.push(`/book/${bookId}/edit`)}
        >
          Back to Book
        </Button>
      </div>


    </div>
  )
}
