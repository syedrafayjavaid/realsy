/**
 * Returns the given string with all non-numeric characters stripped
 * @param original
 * @returns {*}
 */
export function numericCharsOnly(original: string) {
    return original.replace(/\D/g, '');
}
