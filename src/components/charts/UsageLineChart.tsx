import React from 'react';
import { Box, useTheme } from '@mui/material';

interface LineChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  height?: number;
  showValues?: boolean;
  showArea?: boolean;
  maxValue?: number;
  formatValue?: (value: number) => string;
  title?: string;
  color?: string;
}

const UsageLineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  showValues = true,
  showArea = true,
  maxValue,
  formatValue = (value) => value.toString(),
  title,
  color
}) => {
  const theme = useTheme();
  const lineColor = color || theme.palette.primary.main;
  
  // Calculate the maximum value for scaling
  const calculatedMax = maxValue || Math.max(...data.map(item => item.value), 1);
  
  // Create points for the line
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value / calculatedMax) * 100);
    return `${x},${y}`;
  }).join(' ');
  
  // Create points for the area (if enabled)
  const areaPoints = showArea
    ? `${points} 100,100 0,100`
    : '';
  
  return (
    <Box sx={{ width: '100%', height: height + 50 }}>
      {title && (
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {title}
        </Typography>
      )}
      
      <Box sx={{ position: 'relative', height, width: '100%' }}>
        {/* Chart grid */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'grid',
            gridTemplateRows: 'repeat(4, 1fr)',
            gridTemplateColumns: 'repeat(1, 1fr)',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                borderBottom: i < 3 ? '1px dashed' : '1px solid',
                borderColor: 'divider',
                gridRow: i + 1,
                gridColumn: '1 / -1',
              }}
            />
          ))}
        </Box>
        
        {/* SVG for line and area */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Area under the line */}
          {showArea && (
            <polygon
              points={areaPoints}
              fill={lineColor}
              fillOpacity="0.1"
            />
          )}
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value / calculatedMax) * 100);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={theme.palette.background.paper}
                stroke={lineColor}
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {data.length > 10 ? (
            // Show fewer labels if there are many data points
            <>
              <Typography variant="caption" color="text.secondary">
                {data[0].label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {data[Math.floor(data.length / 2)].label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {data[data.length - 1].label}
              </Typography>
            </>
          ) : (
            // Show all labels if there are few data points
            data.map((item, index) => (
              <Typography
                key={index}
                variant="caption"
                color="text.secondary"
                sx={{
                  transform: data.length > 5 ? 'rotate(-45deg)' : 'none',
                  transformOrigin: 'top left',
                  maxWidth: `${100 / data.length}%`,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.label}
              </Typography>
            ))
          )}
        </Box>
        
        {/* Y-axis labels */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: -40,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {[1, 0.75, 0.5, 0.25, 0].map((fraction, index) => (
            <Typography
              key={index}
              variant="caption"
              color="text.secondary"
              sx={{ transform: 'translateY(-50%)' }}
            >
              {formatValue(calculatedMax * fraction)}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default UsageLineChart;
