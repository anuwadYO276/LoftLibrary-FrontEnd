import { Badge } from "@/components/ui/badge"
import { Lock, Unlock,Edit  } from "lucide-react"

export default function EpisodeItem({ episode, onUnlock, isAuthor }) {
  return (
    <>
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
    
        {isAuthor ? (
          <></>
        ) : (
          <>

          <a href={`/add-books/${episode.bookId}/episode/${episode.id}`} className="text-teal-400 hover:text-mint-light transition-colors">
            <Edit />
          </a>
          
          </>
        )}
        <span className="text-xl font-bold  drop-shadow-md">#{episode.id}</span>
        <h3 className="text-lg font-semibold  drop-shadow-md">{episode.title}</h3>
      </div>

      <div className="flex items-center gap-4">
              
      {isAuthor && (
        <>
          {episode.price && (
            <Badge className="bg-teal-300 text-black">
              {episode.price} C
            </Badge>
          )}

          {episode.isLocked ? (
            <Lock
              className="w-6 h-6 text-teal-600 cursor-pointer hover:text-mint-dark transition-colors"
              title="Unlock episode"
              onClick={() => onUnlock(episode.id)}
            />
          ) : (
            // ถ้าไม่ล็อก จะไม่แสดงอะไร หรือจะใส่คอมโพเนนต์อื่นก็ได้
            null
          )}
        </>
      )}



        <div className="text-right text-gray-400">
          <div className="text-sm">{episode.date}</div>
          <div className="text-sm">{episode.time}</div>
        </div>
      </div>
    </div>

    </>
  )
}
