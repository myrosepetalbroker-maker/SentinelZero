import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import RiskScoreCard from './components/RiskScoreCard';
import HistoricalTrends from './components/HistoricalTrends';
import VulnerabilityBreakdown from './components/VulnerabilityBreakdown';
import RecentExploits from './components/RecentExploits';
import MonitoringPanel from './components/MonitoringPanel';
import { loadHistoricalData, loadTaxonomy } from './services/dataService';

function App() {
  const [historicalData, setHistoricalData] = useState(null);
  const [taxonomy, setTaxonomy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [exploits, taxData] = await Promise.all([
          loadHistoricalData(),
          loadTaxonomy()
        ]);
        setHistoricalData(exploits);
        setTaxonomy(taxData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading SentinelZero Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      
      <main className="container">
        <section className="hero-section">
          <h1>🚨 SentinelZero</h1>
          <p className="subtitle">
            Continuous Risk Analysis for Smart Contracts on BNB Chain
          </p>
        </section>

        <StatsOverview historicalData={historicalData} />

        <div className="dashboard-grid">
          <div className="main-content">
            <RiskScoreCard />
            <HistoricalTrends historicalData={historicalData} />
            <VulnerabilityBreakdown taxonomy={taxonomy} historicalData={historicalData} />
          </div>
          
          <aside className="sidebar">
            <MonitoringPanel />
            <RecentExploits historicalData={historicalData} />
          </aside>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2026 SentinelZero - Building trust in BNB Chain, one contract at a time.</p>
          <div className="footer-links">
            <a href="https://github.com/LCMF2022/SentinelZero" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://rekt.news" target="_blank" rel="noopener noreferrer">
              Rekt News
            </a>
            <a href="https://halborn.com/blog" target="_blank" rel="noopener noreferrer">
              Halborn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
