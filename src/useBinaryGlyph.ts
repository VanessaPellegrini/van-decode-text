/**
 * Converts text to a binary string representation.
 * "React" → "01010010 01100101 01100011"
 */
export function toBinaryGlyph(text: string, maxChars = 4): string {
  const seed = text.trim().slice(0, maxChars);
  if (!seed) return "01010101";
  return seed
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}
