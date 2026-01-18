import { useState, useEffect } from 'react';

/**
 * Custom hook để debounce value
 * Giúp tránh gọi API quá nhiều khi user đang gõ
 */
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
