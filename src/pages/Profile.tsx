
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, UserCircle, Ruler, History, BarChart3, Settings, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

type UserMeasurement = {
  id: string;
  measurement_type: string;
  value: number;
  unit: string;
  created_at: string;
  updated_at: string;
};

type SizeHistory = {
  id: string;
  brand_id: string;
  brand_name: string;
  garment_id: string;
  garment_name: string;
  measurement_type: string;
  measurement_value: number;
  measurement_unit: string;
  converted_size: {
    usSize: string;
    ukSize: string;
    euSize: string;
  };
  created_at: string;
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [measurements, setMeasurements] = useState<UserMeasurement[]>([]);
  const [sizeHistory, setSizeHistory] = useState<SizeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandNames, setBrandNames] = useState<Record<string, string>>({});
  const [garmentNames, setGarmentNames] = useState<Record<string, string>>({});

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch user measurements
        const { data: measurementsData, error: measurementsError } = await supabase
          .from('user_measurements')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (measurementsError) throw measurementsError;
        setMeasurements(measurementsData || []);

        // Fetch size history
        const { data: historyData, error: historyError } = await supabase
          .from('user_size_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (historyError) throw historyError;
        setSizeHistory(historyData || []);

        // Get brand names
        if (historyData && historyData.length > 0) {
          const brandIds = [...new Set(historyData.map(item => item.brand_id))];
          const { data: brandsData } = await supabase
            .from('brands')
            .select('id, name')
            .in('id', brandIds);

          const brandMap: Record<string, string> = {};
          brandsData?.forEach(brand => {
            brandMap[brand.id] = brand.name;
          });
          setBrandNames(brandMap);

          // Get garment names
          const garmentIds = [...new Set(historyData.map(item => item.garment_id))];
          const { data: garmentsData } = await supabase
            .from('garments')
            .select('id, name')
            .in('id', garmentIds);

          const garmentMap: Record<string, string> = {};
          garmentsData?.forEach(garment => {
            garmentMap[garment.id] = garment.name;
          });
          setGarmentNames(garmentMap);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: "Error loading profile",
          description: "Could not load your profile data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate, toast]);

  const handleDeleteMeasurement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_measurements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMeasurements(measurements.filter(m => m.id !== id));
      toast({
        title: "Measurement deleted",
        description: "Your measurement has been removed successfully."
      });
    } catch (error) {
      console.error('Error deleting measurement:', error);
      toast({
        title: "Error deleting measurement",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const formatMeasurementType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (!user) {
    return null; // This shouldn't happen as we redirect, but just in case
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <UserCircle className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.user_metadata?.full_name || 'My Profile'}</h1>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
          </motion.div>

          <Tabs defaultValue="measurements" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="measurements" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                <span className="hidden sm:inline">My Measurements</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Size History</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="measurements">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : measurements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {measurements.map(measurement => (
                    <Card key={measurement.id} className="overflow-hidden">
                      <CardHeader className="bg-primary/5 py-4">
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center">
                            <Ruler className="h-5 w-5 mr-2 text-primary" />
                            {formatMeasurementType(measurement.measurement_type)}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteMeasurement(measurement.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div className="text-xl font-bold">
                            {measurement.value} {measurement.unit}
                          </div>
                          <div className="text-sm text-gray-500">
                            Updated {format(new Date(measurement.updated_at), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Ruler className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-600">No measurements saved yet</h3>
                  <p className="text-gray-500 mb-4">
                    Save your measurements when using the size converter
                  </p>
                  <Button onClick={() => navigate('/')}>
                    Go to Size Converter
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : sizeHistory.length > 0 ? (
                <div className="space-y-4">
                  {sizeHistory.map(item => (
                    <Card key={item.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between">
                          <span>{brandNames[item.brand_id] || 'Unknown Brand'}</span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(item.created_at), 'MMM d, yyyy')}
                          </span>
                        </CardTitle>
                        <CardDescription>
                          {garmentNames[item.garment_id] || 'Clothing item'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-8">
                          <div>
                            <p className="text-sm text-gray-500">Measurement</p>
                            <p className="font-medium">
                              {formatMeasurementType(item.measurement_type)}: {item.measurement_value} {item.measurement_unit}
                            </p>
                          </div>
                          <div className="flex gap-6">
                            <div>
                              <p className="text-sm text-gray-500">US Size</p>
                              <p className="font-bold text-lg">{item.converted_size.usSize}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">UK Size</p>
                              <p className="font-bold text-lg">{item.converted_size.ukSize}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">EU Size</p>
                              <p className="font-bold text-lg">{item.converted_size.euSize}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <History className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-600">No size history yet</h3>
                  <p className="text-gray-500 mb-4">
                    Your size conversion history will appear here
                  </p>
                  <Button onClick={() => navigate('/')}>
                    Try the Size Converter
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Preferred Measurement Unit</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" className="bg-primary/5">Inches</Button>
                      <Button variant="outline">Centimeters</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Email Notifications</h3>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email-notifications" className="rounded border-gray-300" />
                      <label htmlFor="email-notifications">
                        Receive updates and size recommendations
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
