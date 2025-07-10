"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import NoSSRSelect from "@/components/ui/NoSSRSelect"
import { useRouter } from "next/navigation"

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
  const [bookName, setBookName] = useState("")
  const [description, setDescription] = useState("")
  const [categories, setCategories] = useState([])
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [releaseDate, setReleaseDate] = useState("")
  const [status, setStatus] = useState("draft")
  const router = useRouter()

  useEffect(() => {
    if (isEdit && editId) {
      // ตัวอย่าง: โหลดข้อมูลจาก API
      fetch(`/api/books/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.releaseDate) setReleaseDate(data.releaseDate)
          if (data.status) setStatus(data.status)
          setBookName(data.name)
          setDescription(data.description)
          setCategories(data.categories.map((c) => ({ value: c, label: c })))
          if (data.coverUrl) setCoverPreview(data.coverUrl)
        })
    }
  }, [isEdit, editId])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-teal-300 mb-6">
        {isEdit ? "Edit Book" : "Add New Book"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Upload Cover - col 4 */}
        <div className="md:col-span-4">
          <label className="block text-sm mb-1 text-teal-300">Upload Cover</label>
          <div
  className="border-2 border-dashed  rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-teal-600 transition-colors"
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
      <p className="mt-20 mb-1 text-lg font-semibold" >Click or Drag & Drop to upload</p>
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
          e.stopPropagation() // ป้องกัน event คลิกกระโดดไป input
          handleRemoveFile()
        }}
      >
        Remove Cover
      </button>
    </div>
  )}
</div>

        </div>

        {/* Inputs - col 8 */}
        <div className="md:col-span-8 space-y-4">
          {/* Book Title */}
          <div>
            <label className="block text-sm mb-1 text-teal-300">Book Title</label>
            <input
              className="w-full border p-2 rounded"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1 text-teal-300">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Categories */}
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


        </div>
      </div>

      {/* Save / Update Button */}
      <div className="mt-6">
        <Button
          className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
          onClick={() => {
            if (isEdit) {
              router.push(`/book/${editId}`) // 👉 ไปหน้า /book/a1 หรืออะไรก็ได้
            } else {
              router.push("/book/1") // 👉 จำลองว่าเพิ่มหนังสือใหม่ได้ ID = 1
            }
          }}
        >
          {isEdit ? "Update Book" : "Save Add Book"}
        </Button>
      </div>
    </div>
  )
}
