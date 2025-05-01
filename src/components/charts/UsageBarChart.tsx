import React from 'react';
import { Box, useTheme } from '@mui/material';

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  showValues?: boolean;
  maxValue?: number;
  formatValue?: (value: number) => string;
  title?: string;
}

const UsageBarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  showValues = true,
  maxValue,
  formatValue = (value) => value.toString(),
  title
}) => {
  const theme = useTheme();
  
  // Calculate the maximum value for scaling
  const calculatedMax = maxValue || Math.max(...data.map(item => item.value), 1);
  
  return (
    <Box sx={{ width: '100%', height: height + 50 }}>
      {title && (
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {title}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', height, alignItems: 'flex-end', position: 'relative' }}>
        {/* Y-axis line */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 1,
            bgcolor: 'divider'
          }}
        />
        
        {/* X-axis line */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 1,
            bgcolor: 'divider'
          }}
        />
        
        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / calculatedMax) * height;
          
          return (
            <Box
              key={index}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                px: 0.5
              }}
            >
              {/* Bar */}
              <Box
                sx={{
                  width: '100%',
                  height: Math.max(barHeight, 2),
                  bgcolor: item.color || theme.palette.primary.main,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  transition: 'height 0.3s ease-in-out',
                  '&:hover': {
                    opacity: 0.8,
                    cursor: 'pointer'
                  }
                }}
              />
              
              {/* Value */}
              {showValues && (
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: height - barHeight - 20,
                    color: 'text.secondary',
                    fontWeight: 'medium'
                  }}
                >
                  {formatValue(item.value)}
                </Typography>
              )}
              
              {/* Label */}
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default UsageBarChart;
