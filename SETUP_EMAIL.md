# Email Configuration

This project uses [Resend](https://resend.com) to send transactional emails for contribution confirmations.

## Setup Steps

1. **Create a Resend account** at https://resend.com
2. **Get your API key** from the Resend dashboard
3. **Add the environment variable** to your Vercel project or `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
   ```
4. **Verify your domain** (for production):
   - Go to Resend Dashboard → Domains
   - Add your domain (e.g., `nomee.co`)
   - Follow DNS verification steps
   - Update the "from" address in `lib/email.ts` to use your verified domain

## Development

For development and testing, you can use Resend's test mode which allows sending to any email address without domain verification.

## Email Template

The confirmation email template is located at `components/emails/confirmation-email.tsx`. You can customize:
- Branding and styling
- Email copy
- Button design
- Footer content

## Sending Logic

Emails are sent from `app/api/contributions/create/route.ts` after a contribution is successfully saved to the database. If email sending fails, the contribution is still saved and the user sees the success page.
