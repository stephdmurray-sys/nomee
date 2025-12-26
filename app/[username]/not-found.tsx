import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-md w-full px-6 py-12 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground/80">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Nomee Not Found</h2>
          <p className="text-muted-foreground text-balance">
            This Nomee doesn't exist yet. If you're looking for someone specific, make sure the URL is correct.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
            <Link href="/what-is-nomee">Learn About Nomee</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          Want to create your own Nomee?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}
