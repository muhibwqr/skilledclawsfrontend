/**
 * Merge class names (nudge-ai / tailwind pattern)
 */
export function cn(...args) {
  return args.filter(Boolean).join(' ')
}
