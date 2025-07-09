"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TextLink from "@/components/ui/TextLink"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { login } from "@/lib/api/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { setUser } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await login({ email, password })

      setUser({
        user: data.data.payload,
        token: data.data.token,
      })
      router.replace("/")
    } catch (err) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex login-page">
      {/* Left Side - Login Form */}
      <div className="flex-1 bg-custom-bg flex items-center justify-center p-8 border-r border-white">
        <div className="w-full max-w-md space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-mint-light mb-8">Log In</h1>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center space-x-4 mb-6">
            <button className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center transition-transform hover:scale-105 group">
              <img
                src="https://images.icon-icons.com/2429/PNG/512/google_logo_icon_147282.png"
                alt="Google Logo"
                className="scale-100"
              />
            </button>

            <button className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center hover:scale-105 transition-transform">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                alt="Facebook Logo"
              />
            </button>
          </div>

          {/* Divider */}
          <div className="text-center text-gray-400 mb-6">
            <span>or</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Email address/Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 bg-beige border-none rounded-lg text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-mint-light"
              required
              autoComplete="off"
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 bg-beige border-none rounded-lg text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-mint-light"
              required
              autoComplete="off"
            />

            {error && (
              <div className="text-red-500 text-center font-semibold">{error}</div>
            )}

            <div className="text-center">
              <TextLink
                href="/forgot-password"
                className="text-mint-dark hover:text-mint-light transition-colors text-sm"
              >
                Forgot your password?
              </TextLink>
            </div>

            <Button className="w-full h-12" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Welcome Message */}
      <div className="flex-1 bg-custom-bg flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-mint-light mb-6">Welcome back!</h2>
          <p className="text-gray-light text-lg leading-relaxed mb-8">
            Welcome back! We are so happy to have you here. It's great to see you again. We hope you had a safe and
            enjoyable time away.
          </p>
          <div className="text-gray-light">
            <span>No account yet? </span>
            <TextLink
              href="/signup"
              className="text-mint-light hover:text-mint-dark transition-colors font-medium"
            >
              Signup
            </TextLink>
          </div>
        </div>
      </div>
    </div>
  )
}
