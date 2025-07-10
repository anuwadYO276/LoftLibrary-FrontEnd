"use client"

import { use, useState,useEffect } from "react"
import BookInfo from "@/components/ui/BookInfo"
import EpisodesList from "@/components/ui/EpisodesList"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"

export default function BookDetailPage({ params }) {
  const { id } = use(params)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [rating, setRating] = useState(0)
  const [isAuthor, setIsAuthor] = useState(false)
  const [isStatusWriterEnded, setIsStatusWriterEnded] = useState(true)


  const [episodes, setEpisodes] = useState([
    { id: 1, title: "The Whispering Flame", date: "1/10/2020", time: "12:54 PM", price: null, isLocked: false },
    { id: 2, title: "Moths to the Maw", date: "1/10/2020", time: "02:18 PM", price: 30, isLocked: true },
    { id: 3, title: "Ashes of the Innocent", date: "3/10/2020", time: "01:27 AM", price: 25, isLocked: true },
    { id: 4, title: "The Candle Burns Black", date: "3/10/2020", time: "01:41 AM", price: 25, isLocked: true },
    { id: 5, title: "Offerings in the Dark", date: "3/10/2020", time: "03:21 PM", price: 35, isLocked: true },
  ])

  const handleUnlockEpisode = (id) => {
    setEpisodes((prev) =>
      prev.map((ep) => (ep.id === id ? { ...ep, isLocked: false, price: null } : ep))
    )
  }

  const unlockAllEpisodes = () => {
    setEpisodes((prev) =>
      prev.map((ep) => ({ ...ep, isLocked: false, price: null }))
    )
  }
  

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <Sidebar currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} />
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="min-h-screen bg-custom-bg text-white p-8">
          {/* Book Section */}
          <div className="flex gap-8 mb-8">
            <div className="flex-shrink-0">
              <img
                src="https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg"
                alt="All The Devils"
                className="w-80 h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>

            <BookInfo
              rating={rating}
              setRating={setRating}
              isBookmarked={isBookmarked}
              setIsBookmarked={setIsBookmarked}
              isFollowing={isFollowing}
              setIsFollowing={setIsFollowing}
              title="All The Devils"
              author="Catelyn"
              description="A gripping tale of betrayal, ambition, and the dark corners of the human soul. Follow the journey of a young woman as she navigates a world filled with deception and moral ambiguity."
              authorAvatar="https://images.icon-icons.com/2429/PNG/512/google_logo_icon_147282.png"
              isStatusWriterEnded={isStatusWriterEnded}
              isAuthor={isAuthor}
              id={id}
            />
          </div>

          {/* Episodes Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">All episodes ({episodes.length})</h2>

              {isAuthor ? (
                <div
                  role="button"
                  tabIndex={0}
                  className="inline-flex items-center bg-mint-light hover:bg-mint-dark text-white font-semibold px-6 py-2 rounded cursor-pointer select-none"
                  onClick={unlockAllEpisodes}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      unlockAllEpisodes()
                    }
                  }}
                >
                  Unlock all episodes
                  <span className="ml-2 bg-gray-800 text-mint-light px-2 py-1 rounded text-sm">125 C</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">Status: End</h2>

                  <label htmlFor="unlockToggle" className="relative cursor-pointer">
                    <input
                      type="checkbox"
                      id="unlockToggle"
                      className="sr-only peer"
                      onChange={(e) => {
                        const unlock = e.target.checked
                        setIsStatusWriterEnded(unlock)
                      }}
                    />
                    {/* Track */}
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-teal-500 transition-colors"></div>
                    {/* Thumb */}
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>

              )}
            </div>

            <EpisodesList episodes={episodes} onUnlock={handleUnlockEpisode} isAuthor={isAuthor} id={id} />
          </div>
        </div>
      </div>
    </div>
  )
}
