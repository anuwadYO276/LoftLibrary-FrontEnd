"use client"

import React from "react"
import Link from "next/link"

export default function BookGrid({ books }) {
  console.log("Rendering BookGrid with books:", books)
  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? "text-mint-light" : "text-gray-600"}`}>★</span>
    ))
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-8">
      {books.map((book, index) => {
        const coverSrc = book.cover_url?.startsWith("http")
          ? book.cover_url
          : `${process.env.NEXT_PUBLIC_API_URL}${book.cover_url || "/placeholder.svg"}`

        return (
          <div key={book.id || index} className="flex flex-col items-center group cursor-pointer">
            <Link href={`/book/${book.id}`}>
              <div className="relative mb-2 transition-transform group-hover:scale-105">
                <img
                  src={coverSrc}
                  alt={book.title}
                  className="w-full h-32 object-cover rounded-lg shadow-lg"
                />
              </div>
            </Link>
            <h3 className="text-white text-sm text-center mb-1 line-clamp-2">{book.title}</h3>
            <div className="flex">{renderStars(book.rating)}</div>
          </div>
        )
      })}
    </div>
  )
}
