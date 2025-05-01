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
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

interface ProviderResponseTimeChartProps {
  data: Array<{
    date: string;
    responseTime: number;
    [key: string]: unknown;
  }>;
  title?: string;
  color?: string;
  yAxisLabel?: string;
  height?: number;
}

const ProviderResponseTimeChart: React.FC<ProviderResponseTimeChartProps> = ({
  data,
  title = 'Response Time Analysis',
  color,
  yAxisLabel = 'Response Time (ms)',
  height = 400,
}) => {
  const theme = useTheme();
  
  // Use theme color if no color is provided
  const lineColor = color || theme.palette.warning.main;
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  // Format value for tooltip
  const formatResponseTime = (value: number) => {
    return `${value.toFixed(0)} ms`;
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
          />
          <Tooltip
            formatter={(value: number) => [formatResponseTime(value), 'Response Time']}
            labelFormatter={formatDate}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 4,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="responseTime"
            stroke={lineColor}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ProviderResponseTimeChart;
