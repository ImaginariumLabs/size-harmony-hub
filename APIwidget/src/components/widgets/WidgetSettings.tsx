import React, { useState, useEffect } from 'react';
import { WidgetSettings as SettingsType, loadSettings, saveSettings } from '../../services/settingsService';
import { getAllProviders } from '../../services/mockDataService';
import '../../styles/components/widgets/WidgetSettings.css';

interface WidgetSettingsProps {
  onClose: () => void;
}

const WidgetSettings: React.FC<WidgetSettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<SettingsType>(loadSettings());
  const [providers, setProviders] = useState<{ id: string; name: string }[]>([]);

  // Load providers
  useEffect(() => {
    const loadProviders = async () => {
      const allProviders = getAllProviders();
      setProviders(allProviders.map(p => ({ id: p.id, name: p.name })));
    };
    
    loadProviders();
  }, []);

  // Handle settings changes
  const handleChange = (key: keyof SettingsType, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Handle alert threshold changes
  const handleThresholdChange = (providerId: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      alertThresholds: {
        ...prev.alertThresholds,
        [providerId]: value
      }
    }));
  };

  // Save settings
  const handleSave = () => {
    saveSettings(settings);
    onClose();
  };

  // Cancel changes
  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="widget-settings-overlay">
      <div className="widget-settings-panel">
        <div className="widget-settings-header">
          <h2>Widget Settings</h2>
          <button className="widget-settings-close" onClick={onClose}>×</button>
        </div>
        
        <div className="widget-settings-content">
          <div className="settings-section">
            <h3>Appearance</h3>
            
            <div className="settings-row">
              <label>Theme</label>
              <div className="settings-options">
                <button 
                  className={`theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleChange('theme', 'dark')}
                >
                  Dark
                </button>
                <button 
                  className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleChange('theme', 'light')}
                >
                  Light
                </button>
              </div>
            </div>
            
            <div className="settings-row">
              <label>Size</label>
              <select 
                value={settings.size}
                onChange={(e) => handleChange('size', e.target.value)}
              >
                <option value="compact">Compact</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Behavior</h3>
            
            <div className="settings-row">
              <label>Default Provider</label>
              <select 
                value={settings.activeProvider}
                onChange={(e) => handleChange('activeProvider', e.target.value)}
              >
                {providers.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="settings-row">
              <label>Refresh Interval</label>
              <select 
                value={settings.refreshInterval}
                onChange={(e) => handleChange('refreshInterval', Number(e.target.value))}
              >
                <option value="10">10 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
                <option value="300">5 minutes</option>
              </select>
            </div>
            
            <div className="settings-row">
              <label>Show Widget</label>
              <input 
                type="checkbox" 
                checked={settings.showWidget}
                onChange={(e) => handleChange('showWidget', e.target.checked)}
              />
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Alert Thresholds</h3>
            <p className="settings-description">
              Get alerted when API costs exceed these thresholds (in $)
            </p>
            
            {providers.map(provider => (
              <div className="settings-row" key={provider.id}>
                <label>{provider.name}</label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={settings.alertThresholds[provider.id] || 0}
                  onChange={(e) => handleThresholdChange(provider.id, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="widget-settings-footer">
          <button className="settings-button cancel" onClick={handleCancel}>Cancel</button>
          <button className="settings-button save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default WidgetSettings;
