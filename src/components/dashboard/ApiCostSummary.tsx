import React from 'react';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { ApiCostData } from '../../types/api';

interface ApiCostSummaryProps {
  totalCost: number;
  budget: number;
  changePercentage?: number;
  changeDirection?: 'increase' | 'decrease';
}

const ApiCostSummary: React.FC<ApiCostSummaryProps> = ({
  totalCost,
  budget,
  changePercentage = 12,
  changeDirection = 'decrease'
}) => {
  // Calculate usage percentage
  const usagePercentage = Math.min((totalCost / budget) * 100, 100);
  
  return (
    <div className="bento-item medium cost-summary">
      <div className="bento-item-header">
        <h3 className="bento-item-title">Total API Cost (This Month)</h3>
      </div>
      <div className="bento-item-content">
        <div className="value">${totalCost.toFixed(2)}</div>
        <div className="usage-details">
          <span style={{ display: 'flex', alignItems: 'center', color: changeDirection === 'decrease' ? '#4caf50' : '#f44336' }}>
            <TrendingUpIcon sx={{ mr: 0.5, fontSize: 16 }} />
            {changePercentage}% {changeDirection === 'decrease' ? 'less' : 'more'} than last month
          </span>
          <span>Budget: ${budget.toFixed(2)}</span>
        </div>
        <div className="usage-bar">
          <div
            className={`usage-bar-fill ${usagePercentage > 80 ? 'high' : usagePercentage > 50 ? 'medium' : 'low'}`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ApiCostSummary;
