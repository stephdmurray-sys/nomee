import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-white">
      <div className="w-full max-w-sm">
        <Card className="border-neutral-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription className="text-neutral-600">
              We sent you a confirmation link. Click it to complete your signup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 mb-4">
              After confirming your email, you can sign in and start using Nomee.
            </p>
            <Link href="/auth/login" className="text-sm text-blue-600 hover:underline underline-offset-4">
              Back to sign in
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
