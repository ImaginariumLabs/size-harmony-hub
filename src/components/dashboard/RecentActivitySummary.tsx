import React from 'react';
import { Typography } from '@mui/material';

interface ActivityItem {
  providerId: string;
  providerName: string;
  time: string;
  requests: number;
  cost: number;
}

interface RecentActivitySummaryProps {
  activities: ActivityItem[];
}

const RecentActivitySummary: React.FC<RecentActivitySummaryProps> = ({ activities }) => {
  return (
    <div className="bento-item medium tall">
      <div className="bento-item-header">
        <h3 className="bento-item-title">Recent Activity</h3>
      </div>
      <div className="bento-item-content">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon" style={{ backgroundColor: getProviderColor(activity.providerId) }}>
                {activity.providerName.charAt(0)}
              </div>
              <div className="activity-details">
                <div className="activity-header">
                  <span className="activity-provider">{activity.providerName}</span>
                  <span className="activity-time">Today, {activity.time} PM</span>
                </div>
                <div className="activity-description">
                  {activity.requests} requests (${activity.cost.toFixed(2)})
                </div>
              </div>
            </div>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No recent activity to display
          </Typography>
        )}
      </div>
    </div>
  );
};

// Helper function to get provider color
const getProviderColor = (providerId: string): string => {
  switch (providerId) {
    case 'openai':
      return '#10a37f';
    case 'claude':
      return '#5436DA';
    case 'google':
      return '#4285F4';
    case 'github':
      return '#24292e';
    case 'aws':
      return '#ff9900';
    default:
      return '#64b5f6';
  }
};

export default RecentActivitySummary;
