/**
 * Disables scrolling of the main page body (eg. while a modal is active)
 */
export function disableMainBodyScroll() {
    document.body.style.overflow = 'hidden';
}

/**
 * Resets the main body scroll
 */
export function enableMainBodyScroll() {
    document.body.style.overflow = 'unset';
}
