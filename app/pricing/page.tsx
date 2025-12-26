import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Nomee
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-neutral-900">Simple, honest pricing.</h1>
          <p className="text-xl text-neutral-600">
            Create and share your Nomee for free. Upgrade only if you want more power and polish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="p-8 border-2">
            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-bold text-neutral-900">Free</h3>
              <p className="text-sm text-neutral-600 mb-4">Your Nomee, fully functional.</p>
              <div className="mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-neutral-600"> — always free</span>
              </div>
            </div>

            <Button className="w-full mb-2 bg-transparent" variant="outline" asChild>
              <Link href="/auth/signup">Create your Nomee</Link>
            </Button>
            <p className="text-xs text-neutral-500 text-center mb-6">No credit card required.</p>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Unlimited Nomee submissions (invite as many collaborators as you want)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Public Nomee page</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Pattern recognition & keyword highlighting</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Frequency-based traits and insights</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">'How it feels to work with you'</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Shareable Nomee link</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Dashboard access</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">Up to 3 uploaded reviews (screenshots or pasted reviews)</span>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-2">
            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-bold text-neutral-900">Premium</h3>
              <p className="text-sm text-neutral-600 mb-4">Make your Nomee work harder for you.</p>
              <div className="mb-2">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-neutral-600">/month</span>
              </div>
              <p className="text-sm text-neutral-500 mb-4">or $89/year (2 months free)</p>
            </div>

            <Button className="w-full mb-2" asChild>
              <Link href="/auth/signup?plan=premium">Upgrade to Premium</Link>
            </Button>
            <p className="text-xs text-neutral-500 text-center mb-6">Upgrade anytime. Stay free forever if you want.</p>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">Everything in Free, plus:</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Unlimited uploaded reviews (screenshots or pasted reviews)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Premium presentation styles</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Optional hero image / elevated layout</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Embeddable Nomee for your website or portfolio</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Quote-level sharing</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Downloadable Nomee snapshot (PDF / image)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Priority access to new features as Nomee evolves</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-neutral-50 rounded-2xl p-8">
          <h2 className="mb-4 text-xl font-bold text-neutral-900">
            What's the difference between submissions and uploads?
          </h2>
          <p className="text-neutral-700 leading-relaxed">
            Nomee submissions are structured perspectives collected directly from collaborators — these are always
            unlimited and free. Uploaded reviews are existing screenshots or pasted reviews you already have.
          </p>
        </div>

        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center text-neutral-900">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-neutral-900">Can I cancel anytime?</h3>
              <p className="text-neutral-600">
                Yes. If you cancel Premium, your account reverts to Free. Your Nomee submissions remain unlimited, and
                you'll keep up to 3 uploaded reviews.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-neutral-900">How does the embed work?</h3>
              <p className="text-neutral-600">
                Premium users get a simple code snippet to paste into their website, portfolio, or email signature. You
                control how your Nomee appears.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
