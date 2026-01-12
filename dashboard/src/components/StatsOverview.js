import React from 'react';
import './StatsOverview.css';

function StatsOverview({ historicalData }) {
  if (!historicalData) return null;

  const stats = historicalData.statistics;
  const totalRecovered = historicalData.exploits.filter(e => e.funds_recovered).length;
  
  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(2)}B`;
    }
    return `$${(amount / 1000000).toFixed(0)}M`;
  };

  return (
    <div className="stats-overview">
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <div className="stat-label">Total Incidents</div>
          <div className="stat-value">{stats.total_incidents}</div>
          <div className="stat-change">+2 this month</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <div className="stat-label">Total Losses</div>
          <div className="stat-value">{formatCurrency(stats.total_financial_impact_usd)}</div>
          <div className="stat-change negative">Across all chains</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🔄</div>
        <div className="stat-content">
          <div className="stat-label">Funds Recovered</div>
          <div className="stat-value">{totalRecovered}/{stats.total_incidents}</div>
          <div className="stat-change positive">{((totalRecovered/stats.total_incidents)*100).toFixed(0)}% recovery rate</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⚠️</div>
        <div className="stat-content">
          <div className="stat-label">Most Common</div>
          <div className="stat-value">{stats.most_common_vulnerability}</div>
          <div className="stat-change">Primary threat vector</div>
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;
