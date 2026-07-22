/**
 * Input sanitization for Zod schema transforms.
 * Strips dangerous HTML/script content from user-provided text.
 */

const DANGEROUS_TAGS = /<\s*\/?\s*(script|iframe|object|embed|form|style|link|meta|base)\b[^>]*>/gi;
const EVENT_HANDLERS = /\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi;
const DANGEROUS_URIS = /(javascript|data)\s*:/gi;

/**
 * Remove dangerous HTML elements and attributes from a string.
 * Preserves plain text and safe formatting tags.
 */
export function sanitize(input: string): string {
  return input
    .replace(DANGEROUS_TAGS, '')
    .replace(EVENT_HANDLERS, '')
    .replace(DANGEROUS_URIS, '')
    .trim();
}

/**
 * Strip ALL HTML tags, leaving only text content.
 * Use for fields that should never contain HTML (names, codes, titles).
 */
export function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}
