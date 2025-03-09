
import { useState, useEffect } from 'react';

export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
}

// Add the useIsMobile hook that the sidebar component is trying to use
export function useIsMobile(): boolean {
  return useMedia('(max-width: 768px)');
}
