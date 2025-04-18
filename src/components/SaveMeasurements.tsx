
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserCircle, Save, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SaveMeasurementsProps {
  bust: string;
  measurementType: string;
  units: string;
}

const SaveMeasurements = ({ bust, measurementType, units }: SaveMeasurementsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save your measurements');
      navigate('/auth');
      return;
    }

    if (!bust || isNaN(parseFloat(bust))) {
      toast.error('Please enter a valid measurement value');
      return;
    }

    setIsSaving(true);
    
    try {
      // First check if we already have a measurement of this type
      const { data: existingMeasurement, error: checkError } = await supabase
        .from('user_measurements')
        .select('id')
        .eq('user_id', user.id)
        .eq('measurement_type', measurementType)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // Determine if we need to insert or update
      if (existingMeasurement) {
        // Update existing measurement
        const { error } = await supabase
          .from('user_measurements')
          .update({
            value: parseFloat(bust),
            unit: units,
            updated_at: new Date().toISOString() // Convert Date to string using toISOString()
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

      toast.success('Measurements saved to your profile');
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000); // Reset after 3 seconds
    } catch (error) {
      console.error('Error saving measurements:', error);
      toast.error('Error saving measurements. Please try again later.');
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
