"use client"

import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleSpecialButtonClick = () => {
    router.push("/some-protected-page")
  }

  const handleLogout = () => {
    logout()
    router.push("/login")  // เปลี่ยนเป็น path หน้า login ของคุณ
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.js
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        {user && (
          <>
            <button
              className="mt-6 px-6 py-3 rounded-lg bg-[#8ccfcd] text-black font-semibold hover:bg-[#75c2c0] transition"
              onClick={handleSpecialButtonClick}
            >
              Special Button for Logged In Users
            </button>

            <button
              className="mt-4 px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

        {!user && (
          <p className="mt-6 text-gray-500 italic">You must log in to see special features.</p>
        )}
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* ... */}
      </footer>
    </div>
  )
}
