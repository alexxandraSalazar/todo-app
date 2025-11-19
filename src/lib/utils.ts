import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes conditionally and intelligently.
 * 
 * It combines:
 * 1. `clsx`: For conditional class application (e.g., `isError && 'text-red-500'`).
 * 2. `tailwind-merge`: To resolve style conflicts (e.g., 'p-4' overriding 'p-2').
 * 
 * @param {...ClassValue[]} inputs - A list of classes, arrays, or objects.
 * @returns {string} The final optimized class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}