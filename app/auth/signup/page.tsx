"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import Link from "next/link"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, fullName }),
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        const errorMessage = data.error || "Signup failed"
        if (
          errorMessage.toLowerCase().includes("already registered") ||
          errorMessage.toLowerCase().includes("already exists")
        ) {
          throw new Error("This email is already registered. Please sign in instead.")
        }
        throw new Error(errorMessage)
      }

      window.location.href = "/dashboard"
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader onCreateClick={() => {}} />
      <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card className="border-neutral-200">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl font-bold">Create an account</CardTitle>
              <CardDescription className="text-sm sm:text-base text-neutral-600">
                Start collecting feedback today
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSignup}>
                <div className="flex flex-col gap-5 sm:gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName" className="text-sm sm:text-base">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isLoading}
                      className="border-neutral-300 min-h-[44px] text-base"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm sm:text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="border-neutral-300 min-h-[44px] text-base"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-sm sm:text-base">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="border-neutral-300 min-h-[44px] text-base"
                    />
                  </div>
                  {error && (
                    <div className="rounded-md bg-red-50 p-3 border border-red-200">
                      <p className="text-sm text-red-600">{error}</p>
                      {error.toLowerCase().includes("already registered") && (
                        <Link
                          href="/auth/login"
                          className="text-sm text-blue-600 hover:underline mt-2 inline-block font-medium min-h-[44px] flex items-center"
                        >
                          Go to sign in →
                        </Link>
                      )}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 min-h-[48px] text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-neutral-600">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-blue-600 hover:underline underline-offset-4 font-medium min-h-[44px] inline-flex items-center"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
