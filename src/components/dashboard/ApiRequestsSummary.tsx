import React from 'react';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

interface ApiRequestsSummaryProps {
  totalRequests: number;
  changePercentage?: number;
  changeDirection?: 'increase' | 'decrease';
}

const ApiRequestsSummary: React.FC<ApiRequestsSummaryProps> = ({
  totalRequests,
  changePercentage = 8,
  changeDirection = 'increase'
}) => {
  return (
    <div className="bento-item medium">
      <div className="bento-item-header">
        <h3 className="bento-item-title">API Requests (Today)</h3>
      </div>
      <div className="bento-item-content">
        <div className="value">{totalRequests.toLocaleString()}</div>
        <div className="usage-details">
          <span style={{ display: 'flex', alignItems: 'center', color: changeDirection === 'increase' ? '#4caf50' : '#f44336' }}>
            <TrendingUpIcon sx={{ mr: 0.5, fontSize: 16 }} />
            {changePercentage}% {changeDirection === 'increase' ? 'more' : 'less'} than yesterday
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApiRequestsSummary;
