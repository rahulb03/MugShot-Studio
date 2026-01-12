import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally join CSS class names.
 * Uses clsx for conditional classes and twMerge for Tailwind CSS support.
 * 
 * @param inputs - Class values to be merged
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display in blog posts
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "January 1, 2024")
 */
export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
