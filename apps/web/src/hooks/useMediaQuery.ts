import { useEffect, useState, useMemo } from 'react';

const useMediaQuery = (query: string): boolean => {
  const mediaQueryList = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query);
    }
  }, [query]);

  const [matches, setMatches] = useState(mediaQueryList?.matches);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleChange = () => setMatches(mediaQueryList?.matches);
      mediaQueryList?.addEventListener('change', handleChange);

      return () => mediaQueryList?.removeEventListener('change', handleChange);
    }
  }, [mediaQueryList]);

  return matches || false;
};

export { useMediaQuery };
