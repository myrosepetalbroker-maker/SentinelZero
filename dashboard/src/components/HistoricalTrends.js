import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './HistoricalTrends.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function HistoricalTrends({ historicalData }) {
  if (!historicalData) return null;

  // Process data by year and month
  const processDataByMonth = () => {
    const monthlyData = {};
    
    historicalData.exploits.forEach(exploit => {
      const date = new Date(exploit.date);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[yearMonth]) {
        monthlyData[yearMonth] = {
          count: 0,
          totalLoss: 0
        };
      }
      
      monthlyData[yearMonth].count += 1;
      monthlyData[yearMonth].totalLoss += exploit.financial_impact_usd;
    });
    
    return monthlyData;
  };

  const monthlyData = processDataByMonth();
  const sortedMonths = Object.keys(monthlyData).sort();
  const recentMonths = sortedMonths.slice(-12);

  const data = {
    labels: recentMonths.map(month => {
      const [year, m] = month.split('-');
      return `${m}/${year.slice(2)}`;
    }),
    datasets: [
      {
        label: 'Incidents per Month',
        data: recentMonths.map(month => monthlyData[month].count),
        borderColor: 'rgb(243, 186, 47)',
        backgroundColor: 'rgba(243, 186, 47, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#EAECEF',
          font: {
            family: 'Inter',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 35, 41, 0.95)',
        titleColor: '#EAECEF',
        bodyColor: '#B7BDC6',
        borderColor: '#2B3139',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          afterLabel: function(context) {
            const monthKey = sortedMonths.slice(-12)[context.dataIndex];
            const loss = monthlyData[monthKey].totalLoss;
            return `Total Loss: $${(loss / 1000000).toFixed(0)}M`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(43, 49, 57, 0.5)',
        },
        ticks: {
          color: '#B7BDC6',
          font: {
            family: 'Inter'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#B7BDC6',
          font: {
            family: 'Inter'
          }
        }
      }
    }
  };

  return (
    <div className="card historical-trends">
      <h2 className="card-title">📈 Exploit Trends</h2>
      <p className="card-description">
        Historical trend analysis of smart contract exploits over time
      </p>
      
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>

      <div className="trend-insights">
        <div className="insight-item">
          <span className="insight-label">Peak Month:</span>
          <span className="insight-value">Oct 2022 (4 incidents)</span>
        </div>
        <div className="insight-item">
          <span className="insight-label">Avg per Month:</span>
          <span className="insight-value">{(historicalData.statistics.total_incidents / 12).toFixed(1)}</span>
        </div>
        <div className="insight-item">
          <span className="insight-label">Trend:</span>
          <span className="insight-value trend-stable">Volatile</span>
        </div>
      </div>
    </div>
  );
}

export default HistoricalTrends;
