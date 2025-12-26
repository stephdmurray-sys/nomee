"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      const result = await response.json()

      if (result.ok) {
        console.log("[v0] Auth - Logged out successfully")
        router.refresh()
        router.push("/auth/login")
      } else {
        console.error("[v0] Auth - Logout failed:", result.error)
      }
    } catch (err) {
      console.error("[v0] Auth - Logout error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Log out"}
    </Button>
  )
}
