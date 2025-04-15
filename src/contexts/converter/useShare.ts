
import { useToast } from '@/hooks/use-toast';
import { SizeResultType } from './types';

export const useShare = () => {
  const { toast } = useToast();
  
  const shareResults = (result: SizeResultType, brand: string, clothingType: string) => {
    if (!result) return;
    
    const text = `My ${clothingType} size at ${brand} is US: ${result.usSize}, UK: ${result.ukSize}, EU: ${result.euSize} (via Size Harmony Hub)`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Size Results from Size Harmony Hub',
        text: text,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
        navigator.clipboard.writeText(text).then(() => {
          toast({
            title: "Copied to clipboard!",
            description: "Your size info has been copied to share",
          });
        });
      });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "Your size info has been copied to share",
        });
      });
    }
  };
  
  return { shareResults };
};
