"use client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

interface ModalSignupProps {
  isOpen: boolean
  onClose: () => void
  type: "deck" | "recognition"
}

export function ModalSignup({ isOpen, onClose, type }: ModalSignupProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleSignUp = () => {
    router.push("/auth/signup")
    onClose()
  }

  const handleLogin = () => {
    router.push("/auth/login")
    onClose()
  }

  const title = type === "deck" ? "Create your Nomee" : "Request recognition"
  const description =
    type === "deck"
      ? "Get started with your personal recognition deck"
      : "Send a request link to partners you've worked with"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-charcoal mb-2">{title}</h2>
        <p className="text-neutral-600 mb-8">{description}</p>

        <div className="space-y-3">
          <Button
            onClick={handleSignUp}
            className="w-full bg-primary-blue hover:bg-primary-blue/90 text-white rounded-full h-12 text-base"
          >
            Sign up
          </Button>
          <Button
            onClick={handleLogin}
            variant="outline"
            className="w-full border-neutral-300 text-charcoal hover:bg-neutral-50 rounded-full h-12 text-base bg-transparent"
          >
            Log in
          </Button>
        </div>

        <p className="text-xs text-neutral-500 text-center mt-6">Free forever. No credit card required.</p>
      </div>
    </div>
  )
}
