// Rate limiting utility for abuse protection

export interface RateLimitConfig {
  identifier: string // email or IP
  action: string // 'submission', 'report', etc.
  maxRequests: number
  windowMs: number // time window in milliseconds
}

export async function checkRateLimit(
  supabaseAdmin: any,
  config: RateLimitConfig,
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const windowStart = new Date(Date.now() - config.windowMs)

  // Get or create rate limit record
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("rate_limits")
    .select("*")
    .eq("identifier", config.identifier)
    .eq("action", config.action)
    .gte("window_start", windowStart.toISOString())
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    // Error other than "not found"
    console.error("[v0] Rate limit check error:", fetchError)
    return { allowed: true, remaining: config.maxRequests, resetAt: new Date(Date.now() + config.windowMs) }
  }

  if (!existing) {
    // Create new rate limit record
    const { error: insertError } = await supabaseAdmin.from("rate_limits").insert({
      identifier: config.identifier,
      action: config.action,
      count: 1,
      window_start: new Date().toISOString(),
    })

    if (insertError) {
      console.error("[v0] Rate limit insert error:", insertError)
      return { allowed: true, remaining: config.maxRequests - 1, resetAt: new Date(Date.now() + config.windowMs) }
    }

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: new Date(Date.now() + config.windowMs),
    }
  }

  // Check if limit exceeded
  if (existing.count >= config.maxRequests) {
    const resetAt = new Date(new Date(existing.window_start).getTime() + config.windowMs)
    return {
      allowed: false,
      remaining: 0,
      resetAt,
    }
  }

  // Increment count
  const { error: updateError } = await supabaseAdmin
    .from("rate_limits")
    .update({
      count: existing.count + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id)

  if (updateError) {
    console.error("[v0] Rate limit update error:", updateError)
  }

  return {
    allowed: true,
    remaining: config.maxRequests - existing.count - 1,
    resetAt: new Date(new Date(existing.window_start).getTime() + config.windowMs),
  }
}

// Detect spam patterns
export function detectSpamPatterns(text: string): boolean {
  const spamIndicators = [
    /\b(viagra|cialis|poker|casino|lottery|bitcoin)\b/i,
    /\b(click here|buy now|limited offer|act now)\b/i,
    /(https?:\/\/[^\s]+){3,}/, // Multiple URLs
    /(.)\1{10,}/, // Repeated characters
    /[A-Z]{20,}/, // Too many caps
  ]

  return spamIndicators.some((pattern) => pattern.test(text))
}

// Detect inappropriate content
export function detectInappropriateContent(text: string): boolean {
  // Basic profanity filter (expand as needed)
  const inappropriate = [
    /\b(fuck|shit|asshole|bastard)\b/i,
    // Add more patterns as needed
  ]

  return inappropriate.some((pattern) => pattern.test(text))
}
