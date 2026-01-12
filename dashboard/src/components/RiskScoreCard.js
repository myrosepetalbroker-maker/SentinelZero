import React, { useState } from 'react';
import './RiskScoreCard.css';

function RiskScoreCard() {
  const [contractAddress, setContractAddress] = useState('');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock risk score calculation
  const calculateScore = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockScore = {
        score: 72,
        level: 'medium',
        color: '#FFD700',
        action_required: 'Plan fix in next development cycle',
        breakdown: {
          vulnerability: 28,
          tvl: 20,
          audit: 12,
          complexity: 8,
          production: 3,
          bugBounty: 1
        }
      };
      setScore(mockScore);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="card risk-score-card">
      <h2 className="card-title">Risk Score Calculator</h2>
      <p className="card-description">
        Analyze smart contract risk using our comprehensive scoring algorithm
      </p>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter contract address (0x...)"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="contract-input"
        />
        <button 
          onClick={calculateScore}
          disabled={!contractAddress || loading}
          className="btn btn-primary"
        >
          {loading ? 'Analyzing...' : 'Calculate Risk'}
        </button>
      </div>

      {score && (
        <div className="score-result">
          <div className="score-display">
            <div 
              className="score-circle"
              style={{ borderColor: score.color }}
            >
              <span className="score-number">{score.score}</span>
              <span className="score-max">/100</span>
            </div>
            <div className="score-info">
              <span className={`badge badge-${score.level}`}>
                {score.level.toUpperCase()}
              </span>
              <p className="score-action">{score.action_required}</p>
            </div>
          </div>

          <div className="score-breakdown">
            <h3>Risk Breakdown</h3>
            <div className="breakdown-bars">
              {Object.entries(score.breakdown).map(([key, value]) => (
                <div key={key} className="breakdown-item">
                  <div className="breakdown-label">
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill"
                      style={{ 
                        width: `${value}%`,
                        backgroundColor: score.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiskScoreCard;
