"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import NoSSRSelect from "@/components/ui/NoSSRSelect"
import { useRouter } from "next/navigation"
import { createBook, updateBook } from "@/lib/api/book"
import { useAuth } from "@/contexts/AuthContext"  // ดึง user มาจากที่นี่

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

export default function AddBooks({ isEdit = false, editId = null }) {
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categories, setCategories] = useState([])
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [releaseDate, setReleaseDate] = useState("")
  const [status, setStatus] = useState("draft")
  const router = useRouter()
  const authorId = user?.user?.id || null  // ดึง author_id จาก user context

  useEffect(() => {
    if (isEdit && editId) {
      fetch(`/api/books/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.releaseDate) setReleaseDate(data.releaseDate)
          if (data.status) setStatus(data.status)
          setTitle(data.title)
          setDescription(data.description)
          setCategories(data.categories.map((c) => ({ value: c, label: c })))
          if (data.coverUrl) setCoverPreview(data.coverUrl)
        })
    }
  }, [isEdit, editId])

  // ล้าง URL preview เมื่อเปลี่ยนหรือ unmount
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview)
    }
  }, [coverPreview])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (coverPreview) URL.revokeObjectURL(coverPreview) // ล้างของเก่า
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    } else {
      alert("Please upload a .jpg or .png file only.")
    }
  }

  const handleRemoveFile = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
    }
    setCoverFile(null)
    setCoverPreview(null)
  }

  const handleSubmit = async () => {
    if (!user || !user.user?.id) {
      alert("User not authenticated")
      return
    }
   
    const payload = {
      title,
      description,
      releaseDate,
      status,
      categories: categories.map((c) => c.value),
      coverFile,
      authorId
    }

    try {
      if (isEdit) {
        const updated = await updateBook(editId, payload)
        router.push(`/book/${updated.data.id}/edit`)  // เปลี่ยนจาก updated.id เป็น updated.data.id
      } else {
        const created = await createBook(payload)
        router.push(`/book/${created.data.id}/edit`)  // เปลี่ยนจาก created.id เป็น created.data.id
      }
    } catch (err) {
      console.error(err)
      alert("Failed to save book.")
    }

  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-teal-300 mb-6">
        {isEdit ? "Edit Book" : "Add New Book"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <label className="block text-sm mb-1 text-teal-300">Upload Cover</label>
          <div
            className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-teal-600 transition-colors"
            onClick={() => document.getElementById("coverInput").click()}
          >
            <input
              id="coverInput"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            {!coverPreview ? (
              <div className="text-teal-400 text-center select-none h-100">
                <p className="mt-20 mb-1 text-lg font-semibold">Click or Drag & Drop to upload</p>
                <p className="text-sm">.jpg, .jpeg, .png only</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="w-100 h-90 object-cover rounded-lg shadow-md mb-3"
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile()
                  }}
                >
                  Remove Cover
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-8 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-teal-300">Book Title</label>
            <input
              className="w-full border p-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-teal-300">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-teal-300">Categories</label>
            <NoSSRSelect
              options={options}
              value={categories}
              onChange={setCategories}
              isMulti
              className="basic-multi-select text-black"
              classNamePrefix="select"
              placeholder="Select one or more categories"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-teal-300">Release Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

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
        </div>
      </div>

      <div className="mt-6">
        <Button
          className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
          onClick={handleSubmit}
        >
          {isEdit ? "Update Book" : "Save Add Book"}
        </Button>
      </div>
    </div>
  )
}
