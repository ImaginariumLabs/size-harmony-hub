# Operations Guide

This document provides comprehensive guidance for operating and maintaining the APIwidget application in production environments.

## Table of Contents

1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Deployment](#deployment)
4. [Configuration](#configuration)
5. [Monitoring](#monitoring)
6. [Maintenance](#maintenance)
7. [Troubleshooting](#troubleshooting)
8. [Scaling](#scaling)
9. [Security](#security)
10. [Backup and Recovery](#backup-and-recovery)
11. [Upgrades](#upgrades)
12. [References](#references)

## Introduction

APIwidget is a desktop application that provides real-time monitoring of API usage and costs. This operations guide is intended for system administrators, DevOps engineers, and IT support staff responsible for deploying, configuring, and maintaining the application in production environments.

## System Requirements

### Hardware Requirements

- **Minimum**: 
  - CPU: 2 cores
  - RAM: 4 GB
  - Disk: 1 GB free space
  - Network: Broadband internet connection

- **Recommended**:
  - CPU: 4 cores
  - RAM: 8 GB
  - Disk: 5 GB free space
  - Network: High-speed internet connection

### Software Requirements

- **Operating System**: Windows 10/11, macOS 12+, or Ubuntu 20.04+
- **Node.js**: v16.x or higher
- **npm**: v7.x or higher
- **Database**: Supabase (PostgreSQL)

## Deployment

### Deployment Options

APIwidget can be deployed in several ways:

1. **Desktop Application**: Distributed as an installer for Windows, macOS, or Linux
2. **Self-hosted Server**: Deployed on a server for multi-user access
3. **Cloud-hosted**: Deployed on cloud platforms like AWS, Azure, or Google Cloud

### Deployment Process

#### Desktop Application

1. Download the installer from the [releases page](https://github.com/ImaginariumLabs/APIwidget/releases)
2. Run the installer and follow the on-screen instructions
3. Launch the application from the Start menu or desktop shortcut

#### Self-hosted Server

1. Clone the repository:
   ```bash
   git clone https://github.com/ImaginariumLabs/APIwidget.git
   cd APIwidget
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm run start:server
   ```

#### Cloud-hosted

For detailed instructions on deploying to cloud platforms, see [DEPLOYMENT_GUIDE.md](../development/DEPLOYMENT_GUIDE.md).

## Configuration

### Environment Variables

APIwidget uses environment variables for configuration. These can be set in a `.env` file in the root directory or as system environment variables.

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | - | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | - | Yes |
| `VITE_USE_MOCK_DATA` | Use mock data instead of real API calls | `false` | No |
| `VITE_API_BASE_URL` | Base URL for API calls | `http://localhost:3000/api` | No |
| `VITE_ENABLE_ANALYTICS` | Enable usage analytics | `false` | No |

### Configuration Files

In addition to environment variables, APIwidget uses configuration files for more detailed settings:

- **`config.json`**: General application configuration
- **`providers.json`**: API provider configuration
- **`widgets.json`**: Widget configuration

These files are located in the application data directory:
- Windows: `%APPDATA%\APIwidget`
- macOS: `~/Library/Application Support/APIwidget`
- Linux: `~/.config/APIwidget`

## Monitoring

### Application Monitoring

APIwidget includes built-in monitoring capabilities:

1. **Logs**: Application logs are stored in the logs directory:
   - Windows: `%APPDATA%\APIwidget\logs`
   - macOS: `~/Library/Logs/APIwidget`
   - Linux: `~/.config/APIwidget/logs`

2. **Health Checks**: The application performs periodic health checks and reports issues in the logs.

3. **Usage Analytics**: If enabled, the application collects anonymous usage data to help improve the application.

### External Monitoring

For production deployments, it's recommended to use external monitoring tools:

1. **Log Aggregation**: Use tools like ELK Stack, Graylog, or Splunk to aggregate and analyze logs.

2. **Performance Monitoring**: Use tools like New Relic, Datadog, or Prometheus to monitor application performance.

3. **Uptime Monitoring**: Use tools like Uptime Robot, Pingdom, or StatusCake to monitor application uptime.

## Maintenance

### Routine Maintenance

1. **Log Rotation**: Configure log rotation to prevent logs from consuming too much disk space.

2. **Database Maintenance**: Perform regular database maintenance tasks:
   - Vacuum the database to reclaim space
   - Analyze tables to update statistics
   - Check for and fix database corruption

3. **Backup**: Perform regular backups of the application data and database.

### Scheduled Maintenance

1. **Updates**: Schedule regular updates to keep the application up-to-date with the latest features and security patches.

2. **Security Scans**: Schedule regular security scans to identify and address vulnerabilities.

3. **Performance Tuning**: Schedule regular performance tuning to ensure the application runs optimally.

## Troubleshooting

### Common Issues

1. **Application Won't Start**:
   - Check if the application is already running
   - Check if the required ports are available
   - Check if the database is accessible
   - Check the application logs for errors

2. **API Integration Issues**:
   - Check if the API keys are valid
   - Check if the API provider is accessible
   - Check if the API rate limits have been exceeded
   - Check the application logs for API-related errors

3. **Performance Issues**:
   - Check if the system meets the minimum requirements
   - Check if there are other resource-intensive applications running
   - Check if the database is properly indexed
   - Check if the application is configured for optimal performance

### Diagnostic Tools

1. **Log Analysis**: Use the application logs to diagnose issues.

2. **Database Queries**: Use database queries to diagnose data-related issues.

3. **Network Tools**: Use network tools like ping, traceroute, and netstat to diagnose network-related issues.

4. **Process Monitoring**: Use process monitoring tools like Task Manager (Windows), Activity Monitor (macOS), or htop (Linux) to diagnose resource-related issues.

## Scaling

### Vertical Scaling

To improve performance through vertical scaling:

1. **Increase Hardware Resources**: Add more CPU, RAM, or disk space to the server.

2. **Optimize Configuration**: Adjust configuration parameters for better performance.

3. **Use Caching**: Implement caching to reduce database and API load.

### Horizontal Scaling

For multi-user deployments, horizontal scaling can be achieved through:

1. **Load Balancing**: Distribute traffic across multiple application instances.

2. **Database Replication**: Replicate the database for read scalability.

3. **Microservices**: Split the application into microservices for independent scaling.

## Security

### Authentication and Authorization

1. **User Authentication**: APIwidget uses Supabase for user authentication.

2. **Role-Based Access Control**: Users can be assigned different roles with different permissions.

3. **API Key Security**: API keys are stored securely using encryption.

### Data Security

1. **Encryption**: Sensitive data is encrypted at rest and in transit.

2. **Data Isolation**: User data is isolated using Row Level Security in the database.

3. **Data Retention**: Data is retained according to the configured retention policy.

### Network Security

1. **HTTPS**: All communication is encrypted using HTTPS.

2. **Firewall**: Configure a firewall to restrict access to the application.

3. **Rate Limiting**: Implement rate limiting to prevent abuse.

## Backup and Recovery

### Backup Strategy

1. **Database Backup**: Regularly backup the Supabase database.

2. **Application Data Backup**: Regularly backup the application data directory.

3. **Configuration Backup**: Regularly backup the configuration files.

### Recovery Procedures

1. **Database Recovery**: Restore the database from a backup.

2. **Application Data Recovery**: Restore the application data from a backup.

3. **Configuration Recovery**: Restore the configuration files from a backup.

For detailed backup and recovery procedures, see [BACKUP_RECOVERY_PLAN.md](./BACKUP_RECOVERY_PLAN.md).

## Upgrades

### Upgrade Process

1. **Backup**: Before upgrading, backup the database and application data.

2. **Download**: Download the new version from the [releases page](https://github.com/ImaginariumLabs/APIwidget/releases).

3. **Install**: Run the installer and follow the on-screen instructions.

4. **Verify**: Verify that the application is working correctly after the upgrade.

### Rollback Procedures

If the upgrade fails or causes issues:

1. **Uninstall**: Uninstall the new version.

2. **Reinstall**: Reinstall the previous version.

3. **Restore**: Restore the database and application data from the backup.

## References

- [Deployment Guide](../development/DEPLOYMENT_GUIDE.md)
- [API Monitoring Guide](./API_MONITORING_GUIDE.md)
- [Backup and Recovery Plan](./BACKUP_RECOVERY_PLAN.md)
- [Security Protocols](./SECURITY_PROTOCOLS.md)
- [Troubleshooting Guide](../user-guides/TROUBLESHOOTING.md)
