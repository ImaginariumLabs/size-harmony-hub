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

interface UsageOverviewChartProps {
  data: Array<{
    date: string;
    value: number;
    [key: string]: unknown;
  }>;
  title?: string;
  dataKey?: string;
  color?: string;
  yAxisLabel?: string;
  height?: number;
}

const UsageOverviewChart: React.FC<UsageOverviewChartProps> = ({
  data,
  title = 'Usage Overview',
  dataKey = 'value',
  color,
  yAxisLabel = 'Request Count',
  height = 400,
}) => {
  const theme = useTheme();
  
  // Use theme color if no color is provided
  const lineColor = color || theme.palette.primary.main;
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
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
            formatter={(value: number) => [formatValue(value), dataKey]}
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
            dataKey={dataKey}
            stroke={lineColor}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default UsageOverviewChart;
