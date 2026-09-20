/**
 * Clean Bangla/Hindi/Arabic/etc text from strings.
 * Detects ANY non-ASCII characters, not just Bengali.
 */

// Matches any non-ASCII character (Bengali, Devanagari, Arabic, etc.)
const NON_ASCII_REGEX = /[^\x00-\x7F]/;

export function hasNonEnglish(text: string): boolean {
  return NON_ASCII_REGEX.test(text);
}

/**
 * Remove parenthesized non-English text from a string.
 * "MAVERICK (প্রথাবিরোধী): CONFORMITY (প্রথানুগত্য) ::"
 *   → "MAVERICK: CONFORMITY ::"
 * "aside (অভিতিজ্ঞিা मानस): parentheses (বন্ধনী)"
 *   → "aside: parentheses"
 */
export function cleanBangla(text: string): string {
  if (!text) return text;
  if (!hasNonEnglish(text)) return text;

  let cleaned = text;

  // Step 1: Remove parentheses that contain any non-ASCII character
  // Handles nested cases by running multiple passes
  let prev = '';
  while (prev !== cleaned) {
    prev = cleaned;
    cleaned = cleaned.replace(/\s*\([^)]*[^\x00-\x7F][^)]*\)/g, '');
  }

  // Step 2: Remove any remaining standalone non-ASCII characters
  cleaned = cleaned.replace(/[^\x00-\x7F]+/g, '');

  // Step 3: Clean up spacing
  cleaned = cleaned
    .replace(/\s+/g, ' ')
    .replace(/\s*:\s*/g, ': ')
    .replace(/\s*::\s*/g, ' :: ')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/\(\s*\)/g, '')
    .replace(/^\s+|\s+$/g, '');

  return cleaned;
}

/**
 * Extract parenthesized non-English content for later display.
 */
export function extractBangla(text: string): string {
  if (!text) return '';
  const matches = text.match(/\([^)]*[^\x00-\x7F][^)]*\)/g);
  if (!matches) return '';
  return matches
    .map((m) => m.replace(/[()]/g, '').trim())
    .filter(Boolean)
    .join(' · ');
}

/**
 * Clean an entire analogy item.
 */
export function cleanAnalogyItem<T extends {
  question: string;
  options: Record<string, string>;
}>(item: T) {
  const cleanedQuestion = cleanBangla(item.question);
  const cleanedOptions = Object.fromEntries(
    Object.entries(item.options).map(([k, v]) => [k, cleanBangla(v)])
  ) as Record<string, string>;

  const banglaQuestion = extractBangla(item.question);
  const banglaOptions = Object.fromEntries(
    Object.entries(item.options).map(([k, v]) => [k, extractBangla(v)])
  ) as Record<string, string>;

  const hasAnyBangla =
    hasNonEnglish(item.question) ||
    Object.values(item.options).some(hasNonEnglish);

  // Debug (remove later)
  if (hasAnyBangla) {
    console.log('🔍 Cleaning:', {
      original: item.question,
      cleaned: cleanedQuestion,
      bangla: banglaQuestion,
    });
  }

  return {
    cleanedQuestion,
    cleanedOptions,
    banglaQuestion,
    banglaOptions,
    hasAnyBangla,
  };
}