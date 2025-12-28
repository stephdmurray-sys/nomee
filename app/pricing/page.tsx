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
            Create and share your Nomee for free. Upgrade for uploads, exports, and embedding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* FREE TIER */}
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
                <span className="text-sm">&quot;How it feels to work with you&quot; summary</span>
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
                <span className="text-sm">Up to 3 uploaded reviews (screenshots or pasted reviews)</span>
              </div>
            </div>
          </Card>

          {/* PREMIUM TIER */}
          <Card className="p-8 border-2 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">Most popular</span>
            </div>
            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-bold text-neutral-900">Premium</h3>
              <p className="text-sm text-neutral-600 mb-4">Proof Vault — store and organize your praise.</p>
              <div className="mb-2">
                <span className="text-4xl font-bold">$7</span>
                <span className="text-neutral-600">/month</span>
              </div>
              <p className="text-sm text-neutral-500 mb-4">or $69/year (2 months free)</p>
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
                <span className="text-sm">Organize uploads (tags + pin your top 3)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Quote-level sharing (share a single quote card)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Downloadable Nomee snapshot (PDF / image)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Light presentation styles (1–2 clean layouts)</span>
              </div>
            </div>
          </Card>

          {/* PRO TIER - NEW */}
          <Card className="p-8 border-2">
            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-bold text-neutral-900">Pro</h3>
              <p className="text-sm text-neutral-600 mb-4">Showcase + Embed — make your Nomee work everywhere.</p>
              <div className="mb-2">
                <span className="text-4xl font-bold">$14</span>
                <span className="text-neutral-600">/month</span>
              </div>
              <p className="text-sm text-neutral-500 mb-4">or $139/year (2 months free)</p>
            </div>

            <Button className="w-full mb-2" asChild>
              <Link href="/auth/signup?plan=pro">Upgrade to Pro</Link>
            </Button>
            <p className="text-xs text-neutral-500 text-center mb-6">&nbsp;</p>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">Everything in Premium, plus:</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Embeddable Nomee for your website or portfolio (code snippet)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Premium presentation styles (best layouts)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Optional hero image / elevated layout</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Basic analytics (views, plays, top traits clicked)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">
                  Share-ready exports (LinkedIn-size quote cards + &quot;media kit&quot; PDF)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">Minimal/optional &quot;Powered by Nomee&quot; branding on embeds</span>
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
            unlimited and free. Uploaded reviews are screenshots or pasted reviews you already have. Premium and Pro
            unlock unlimited uploads and organization.
          </p>
        </div>

        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center text-neutral-900">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-neutral-900">Can I cancel anytime?</h3>
              <p className="text-neutral-600">
                Yes. If you cancel a paid plan, your account reverts to Free. Your Nomee submissions remain unlimited,
                and you'll keep up to 3 uploaded reviews.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-neutral-900">How does the embed work?</h3>
              <p className="text-neutral-600">
                Pro users get a simple code snippet to paste into their website, portfolio, or email signature. You
                control how your Nomee appears.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-neutral-900">What happens if I downgrade from Pro to Premium?</h3>
              <p className="text-neutral-600">
                You'll keep Premium features (unlimited uploads, organization, downloads), but embeds and Pro-only
                presentation/analytics features will be disabled. Your submissions remain unlimited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
