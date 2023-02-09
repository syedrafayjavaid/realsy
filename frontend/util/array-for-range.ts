/**
 * Creates an array for the given min/max range
 * @param min
 * @param max
 * @returns {[]}
 */
export function arrayForRange(min: number, max: number) {
    const array = [];
    for (let i = min; i <= max; ++i) {
        array.push(i);
    }
    return array;
}
