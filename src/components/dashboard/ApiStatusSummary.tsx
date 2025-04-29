import React from 'react';
import { Typography } from '@mui/material';

interface ApiStatusData {
  providerId: string;
  name: string;
  total: number;
  usagePercentage: number;
}

interface ApiStatusSummaryProps {
  apiStatusData: Record<string, ApiStatusData>;
}

const ApiStatusSummary: React.FC<ApiStatusSummaryProps> = ({ apiStatusData }) => {
  return (
    <div className="bento-item medium">
      <div className="bento-item-header">
        <h3 className="bento-item-title">API Status</h3>
      </div>
      <div className="bento-item-content">
        {Object.values(apiStatusData).length > 0 ? (
          Object.values(apiStatusData).map((provider) => (
            <div key={provider.providerId} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div className="provider-status">
                  <div
                    className={`provider-status-indicator ${
                      provider.usagePercentage > 80 ? 'error' :
                      provider.usagePercentage > 50 ? 'warning' : 'healthy'
                    }`}
                  ></div>
                  <span className="provider-status-name">{provider.name}</span>
                </div>
                <span className="provider-status-value">${provider.total.toFixed(2)} ({provider.usagePercentage}% Used)</span>
              </div>
              <div className="usage-bar">
                <div
                  className={`usage-bar-fill ${
                    provider.usagePercentage > 80 ? 'high' :
                    provider.usagePercentage > 50 ? 'medium' : 'low'
                  }`}
                  style={{ width: `${provider.usagePercentage}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No API providers configured
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ApiStatusSummary;
