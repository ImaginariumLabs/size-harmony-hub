
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SaveMeasurementsProps {
  bust: string;
  measurementType: string;
  units: string;
}

const SaveMeasurements = ({ bust, measurementType, units }: SaveMeasurementsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your measurements",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_measurements')
        .upsert({
          user_id: user.id,
          measurement_type: measurementType,
          value: parseFloat(bust),
          unit: units,
        });

      if (error) throw error;

      toast({
        title: "Measurements saved",
        description: "Your measurements have been saved to your profile",
      });
    } catch (error) {
      console.error('Error saving measurements:', error);
      toast({
        title: "Error saving measurements",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleSave}
      variant="outline"
      className="w-full mt-4 flex items-center gap-2"
    >
      <UserCircle className="h-4 w-4" />
      Save Measurements to Profile
    </Button>
  );
};

export default SaveMeasurements;
