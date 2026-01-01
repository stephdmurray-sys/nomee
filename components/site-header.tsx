"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { X } from "lucide-react"

interface SiteHeaderProps {
  onCreateClick?: () => void
}

export function SiteHeader({ onCreateClick }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <img src="/images/nomee-20logo-20transparent.png" alt="Nomee" className="h-7.5 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/what-is-nomee" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              What is Nomee
            </Link>
            <a href="#decision-makers" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              For Decision-Makers
            </a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </a>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer"
              >
                Login
              </Link>
              {onCreateClick ? (
                <Button
                  onClick={onCreateClick}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 h-9 text-sm font-medium transition-all"
                >
                  Start uploading today
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 h-9 text-sm font-medium transition-all"
                >
                  <Link href="/auth/signup">Start uploading today</Link>
                </Button>
              )}
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <>
                <span className="w-6 h-0.5 bg-slate-900 transition-all" />
                <span className="w-6 h-0.5 bg-slate-900 transition-all" />
                <span className="w-6 h-0.5 bg-slate-900 transition-all" />
              </>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-lg">
          <nav className="flex flex-col px-6 py-4 gap-4">
            <Link
              href="/what-is-nomee"
              className="text-base text-slate-600 hover:text-slate-900 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              What is Nomee
            </Link>
            <a
              href="#decision-makers"
              className="text-base text-slate-600 hover:text-slate-900 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Decision-Makers
            </a>
            <a
              href="#pricing"
              className="text-base text-slate-600 hover:text-slate-900 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <Link
              href="/auth/login"
              className="text-base text-slate-600 hover:text-slate-900 transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            {onCreateClick ? (
              <Button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onCreateClick()
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full h-11 text-base font-medium transition-all"
              >
                Start uploading today
              </Button>
            ) : (
              <Button
                asChild
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full h-11 text-base font-medium transition-all"
              >
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  Start uploading today
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
