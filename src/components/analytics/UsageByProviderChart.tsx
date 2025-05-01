import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

interface UsageByProviderChartProps {
  data: Array<{
    name: string;
    requests: number;
    [key: string]: unknown;
  }>;
  title?: string;
  color?: string;
  yAxisLabel?: string;
  height?: number;
}

const UsageByProviderChart: React.FC<UsageByProviderChartProps> = ({
  data,
  title = 'Usage by Provider',
  color,
  yAxisLabel = 'Request Count',
  height = 400,
}) => {
  const theme = useTheme();
  
  // Use theme color if no color is provided
  const barColor = color || theme.palette.primary.main;
  
  // Format value for tooltip
  const formatValue = (value: number) => {
    if (value > 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value > 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(0);
  };
  
  return (
    <Box sx={{ width: '100%', height: height }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="name" 
            stroke={theme.palette.text.secondary}
          />
          <YAxis
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: theme.palette.text.secondary },
                  }
                : undefined
            }
            stroke={theme.palette.text.secondary}
          />
          <Tooltip
            formatter={(value: number) => [formatValue(value), 'Requests']}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 4,
            }}
          />
          <Legend />
          <Bar dataKey="requests" fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default UsageByProviderChart;
