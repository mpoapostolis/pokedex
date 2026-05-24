import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Conditional + Tailwind-safe className composition. `clsx` handles the
 *  conditional logic (booleans, arrays, objects); `tailwind-merge` resolves
 *  conflicting utility classes when our output is combined with a
 *  caller-provided override. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
