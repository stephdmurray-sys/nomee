# Email Configuration for Nomee

Nomee uses **Resend** to send confirmation emails to contributors. Without this configured, contributions will be saved but contributors won't receive confirmation emails.

## Quick Setup (5 minutes)

### 1. Create a Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (3,000 emails/month included)

### 2. Get Your API Key
1. Go to [API Keys Dashboard](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Name it: `Nomee Production`
4. Select permission: **"Sending access"**
5. (Optional) Restrict to domain: `nomee.co`
6. Click **"Add"**
7. **IMPORTANT**: Copy the API key immediately (you can only see it once!)

### 3. Add to Vercel
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add new variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_xxxxxxxxxxxxx` (paste your key)
   - **Environment**: Production, Preview, Development
4. Click **"Save"**
5. Redeploy your project

### 4. Verify Domain (Optional but Recommended)
For production use, verify your domain to remove the "via resend.com" label:

1. Go to [Domains Dashboard](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter `nomee.co`
4. Add the DNS records to your domain provider
5. Wait for verification (usually 5-15 minutes)

Once verified, emails will come from `confirmations@nomee.co` instead of `onboarding@resend.dev`

## Testing

After setup, submit a test contribution. You should see in the logs:
```
[v0] Email sent successfully: <email-id>
```

Instead of:
```
[v0] Email not sent (RESEND_API_KEY not configured)
```

## Email Flow

1. **Contributor submits** → Contribution saved to database with `pending_confirmation` status
2. **Email sent** → Confirmation link sent to contributor's email
3. **Contributor clicks link** → Status changes to `confirmed`
4. **Nomee owner sees it** → Confirmed contributions appear on dashboard and public profile

## Free Tier Limits

- **3,000 emails/month** - More than enough for most users
- **100 emails/day** - Prevents abuse
- **1 custom domain** - Use nomee.co

## Support

If you need help:
- [Resend Documentation](https://resend.com/docs)
- [Resend Discord](https://resend.com/discord)
