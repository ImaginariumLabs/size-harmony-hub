
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { UserCircle, Save, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SaveMeasurementsProps {
  bust: string;
  measurementType: string;
  units: string;
}

const SaveMeasurements = ({ bust, measurementType, units }: SaveMeasurementsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your measurements",
        variant: "destructive",
      });
      return;
    }

    if (!bust || isNaN(parseFloat(bust))) {
      toast({
        title: "Invalid measurement",
        description: "Please enter a valid measurement value",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // First check if we already have a measurement of this type
      const { data: existingMeasurement } = await supabase
        .from('user_measurements')
        .select('id')
        .eq('user_id', user.id)
        .eq('measurement_type', measurementType)
        .maybeSingle();
      
      // Determine if we need to insert or update
      if (existingMeasurement) {
        // Update existing measurement
        const { error } = await supabase
          .from('user_measurements')
          .update({
            value: parseFloat(bust),
            unit: units,
            updated_at: new Date()
          })
          .eq('id', existingMeasurement.id);

        if (error) throw error;
      } else {
        // Insert new measurement
        const { error } = await supabase
          .from('user_measurements')
          .insert({
            user_id: user.id,
            measurement_type: measurementType,
            value: parseFloat(bust),
            unit: units
          });

        if (error) throw error;
      }

      toast({
        title: "Measurements saved",
        description: "Your measurements have been saved to your profile",
      });
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000); // Reset after 3 seconds
    } catch (error) {
      console.error('Error saving measurements:', error);
      toast({
        title: "Error saving measurements",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button 
      onClick={handleSave}
      variant="outline"
      disabled={isSaving}
      className={`w-full mt-4 flex items-center gap-2 ${isSaved ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
    >
      {isSaving ? (
        <>
          <Save className="h-4 w-4 animate-pulse" />
          Saving...
        </>
      ) : isSaved ? (
        <>
          <Check className="h-4 w-4" />
          Saved
        </>
      ) : (
        <>
          <UserCircle className="h-4 w-4" />
          Save Measurements to Profile
        </>
      )}
    </Button>
  );
};

export default SaveMeasurements;
