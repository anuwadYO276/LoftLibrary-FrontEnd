"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import BookGrid from "@/components/ui/BookGrid"
import { getBooks } from "@/lib/api/book"
import { genreOptions } from "@/constants/selectOptions"

export default function LibraryPage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const allBooks = await getBooks()
        setBooks(allBooks || [])
      } catch (err) {
        console.error("Failed to fetch books:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // ฟังก์ชันกรองหนังสือตาม category (genre)
  const filterBooksByCategory = (category) => {
    return books.filter(book => {
      if (!book.category) return false
      // แยก category string เป็น array แล้วตรวจสอบว่ามี category นี้ไหม
      const categories = book.category.split(",").map(c => c.trim())
      return categories.includes(category)
    })
  }

  if (loading) return <div className="text-white p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <Sidebar
        currentlyPlaying={currentlyPlaying}
        setCurrentlyPlaying={setCurrentlyPlaying}
      />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">

          {genreOptions.map(({ value, label }) => {
            const booksInCategory = filterBooksByCategory(value)
            if (booksInCategory.length === 0) return null // ถ้าไม่มีหนังสือในหมวดนี้ ไม่แสดง section

            return (
              <section key={value} className="mb-8">
                <h2 className="text-white text-2xl font-bold mb-6">
                  {label}
                </h2>
                <BookGrid books={booksInCategory} />
              </section>
            )
          })}

        </main>
      </div>
    </div>
  )
}
