"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
          What's your reputation
          <br />
          actually worth?
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
          <span className="font-semibold text-gray-900">Trust is your competitive advantage.</span>
        </p>
        <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-2">
          Nomee turns trust into your competitive advantage. Start free, upgrade when you're ready
        </p>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
            Simple pricing for professionals
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-2">Start free, upgrade when you're ready</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Start Collecting</h2>
            <div className="mb-4 sm:mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-gray-900">$0</span>
              <span className="text-sm sm:text-base text-gray-600">/forever</span>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Perfect for building initial proof</p>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Unlimited feedback requests</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Upload 10 saved feedback items</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Public Nomee page</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Auto-generated reputation themes</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Basic analytics</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:border-gray-400 bg-transparent min-h-[48px]"
              asChild
            >
              <Link href="/auth/signup">Start Free</Link>
            </Button>
            <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">No credit card required</p>
          </div>

          {/* Lite Tier */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-6 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Build Momentum</h2>
            <div className="mb-4 sm:mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-gray-900">$15.99</span>
              <span className="text-sm sm:text-base text-gray-600">/month</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">or $149/year (save 22%)</p>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              For growing professionals collecting more feedback
            </p>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700 font-semibold">Everything in Free, plus:</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Upload 30 saved feedback items</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Voice note collection</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Custom views & filtering</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">3 featured contributions</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Standard support</span>
              </div>
            </div>

            <Button
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 min-h-[48px]"
              asChild
            >
              <Link href="/auth/signup?plan=lite">Start 14-Day Free Trial</Link>
            </Button>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 sm:p-6 text-white relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-400 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-md">
              MOST POPULAR
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 mt-2">Reputation on Autopilot</h2>
            <div className="mb-4 sm:mb-6">
              <span className="text-4xl sm:text-5xl font-bold">$29.99</span>
              <span className="text-sm sm:text-base text-indigo-100">/month</span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-100 mb-1 sm:mb-2">or $249/year (save 31%)</p>
            <p className="text-sm sm:text-base text-indigo-100 mb-6 sm:mb-8">
              For professionals who compete on trust daily
            </p>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base font-semibold">Everything in Build Momentum, plus:</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base">Unlimited saved feedback uploads</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base">Unlimited featured contributions</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base">Embed Nomee on your website</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base">One-click PDF export</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base">Monthly reputation digest</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base">Advanced analytics & insights</span>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base">Priority support</span>
              </div>
            </div>

            <Button
              className="w-full bg-white text-indigo-600 py-3 rounded-lg font-bold hover:bg-gray-50 min-h-[48px]"
              asChild
            >
              <Link href="/auth/signup?plan=pro">Start 14-Day Free Trial</Link>
            </Button>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 sm:mt-20 text-center px-2">
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            All plans include unlimited written contributions and basic reputation themes
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            Need a custom plan for your team?{" "}
            <Link href="/contact" className="text-indigo-600 font-medium hover:text-indigo-700">
              Contact us
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-lg sm:text-xl font-bold text-gray-900">Nomee</span>
            <div className="text-gray-600 text-xs sm:text-sm text-center sm:text-right">
              © 2026 Nomee. Your reputation, portable.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
