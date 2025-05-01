import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import {
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { DashboardWidget } from '../../contexts/DashboardWidgetContext';
import { AdvancedWidgetType, AdvancedWidgetConfig } from '../widgets/AdvancedWidgetFactory';
import {
  exportDashboardConfig,
  importDashboardConfig,
  generateExportFileName,
  downloadDashboardConfig,
  readDashboardConfigFile,
  DashboardConfig,
} from '../../services/dashboardSharingService';

interface DashboardSharingDialogProps {
  open: boolean;
  onClose: () => void;
  widgets: DashboardWidget[];
  advancedWidgets: Array<{
    id: string;
    type: AdvancedWidgetType;
    config: AdvancedWidgetConfig;
  }>;
  layout: 'standard' | 'draggable';
  onImport: (config: DashboardConfig) => void;
}

/**
 * DashboardSharingDialog component
 *
 * Dialog for exporting and importing dashboard configurations.
 */
const DashboardSharingDialog: React.FC<DashboardSharingDialogProps> = ({
  open,
  onClose,
  widgets,
  advancedWidgets,
  layout,
  onImport,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardName, setDashboardName] = useState('My Dashboard');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [exportedConfig, setExportedConfig] = useState('');
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Reset states when switching tabs
    setImportError(null);
    setImportSuccess(false);
    setCopied(false);
  };

  // Handle export
  const handleExport = () => {
    try {
      const config = exportDashboardConfig(
        dashboardName,
        dashboardDescription,
        widgets,
        advancedWidgets,
        layout
      );
      setExportedConfig(config);
    } catch (error) {
      console.error('Failed to export dashboard:', error);
    }
  };

  // Handle download
  const handleDownload = () => {
    try {
      const config = exportDashboardConfig(
        dashboardName,
        dashboardDescription,
        widgets,
        advancedWidgets,
        layout
      );
      const fileName = generateExportFileName(dashboardName);
      downloadDashboardConfig(config, fileName);
    } catch (error) {
      console.error('Failed to download dashboard:', error);
    }
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(exportedConfig)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  // Handle file selection
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Handle file change
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setImportError(null);
    setImportSuccess(false);

    try {
      const content = await readDashboardConfigFile(file);
      const config = importDashboardConfig(content);
      onImport(config);
      setImportSuccess(true);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Dashboard Sharing</DialogTitle>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="dashboard sharing tabs"
        sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Export" />
        <Tab label="Import" />
      </Tabs>
      <DialogContent>
        {activeTab === 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Export Dashboard Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Export your dashboard configuration to share with others or save for later use.
            </Typography>

            <TextField
              fullWidth
              label="Dashboard Name"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Description (optional)"
              value={dashboardDescription}
              onChange={(e) => setDashboardDescription(e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={handleExport}
              >
                Generate Export
              </Button>

              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleDownload}
              >
                Download JSON
              </Button>
            </Box>

            {exportedConfig && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">
                    Exported Configuration
                  </Typography>
                  <Button
                    size="small"
                    startIcon={copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                    onClick={handleCopy}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  value={exportedConfig}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                    },
                  }}
                />
              </Box>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Dashboard Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label={`${widgets.length} Standard Widgets`} />
                <Chip label={`${advancedWidgets.length} Advanced Widgets`} />
                <Chip label={`${layout === 'draggable' ? 'Draggable' : 'Standard'} Layout`} />
              </Box>
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Import Dashboard Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Import a dashboard configuration from a JSON file or paste it directly.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, border: '2px dashed rgba(255, 255, 255, 0.1)', borderRadius: 2, mb: 3 }}>
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <FileUploadIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
              <Typography variant="body1" gutterBottom>
                Drag & drop a JSON file here or click to browse
              </Typography>
              <Button
                variant="contained"
                onClick={handleFileSelect}
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Select File'}
              </Button>
            </Box>

            {importError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {importError}
              </Alert>
            )}

            {importSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Dashboard configuration imported successfully!
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              Note: Importing a dashboard configuration will replace your current dashboard layout and widgets.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardSharingDialog;
