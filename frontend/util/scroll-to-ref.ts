/**
 * Scrolls the window to a given ref
 * @param ref
 * @param offset
 */
export const scrollToRef = (ref: React.RefObject<any>, offset = 0) => window.scrollTo({
    top: ref?.current?.offsetTop + offset,
    left: 0,
    behavior: 'smooth'
});
