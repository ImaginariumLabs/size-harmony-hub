import React from 'react';
import { Button } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

interface ActiveProvidersSummaryProps {
  providerCount: number;
  onManageClick: () => void;
}

const ActiveProvidersSummary: React.FC<ActiveProvidersSummaryProps> = ({ providerCount, onManageClick }) => {
  return (
    <div className="bento-item small">
      <div className="bento-item-header">
        <h3 className="bento-item-title">Active Providers</h3>
      </div>
      <div className="bento-item-content">
        <div className="value">{providerCount}</div>
        <Button
          size="small"
          onClick={onManageClick}
          sx={{ mt: 1 }}
          startIcon={<SettingsIcon />}
        >
          Manage
        </Button>
      </div>
    </div>
  );
};

export default ActiveProvidersSummary;
