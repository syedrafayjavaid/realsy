/**
 * Formats a currency amount in USD, with commas and 2 decimal points (pass omitDecimal false to omit the decimal)
 * @param amount
 * @param options
 */
export function formatCurrency(amount: number, {omitDecimal = false} = {}) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const formatted = formatter.format(amount);
    return omitDecimal ? formatted.substring(0, formatted.length - 3) : formatted;
}
