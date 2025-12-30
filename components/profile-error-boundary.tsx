"use client"

import type React from "react"

import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  children: ReactNode
  slug?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ProfileErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console for debugging
    console.error("[ProfileErrorBoundary] Caught error:", {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      slug: this.props.slug,
      timestamp: new Date().toISOString(),
    })

    // Send to error tracking service (Sentry/LogRocket compatible)
    if (typeof window !== "undefined") {
      try {
        // Store error for potential reporting
        const errorData = {
          message: error.message,
          stack: error.stack,
          slug: this.props.slug,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }

        // Log to localStorage for debugging (limited to last 10 errors)
        const storedErrors = JSON.parse(localStorage.getItem("nomee_client_errors") || "[]")
        storedErrors.unshift(errorData)
        localStorage.setItem("nomee_client_errors", JSON.stringify(storedErrors.slice(0, 10)))

        // If Sentry is available, capture the error
        if ((window as any).Sentry) {
          ;(window as any).Sentry.captureException(error, {
            extra: { slug: this.props.slug, componentStack: errorInfo.componentStack },
          })
        }
      } catch (e) {
        // Silently fail if localStorage is unavailable
      }
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>

            <h1 className="text-2xl font-serif text-neutral-900 mb-3">Something went wrong</h1>

            <p className="text-neutral-600 mb-6">
              We had trouble loading this profile. This has been logged and we're looking into it.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleRetry} className="inline-flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Try again
              </Button>

              <Button variant="outline" asChild>
                <Link href="/" className="inline-flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go home
                </Link>
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700">
                  Technical details
                </summary>
                <pre className="mt-2 p-3 bg-neutral-100 rounded-lg text-xs text-red-600 overflow-auto max-h-40">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
