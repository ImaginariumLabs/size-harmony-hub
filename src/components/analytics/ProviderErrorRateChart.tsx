import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

interface ProviderErrorRateChartProps {
  data: Array<{
    date: string;
    errorRate: number;
    [key: string]: unknown;
  }>;
  title?: string;
  color?: string;
  yAxisLabel?: string;
  height?: number;
  threshold?: number;
}

const ProviderErrorRateChart: React.FC<ProviderErrorRateChartProps> = ({
  data,
  title = 'Error Rate Analysis',
  color,
  yAxisLabel = 'Error Rate (%)',
  height = 400,
  threshold = 5, // 5% error rate threshold
}) => {
  const theme = useTheme();
  
  // Use theme color if no color is provided
  const lineColor = color || theme.palette.error.main;
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  // Format value for tooltip
  const formatErrorRate = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  return (
    <Box sx={{ width: '100%', height: height }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            dataKey="date"
            tickFormatter={formatDate}
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
            domain={[0, 'dataMax + 2']}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value: number) => [formatErrorRate(value), 'Error Rate']}
            labelFormatter={formatDate}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 4,
            }}
          />
          <Legend />
          <ReferenceLine 
            y={threshold} 
            stroke={theme.palette.error.light} 
            strokeDasharray="3 3" 
            label={{ 
              value: 'Threshold', 
              position: 'right',
              fill: theme.palette.error.light
            }} 
          />
          <Line
            type="monotone"
            dataKey="errorRate"
            stroke={lineColor}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ProviderErrorRateChart;
