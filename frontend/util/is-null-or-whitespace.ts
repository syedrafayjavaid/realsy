/**
 * Checks if a string is null, empty, or all whitespace
 * @param input
 */
export function isNullOrWhitespace(input: string) {
    return !input || !input.trim();
}
