/**
 * Safe utility functions to prevent null/undefined crashes
 */

// Safe array operations - always returns an array
export function safeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : []
}

// Safe string operations - always returns a string
export function safeString(value: string | null | undefined, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

// Safe number operations - always returns a number
export function safeNumber(value: number | null | undefined, fallback = 0): number {
  return typeof value === "number" && !isNaN(value) ? value : fallback
}

// Safe object property access
export function safeProp<T, K extends keyof T>(obj: T | null | undefined, key: K, fallback: T[K]): T[K] {
  if (obj == null) return fallback
  return obj[key] ?? fallback
}

// Safe map operation - never crashes on undefined
export function safeMap<T, R>(arr: T[] | null | undefined, fn: (item: T, index: number) => R): R[] {
  return safeArray(arr).map(fn)
}

// Safe filter operation - never crashes on undefined
export function safeFilter<T>(arr: T[] | null | undefined, fn: (item: T) => boolean): T[] {
  return safeArray(arr).filter(fn)
}

// Safe first element
export function safeFirst<T>(arr: T[] | null | undefined): T | undefined {
  return safeArray(arr)[0]
}

// Safe slice operation
export function safeSlice<T>(arr: T[] | null | undefined, start?: number, end?: number): T[] {
  return safeArray(arr).slice(start, end)
}

// Safe length check
export function safeLength(arr: unknown[] | string | null | undefined): number {
  if (arr == null) return 0
  return arr.length
}

// Check if value is "0" or empty (for UI display guards)
export function isEmptyOrZero(value: string | number | null | undefined): boolean {
  if (value == null) return true
  if (value === "") return true
  if (value === "0") return true
  if (value === 0) return true
  if (typeof value === "string" && value.trim() === "") return true
  return false
}

// Safe confidence score (0-100 range)
export function safeConfidence(value: number | null | undefined): number {
  const num = safeNumber(value, 0)
  return Math.max(0, Math.min(100, num))
}

// Safe percentage display
export function safePercentage(value: number | null | undefined): string {
  const num = safeConfidence(value)
  return `${Math.round(num)}%`
}
