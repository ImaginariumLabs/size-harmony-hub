
import React, { useEffect, useState } from 'react';
import { getFeedbackStats } from '../../services/sizingService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

type FeedbackStat = {
  brand: string;
  garmentType: string;
  accurate: number;
  inaccurate: number;
  count: number;
  accuracy?: number;
};

const FeedbackStatsTab = () => {
  const [stats, setStats] = useState<FeedbackStat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const rawStats = await getFeedbackStats();
        
        // Process the raw stats to add accuracy percentage
        const processedStats = rawStats.map((stat: FeedbackStat) => ({
          ...stat,
          accuracy: Math.round((stat.accurate / stat.count) * 100)
        }));
        
        setStats(processedStats);
      } catch (error) {
        console.error('Error fetching feedback stats:', error);
        toast({
          title: "Failed to load feedback statistics",
          description: "Please try refreshing the page.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Feedback Statistics</h2>
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : stats.length === 0 ? (
        <div className="h-64 flex items-center justify-center flex-col">
          <p className="text-lg text-muted-foreground mb-2">No feedback data available yet</p>
          <p className="text-sm text-muted-foreground">Feedback will appear here once users start providing it.</p>
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-4">Size Accuracy by Brand and Garment Type</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="brand" 
                  tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                />
                <YAxis 
                  label={{ value: 'Feedback Count', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'accurate' ? 'Accurate' : 'Inaccurate']}
                  labelFormatter={(label) => `Brand: ${label}`}
                />
                <Legend />
                <Bar name="Accurate" dataKey="accurate" fill="#22c55e" />
                <Bar name="Inaccurate" dataKey="inaccurate" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="overflow-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Garment Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accurate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inaccurate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.map((stat, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{stat.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{stat.garmentType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{stat.accurate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{stat.inaccurate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{stat.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div 
                            className={`h-2.5 rounded-full ${
                              stat.accuracy && stat.accuracy >= 70 ? 'bg-green-500' : 
                              stat.accuracy && stat.accuracy >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${stat.accuracy}%` }}
                          ></div>
                        </div>
                        <span>{stat.accuracy}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackStatsTab;
