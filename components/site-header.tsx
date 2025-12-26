"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SiteHeaderProps {
  onCreateClick?: () => void
}

export function SiteHeader({ onCreateClick }: SiteHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-semibold text-slate-900">
            Nomee
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/what-is-nomee" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              What is Nomee
            </Link>
            <Link href="/how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              How It Works
            </Link>
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
                  Create your nomee
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 h-9 text-sm font-medium transition-all"
                >
                  <Link href="/auth/signup">Create your nomee</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
