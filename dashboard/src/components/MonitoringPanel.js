import React, { useState, useEffect } from 'react';
import './MonitoringPanel.css';

function MonitoringPanel() {
  const [activeMonitors, setActiveMonitors] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Simulate real-time monitoring data
    const mockMonitors = [
      { id: 1, name: 'PancakeSwap Router', status: 'healthy', riskScore: 23 },
      { id: 2, name: 'Venus Protocol', status: 'monitoring', riskScore: 58 },
      { id: 3, name: 'BNB Chain Bridge', status: 'warning', riskScore: 76 },
      { id: 4, name: 'BiSwap DEX', status: 'healthy', riskScore: 31 },
    ];

    const mockAlerts = [
      { 
        id: 1, 
        level: 'warning', 
        message: 'Price oracle volatility detected',
        protocol: 'Venus Protocol',
        time: '2 min ago'
      },
      { 
        id: 2, 
        level: 'high', 
        message: 'Unusual transaction pattern',
        protocol: 'BNB Chain Bridge',
        time: '15 min ago'
      },
    ];

    setActiveMonitors(mockMonitors);
    setAlerts(mockAlerts);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'var(--color-success)';
      case 'monitoring': return 'var(--color-warning)';
      case 'warning': return 'var(--color-danger)';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className="card monitoring-panel">
      <h2 className="card-title">🔍 Live Monitoring</h2>
      <p className="card-description">
        Real-time contract monitoring
      </p>

      <div className="monitoring-status">
        <div className="status-indicator">
          <div className="status-dot active"></div>
          <span>Monitoring {activeMonitors.length} contracts</span>
        </div>
      </div>

      <div className="monitors-list">
        {activeMonitors.map((monitor) => (
          <div key={monitor.id} className="monitor-item">
            <div 
              className="monitor-status-dot"
              style={{ backgroundColor: getStatusColor(monitor.status) }}
            />
            <div className="monitor-info">
              <div className="monitor-name">{monitor.name}</div>
              <div className="monitor-score">
                Risk Score: <span>{monitor.riskScore}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length > 0 && (
        <div className="alerts-section">
          <h3>Recent Alerts</h3>
          {alerts.map((alert) => (
            <div key={alert.id} className={`alert-item alert-${alert.level}`}>
              <div className="alert-header">
                <span className={`badge badge-${alert.level}`}>
                  {alert.level}
                </span>
                <span className="alert-time">{alert.time}</span>
              </div>
              <div className="alert-message">{alert.message}</div>
              <div className="alert-protocol">{alert.protocol}</div>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>
        Add Contract to Monitor
      </button>
    </div>
  );
}

export default MonitoringPanel;
