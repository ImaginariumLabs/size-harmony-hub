import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface PieChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  size?: number;
  showLegend?: boolean;
  formatValue?: (value: number) => string;
  title?: string;
}

const UsagePieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  showLegend = true,
  formatValue = (value) => value.toString(),
  title
}) => {
  const theme = useTheme();
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Generate colors if not provided
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    // Add more colors as needed
  ];
  
  // Calculate segments for the pie chart
  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    
    // Calculate SVG arc path
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    const startRadians = (startAngle - 90) * (Math.PI / 180);
    const endRadians = (endAngle - 90) * (Math.PI / 180);
    
    const radius = size / 2;
    const x1 = radius + radius * Math.cos(startRadians);
    const y1 = radius + radius * Math.sin(startRadians);
    const x2 = radius + radius * Math.cos(endRadians);
    const y2 = radius + radius * Math.sin(endRadians);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${radius},${radius}`,
      `L ${x1},${y1}`,
      `A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`,
      'Z'
    ].join(' ');
    
    return {
      path: pathData,
      color: item.color || colors[index % colors.length],
      percentage,
      label: item.label,
      value: item.value
    };
  });
  
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {title && (
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {title}
        </Typography>
      )}
      
      <Box sx={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.path}
              fill={segment.color}
              stroke={theme.palette.background.paper}
              strokeWidth="1"
            />
          ))}
          
          {/* Center circle for donut effect */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 4}
            fill={theme.palette.background.paper}
          />
          
          {/* Total in center */}
          <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={theme.palette.text.primary}
            fontSize="16"
            fontWeight="bold"
          >
            {formatValue(total)}
          </text>
        </svg>
      </Box>
      
      {showLegend && (
        <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {segments.map((segment, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  bgcolor: segment.color,
                  borderRadius: '4px'
                }}
              />
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {segment.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatValue(segment.value)} ({segment.percentage.toFixed(1)}%)
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UsagePieChart;
