import React from 'react';
import { Typography } from '@mui/material';

interface AlertsData {
  providerId: string;
  name: string;
  usagePercentage: number;
}

interface AlertsSummaryProps {
  apiCostData: Record<string, any>;
  providers: Array<{ id: string; name: string }>;
}

const AlertsSummary: React.FC<AlertsSummaryProps> = ({ apiCostData, providers }) => {
  return (
    <div className="bento-item small">
      <div className="bento-item-header">
        <h3 className="bento-item-title">Alerts</h3>
      </div>
      <div className="bento-item-content">
        {Object.entries(apiCostData).map(([providerId, data]: [string, any]) => {
          // Only show alerts for high usage
          if (data.usagePercentage > 50) {
            const provider = providers.find(p => p.id === providerId);
            if (!provider) return null;

            return (
              <div className="provider-status" key={providerId}>
                <div className={`provider-status-indicator ${data.usagePercentage > 80 ? 'error' : 'warning'}`}></div>
                <span className="provider-status-name">{provider.name}</span>
                <span className="provider-status-value">{data.usagePercentage}% used</span>
              </div>
            );
          }
          return null;
        })}

        {Object.values(apiCostData).filter((data: any) => data.usagePercentage > 50).length === 0 && (
          <div className="provider-status">
            <div className="provider-status-indicator healthy"></div>
            <span className="provider-status-name">All APIs</span>
            <span className="provider-status-value">Operational</span>
          </div>
        )}

        {Object.keys(apiCostData).length === 0 && (
          <div style={{ padding: '12px 0', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No alerts to display
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsSummary;
