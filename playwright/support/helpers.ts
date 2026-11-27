import type { DaysCount } from './types'

/**
 * Formats an amount in USD using dot decimal separator (e.g., `USD 120.00`).
 */
export function formatUsd(amount: number): string {
  return `USD ${amount.toFixed(2)}`
}

/**
 * Computes total reservation amount rounded to 2 decimal places.
 */
export function calculateTotal(dailyRate: number, daysCount: DaysCount): number {
  return Number((dailyRate * daysCount).toFixed(2))
}

/**
 * Normalizes passport identifiers for comparison and persistence.
 */
export function normalizePassport(passport: string): string {
  return passport.trim().toUpperCase()
}

/**
 * Formats a Date into `DD/MM/AAAA` for Kiosk form input.
 */
export function formatBirthDateBr(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Returns a `DD/MM/AAAA` birth date relative to today with an optional day offset.
 * Useful for age boundary tests (e.g., exactly 18 years old vs 1 day before 18).
 */
export function birthDateYearsAgo(years: number, dayOffset = 0): string {
  const target = new Date()
  target.setFullYear(target.getFullYear() - years)
  target.setDate(target.getDate() + dayOffset)
  return formatBirthDateBr(target)
}

/**
 * Generates an exclusive passport identifier to isolate parallel test scenarios.
 */
export function generateUniquePassport(prefix = 'BR'): string {
  const suffix = Math.random().toString(36).substring(2, 9).toUpperCase()
  return `${prefix}${suffix}`
}
