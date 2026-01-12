/**
 * Dynamic Scoring Engine for Smart Contract Risk Analysis
 * 
 * This module provides versioned scoring algorithms that can be applied
 * to smart contracts to assess their risk level over time.
 */

const { calculateRiskScore } = require('../taxonomy/risk_utils');

/**
 * Scoring algorithm versions
 */
const SCORING_VERSIONS = {
  'v1.0.0': {
    name: 'Base Risk Scoring',
    description: 'Initial risk scoring algorithm based on static analysis',
    releaseDate: '2026-01-12',
    calculate: calculateRiskScoreV1
  },
  'v1.1.0': {
    name: 'Enhanced Risk Scoring with Historical Data',
    description: 'Incorporates historical exploit patterns and trend analysis',
    releaseDate: '2026-01-12',
    calculate: calculateRiskScoreV1_1
  }
};

/**
 * Version 1.0.0: Base risk scoring
 */
function calculateRiskScoreV1(contractData) {
  return calculateRiskScore(contractData);
}

/**
 * Version 1.1.0: Enhanced scoring with historical context
 */
function calculateRiskScoreV1_1(contractData) {
  const baseScore = calculateRiskScore(contractData);
  
  // Apply historical trend modifiers
  const trendModifier = calculateTrendModifier(contractData);
  const adjustedScore = Math.min(100, Math.round(baseScore.score * trendModifier));
  
  return {
    ...baseScore,
    score: adjustedScore,
    version: 'v1.1.0',
    trendModifier: trendModifier,
    historicalContext: getHistoricalContext(contractData)
  };
}

/**
 * Calculate trend modifier based on recent exploit patterns
 */
function calculateTrendModifier(contractData) {
  const { vulnerabilities = [], protocolType = 'defi' } = contractData;
  
  // Base modifier
  let modifier = 1.0;
  
  // Increase score for vulnerability types that have been recently exploited
  const recentExploitTypes = ['cross_chain_bridge', 'price_oracle_manipulation'];
  const hasRecentlyExploitedVuln = vulnerabilities.some(v => 
    recentExploitTypes.includes(v)
  );
  
  if (hasRecentlyExploitedVuln) {
    modifier *= 1.15; // 15% increase for trending vulnerability types
  }
  
  // Adjust based on protocol type risk profile
  const protocolRiskMultipliers = {
    'bridge': 1.20,
    'lending': 1.10,
    'dex': 1.05,
    'defi': 1.00,
    'nft': 0.90
  };
  
  modifier *= protocolRiskMultipliers[protocolType] || 1.0;
  
  return modifier;
}

/**
 * Get historical context for the contract's risk profile
 */
function getHistoricalContext(contractData) {
  const { vulnerabilities = [] } = contractData;
  
  return {
    similarIncidents: findSimilarIncidents(vulnerabilities),
    riskTrend: assessRiskTrend(vulnerabilities),
    recommendations: generateRecommendations(vulnerabilities)
  };
}

/**
 * Find similar historical incidents from the database
 */
function findSimilarIncidents(vulnerabilities) {
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Load historical exploits data
    const dataPath = path.join(__dirname, '../../data/historical_exploits.json');
    const historicalData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Count incidents for each vulnerability type
    return vulnerabilities.map(vuln => {
      const matchingIncidents = historicalData.exploits.filter(exploit => {
        const category = exploit.vulnerability_category.toLowerCase().replace(/[\s\/]/g, '_');
        return category.includes(vuln.toLowerCase()) || vuln.toLowerCase().includes(category);
      });
      
      const totalLoss = matchingIncidents.reduce((sum, incident) => 
        sum + incident.financial_impact_usd, 0
      );
      
      return {
        vulnerability: vuln,
        incidentCount: matchingIncidents.length,
        totalLoss: `$${(totalLoss / 1000000).toFixed(0)}M`
      };
    });
  } catch (error) {
    // Fallback to placeholder if file not found
    return vulnerabilities.map(vuln => ({
      vulnerability: vuln,
      incidentCount: 0,
      totalLoss: 'N/A'
    }));
  }
}

/**
 * Assess risk trend
 */
function assessRiskTrend(vulnerabilities) {
  if (vulnerabilities.includes('cross_chain_bridge')) {
    return 'increasing';
  } else if (vulnerabilities.includes('mev_frontrunning')) {
    return 'stable';
  }
  return 'decreasing';
}

/**
 * Generate recommendations based on vulnerabilities
 */
function generateRecommendations(vulnerabilities) {
  const recommendations = [];
  
  if (vulnerabilities.includes('reentrancy')) {
    recommendations.push('Implement ReentrancyGuard on all external functions');
    recommendations.push('Follow Checks-Effects-Interactions pattern');
  }
  
  if (vulnerabilities.includes('price_oracle_manipulation')) {
    recommendations.push('Use Chainlink price feeds with multiple sources');
    recommendations.push('Implement TWAP with minimum 30-minute window');
  }
  
  if (vulnerabilities.includes('governance_exploit')) {
    recommendations.push('Add 48-hour timelock to all governance actions');
    recommendations.push('Require token vesting for voting power');
  }
  
  return recommendations;
}

/**
 * Score a contract using specific version
 */
function scoreContract(contractData, version = 'v1.1.0') {
  const scoringVersion = SCORING_VERSIONS[version];
  
  if (!scoringVersion) {
    throw new Error(`Unknown scoring version: ${version}`);
  }
  
  const result = scoringVersion.calculate(contractData);
  
  return {
    ...result,
    scoring_version: version,
    scoring_algorithm: scoringVersion.name,
    timestamp: new Date().toISOString()
  };
}

/**
 * Score multiple contracts in batch
 */
function batchScoreContracts(contracts, version = 'v1.1.0') {
  return contracts.map(contract => ({
    address: contract.address,
    name: contract.name,
    score: scoreContract(contract, version)
  }));
}

/**
 * Track score history for a contract
 */
class ScoreHistory {
  constructor() {
    this.history = [];
  }
  
  addScore(contractAddress, score) {
    this.history.push({
      address: contractAddress,
      score: score,
      timestamp: new Date().toISOString()
    });
  }
  
  getHistory(contractAddress, limit = 10) {
    return this.history
      .filter(entry => entry.address === contractAddress)
      .slice(-limit);
  }
  
  getTrend(contractAddress) {
    const history = this.getHistory(contractAddress, 5);
    if (history.length < 2) return 'insufficient_data';
    
    const recentScore = history[history.length - 1].score.score;
    const oldScore = history[0].score.score;
    
    if (recentScore > oldScore + 10) return 'increasing';
    if (recentScore < oldScore - 10) return 'decreasing';
    return 'stable';
  }
}

/**
 * Real-time scoring pipeline
 */
class ScoringPipeline {
  constructor(version = 'v1.1.0') {
    this.version = version;
    this.scoreHistory = new ScoreHistory();
  }
  
  async processContract(contractAddress, contractData) {
    // Calculate score
    const score = scoreContract(contractData, this.version);
    
    // Store in history
    this.scoreHistory.addScore(contractAddress, score);
    
    // Check for alerts
    const alerts = this.generateAlerts(score);
    
    return {
      address: contractAddress,
      score: score,
      alerts: alerts,
      trend: this.scoreHistory.getTrend(contractAddress)
    };
  }
  
  generateAlerts(score) {
    const alerts = [];
    
    if (score.score >= 90) {
      alerts.push({
        level: 'critical',
        message: 'Critical risk detected - immediate action required'
      });
    } else if (score.score >= 75) {
      alerts.push({
        level: 'high',
        message: 'High risk - urgent review recommended'
      });
    }
    
    if (score.breakdown.vulnerability > 35) {
      alerts.push({
        level: 'warning',
        message: 'Multiple vulnerability categories detected'
      });
    }
    
    return alerts;
  }
}

module.exports = {
  scoreContract,
  batchScoreContracts,
  ScoreHistory,
  ScoringPipeline,
  SCORING_VERSIONS
};
