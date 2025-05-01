import { useEffect } from 'react';
import { useLoading } from '../contexts/LoadingContext';

/**
 * Hook for showing and hiding loading indicators in components
 * 
 * This hook automatically shows a loading indicator when the component is loading
 * and hides it when loading is complete or when the component unmounts.
 * 
 * @param isLoading Whether the component is currently loading
 * @param message The message to display while loading
 * @param type The type of loading indicator to display
 * @returns void
 */
export const useLoadingIndicator = (
  isLoading: boolean,
  message: string = 'Loading...',
  type: 'circular' | 'linear' | 'backdrop' = 'circular'
): void => {
  const { showLoading, hideLoading } = useLoading();
  
  useEffect(() => {
    if (isLoading) {
      showLoading(message, type);
    } else {
      hideLoading();
    }
    
    // Clean up when the component unmounts
    return () => {
      hideLoading();
    };
  }, [isLoading, message, type, showLoading, hideLoading]);
};

/**
 * Example usage:
 * 
 * ```tsx
 * const MyComponent: React.FC = () => {
 *   const [data, setData] = useState<Data | null>(null);
 *   const [loading, setLoading] = useState<boolean>(false);
 *   
 *   // Use the loading indicator hook
 *   useLoadingIndicator(loading, 'Loading data...', 'backdrop');
 *   
 *   const fetchData = async () => {
 *     setLoading(true);
 *     try {
 *       const result = await fetchApiData();
 *       setData(result);
 *     } catch (error) {
 *       console.error('Error:', error);
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 *   
 *   useEffect(() => {
 *     fetchData();
 *   }, []);
 *   
 *   return (
 *     <div>
 *       {data && <div>{data.name}</div>}
 *       <button onClick={fetchData} disabled={loading}>
 *         Refresh
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 */

export default useLoadingIndicator;
