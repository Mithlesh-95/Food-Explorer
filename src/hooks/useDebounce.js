import { useState, useEffect } from 'react';

/**
 * A custom hook to debounce a fast-changing value (like a search input).
 * Ensures that the updated value is only returned after a specified delay 
 * of inactivity, preventing spammy API calls.
 */
export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set a timer to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: clears the timer if the value or delay changes
        // This is what actually causes the generic "debounce" effect!
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
