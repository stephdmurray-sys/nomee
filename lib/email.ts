import { Resend } from "resend"
import { ConfirmationEmail } from "@/components/emails/confirmation-email"

let resendClient: Resend | null = null

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn("[v0] RESEND_API_KEY not configured - email sending disabled")
      return null
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

interface SendConfirmationEmailParams {
  to: string
  contributorName: string
  profileUsername: string
  confirmUrl: string
}

export async function sendConfirmationEmail({
  to,
  contributorName,
  profileUsername,
  confirmUrl,
}: SendConfirmationEmailParams) {
  console.log("[v0] Attempting to send confirmation email...")
  console.log("[v0] Recipient:", to)
  console.log("[v0] Profile:", profileUsername)

  const resend = getResendClient()

  if (!resend) {
    console.error("[v0] ❌ EMAIL NOT SENT - RESEND_API_KEY not configured")
    console.error("[v0] Please add RESEND_API_KEY to your environment variables")
    console.error("[v0] See EMAIL_SETUP_GUIDE.md for instructions")
    return { success: false, reason: "Email service not configured" }
  }

  try {
    console.log("[v0] Resend client initialized, sending email...")

    const { data, error } = await resend.emails.send({
      from: "Nomee <confirmations@nomee.co>",
      to: [to],
      subject: `Confirm your perspective for ${profileUsername}`,
      react: ConfirmationEmail({ contributorName, profileUsername, confirmUrl }),
    })

    if (error) {
      console.error("[v0] ❌ Email send error:", error)
      throw error
    }

    console.log("[v0] ✅ Email sent successfully!")
    console.log("[v0] Email ID:", data?.id)
    return { success: true, emailId: data?.id }
  } catch (error) {
    console.error("[v0] ❌ Failed to send confirmation email:", error)
    throw error
  }
}
