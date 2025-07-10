"use client"

import React from "react"
import Link from "next/link"

export default function BookGrid({ books }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? "text-mint-light" : "text-gray-600"}`}>★</span>
    ))
  }

  return (
    <div className="grid grid-cols-8 gap-4 mb-8">
      {books.map((book, index) => (
        <div key={index} className="flex flex-col items-center group cursor-pointer">
          <div className="relative mb-2 transition-transform group-hover:scale-105">
            <Link href={`/book/${book.id}`}>
              <div className="relative mb-2 transition-transform group-hover:scale-105 cursor-pointer">
                <img
                  src={book.cover || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full h-32 object-cover rounded-lg shadow-lg"
                />
              </div>
            </Link>
          </div>
          <h3 className="text-white text-sm text-center mb-1 line-clamp-2">{book.title}</h3>
          <div className="flex">{renderStars(book.rating)}</div>
        </div>
      ))}
    </div>
  )
}
