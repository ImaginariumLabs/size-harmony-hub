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

interface ProviderCostAnalysisChartProps {
  data: Array<{
    name: string;
    cost: number;
    [key: string]: unknown;
  }>;
  title?: string;
  color?: string;
  yAxisLabel?: string;
  height?: number;
}

const ProviderCostAnalysisChart: React.FC<ProviderCostAnalysisChartProps> = ({
  data,
  title = 'Cost Analysis',
  color,
  yAxisLabel = 'Cost ($)',
  height = 400,
}) => {
  const theme = useTheme();
  
  // Use theme color if no color is provided
  const barColor = color || theme.palette.primary.main;
  
  // Format value for tooltip
  const formatCost = (value: number) => {
    return `$${value.toFixed(2)}`;
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
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value: number) => [formatCost(value), 'Cost']}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 4,
            }}
          />
          <Legend />
          <Bar dataKey="cost" fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ProviderCostAnalysisChart;
