import { useEffect, useState } from "react";

/**
 * Hook to debounce a value with optional callback
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @param onDebounce - Optional callback when debounced value changes
 * @returns The debounced value
 */
export function useDebounce<T>(
  value: T,
  delay: number = 500,
  onDebounce?: (value: T) => void,
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      onDebounce?.(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, onDebounce]);

  return debouncedValue;
}
