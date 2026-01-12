/**
 * Data Service
 * 
 * Handles loading and caching of historical data and taxonomy
 */

// In a real application, these would be API calls
// For the MVP, we'll load from local JSON files

export const loadHistoricalData = async () => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, this would fetch from an API
    // For now, we'll return mock data that matches our schema
    const response = await fetch('/data/historical_exploits.json');
    if (!response.ok) {
      // Fallback to mock data if file not found
      return getMockHistoricalData();
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading historical data:', error);
    return getMockHistoricalData();
  }
};

export const loadTaxonomy = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = await fetch('/src/taxonomy/risk_taxonomy.json');
    if (!response.ok) {
      return getMockTaxonomy();
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading taxonomy:', error);
    return getMockTaxonomy();
  }
};

// Mock data for development/fallback
const getMockHistoricalData = () => ({
  schema_version: "1.0.0",
  last_updated: "2026-01-12",
  exploits: [
    {
      id: "EXP-001",
      protocol_name: "Poly Network",
      chain: "Multi-chain",
      date: "2021-08-10",
      attack_type: "Cross-chain Bridge Exploit",
      vulnerability_category: "Logic Error",
      financial_impact_usd: 611000000,
      funds_recovered: true
    },
    {
      id: "EXP-002",
      protocol_name: "Cream Finance",
      chain: "Ethereum",
      date: "2021-10-27",
      attack_type: "Flash Loan Attack",
      vulnerability_category: "Price Oracle Manipulation",
      financial_impact_usd: 130000000,
      funds_recovered: false
    },
    {
      id: "EXP-003",
      protocol_name: "Ronin Network",
      chain: "Ronin",
      date: "2022-03-23",
      attack_type: "Private Key Compromise",
      vulnerability_category: "Governance/Access Control",
      financial_impact_usd: 625000000,
      funds_recovered: false
    },
    {
      id: "EXP-004",
      protocol_name: "Wormhole",
      chain: "Solana/Ethereum",
      date: "2022-02-02",
      attack_type: "Signature Verification Bypass",
      vulnerability_category: "Logic Error",
      financial_impact_usd: 325000000,
      funds_recovered: false
    },
    {
      id: "EXP-005",
      protocol_name: "Euler Finance",
      chain: "Ethereum",
      date: "2023-03-13",
      attack_type: "Donation Attack",
      vulnerability_category: "Logic Error",
      financial_impact_usd: 197000000,
      funds_recovered: true
    }
  ],
  statistics: {
    total_incidents: 23,
    total_financial_impact_usd: 3879000000,
    incidents_with_recovery: 5,
    most_common_vulnerability: "Logic Error",
    most_targeted_chain: "Ethereum"
  }
});

const getMockTaxonomy = () => ({
  version: "1.0.0",
  risk_categories: {
    reentrancy: { id: "RISK-001", name: "Reentrancy Attacks", severity_weight: 0.95 },
    price_oracle_manipulation: { id: "RISK-002", name: "Price Oracle Manipulation", severity_weight: 0.90 },
    logic_error: { id: "RISK-003", name: "Smart Contract Logic Errors", severity_weight: 0.85 }
  }
});

export const calculateRiskScore = (contractData) => {
  // Mock risk score calculation
  // In production, this would call the backend API
  return {
    score: Math.floor(Math.random() * 100),
    level: 'medium',
    breakdown: {
      vulnerability: 30,
      tvl: 20,
      audit: 15,
      complexity: 10,
      production: 3,
      bugBounty: 2
    }
  };
};

export const monitorContract = async (contractAddress) => {
  // Mock contract monitoring
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    message: 'Contract added to monitoring',
    contractAddress
  };
};
