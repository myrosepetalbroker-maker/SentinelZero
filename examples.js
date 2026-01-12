/**
 * SentinelZero Usage Examples
 * 
 * This file demonstrates various usage patterns for the SentinelZero platform.
 */

const { analyzeContract, fetchProtocolTVL } = require('./src/api/integration');
const { calculateRiskScore, getMitigationStrategies } = require('./src/taxonomy/risk_utils');
const { scoreContract, ScoringPipeline, batchScoreContracts } = require('./src/scoring/scoring_engine');

// ============================================================================
// Example 1: Basic Risk Assessment
// ============================================================================

async function basicRiskAssessment() {
  console.log('=== Example 1: Basic Risk Assessment ===\n');
  
  const contractData = {
    vulnerabilities: ['reentrancy', 'price_oracle_manipulation'],
    tvl: 50000000, // $50M
    isAudited: true,
    auditAge: 120, // 4 months old
    complexity: 7,
    daysInProduction: 45,
    hasBugBounty: true
  };
  
  const riskScore = calculateRiskScore(contractData);
  
  console.log(`Risk Score: ${riskScore.score}/100`);
  console.log(`Risk Level: ${riskScore.level.toUpperCase()}`);
  console.log(`Action Required: ${riskScore.action_required}`);
  console.log('\nRisk Breakdown:');
  Object.entries(riskScore.breakdown).forEach(([factor, score]) => {
    console.log(`  ${factor}: ${score}%`);
  });
  
  // Get mitigation strategies
  const mitigations = getMitigationStrategies(contractData.vulnerabilities);
  console.log('\nRecommended Mitigations:');
  mitigations.forEach(m => {
    console.log(`\n${m.vulnerability}:`);
    m.strategies.forEach(s => console.log(`  - ${s}`));
  });
}

// ============================================================================
// Example 2: Contract Analysis via API
// ============================================================================

async function contractAnalysisExample() {
  console.log('\n=== Example 2: Contract Analysis via API ===\n');
  
  // PancakeSwap Router V2 address
  const contractAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
  
  try {
    const analysis = await analyzeContract(contractAddress, 'pancakeswap');
    
    console.log(`Contract: ${analysis.contractName}`);
    console.log(`Address: ${analysis.address}`);
    console.log(`Verified: ${analysis.isVerified ? 'Yes' : 'No'}`);
    console.log(`TVL: $${analysis.tvl.toLocaleString()}`);
    console.log(`Days in Production: ${analysis.daysInProduction}`);
    console.log(`Complexity Score: ${analysis.complexity}/10`);
    
    if (analysis.detectedVulnerabilities.length > 0) {
      console.log('\nDetected Vulnerability Indicators:');
      analysis.detectedVulnerabilities.forEach(v => console.log(`  - ${v}`));
    }
    
    // Calculate risk score from analysis
    const riskScore = calculateRiskScore(analysis);
    console.log(`\nRisk Score: ${riskScore.score} (${riskScore.level})`);
    
  } catch (error) {
    console.error('Error analyzing contract:', error.message);
  }
}

// ============================================================================
// Example 3: Versioned Scoring
// ============================================================================

async function versionedScoringExample() {
  console.log('\n=== Example 3: Versioned Scoring ===\n');
  
  const contractData = {
    vulnerabilities: ['cross_chain_bridge', 'governance_exploit'],
    tvl: 200000000,
    isAudited: true,
    auditAge: 90,
    complexity: 8,
    daysInProduction: 180,
    hasBugBounty: true,
    protocolType: 'bridge' // Important for v1.1.0
  };
  
  // Score with v1.0.0
  const scoreV1 = scoreContract(contractData, 'v1.0.0');
  console.log(`v1.0.0 Score: ${scoreV1.score}`);
  
  // Score with v1.1.0 (includes trend analysis)
  const scoreV1_1 = scoreContract(contractData, 'v1.1.0');
  console.log(`v1.1.0 Score: ${scoreV1_1.score}`);
  console.log(`Trend Modifier: ${scoreV1_1.trendModifier.toFixed(2)}x`);
  console.log(`Risk Trend: ${scoreV1_1.historicalContext.riskTrend}`);
  
  if (scoreV1_1.historicalContext.recommendations.length > 0) {
    console.log('\nRecommendations:');
    scoreV1_1.historicalContext.recommendations.forEach(r => {
      console.log(`  - ${r}`);
    });
  }
}

// ============================================================================
// Example 4: Batch Scoring
// ============================================================================

async function batchScoringExample() {
  console.log('\n=== Example 4: Batch Scoring ===\n');
  
  const contracts = [
    {
      address: '0xContract1',
      name: 'DEX Protocol',
      vulnerabilities: ['mev_frontrunning'],
      tvl: 10000000,
      isAudited: true,
      auditAge: 60,
      complexity: 5,
      daysInProduction: 120,
      hasBugBounty: false
    },
    {
      address: '0xContract2',
      name: 'Lending Protocol',
      vulnerabilities: ['price_oracle_manipulation', 'flash_loan_attack'],
      tvl: 75000000,
      isAudited: true,
      auditAge: 180,
      complexity: 8,
      daysInProduction: 365,
      hasBugBounty: true
    },
    {
      address: '0xContract3',
      name: 'Bridge Contract',
      vulnerabilities: ['cross_chain_bridge', 'access_control'],
      tvl: 150000000,
      isAudited: false,
      auditAge: 999,
      complexity: 9,
      daysInProduction: 30,
      hasBugBounty: false
    }
  ];
  
  const results = batchScoreContracts(contracts, 'v1.1.0');
  
  console.log('Batch Scoring Results:\n');
  results.forEach(result => {
    console.log(`${result.name}:`);
    console.log(`  Score: ${result.score.score} (${result.score.level})`);
    console.log(`  Action: ${result.score.action_required}`);
    console.log('');
  });
}

// ============================================================================
// Example 5: Real-time Monitoring Pipeline
// ============================================================================

async function monitoringPipelineExample() {
  console.log('\n=== Example 5: Real-time Monitoring Pipeline ===\n');
  
  const pipeline = new ScoringPipeline('v1.1.0');
  
  const contracts = [
    {
      address: '0xHighRisk',
      vulnerabilities: ['reentrancy', 'price_oracle_manipulation', 'governance_exploit'],
      tvl: 100000000,
      isAudited: false,
      auditAge: 999,
      complexity: 9,
      daysInProduction: 15,
      hasBugBounty: false
    },
    {
      address: '0xMediumRisk',
      vulnerabilities: ['flash_loan_attack'],
      tvl: 25000000,
      isAudited: true,
      auditAge: 90,
      complexity: 6,
      daysInProduction: 180,
      hasBugBounty: true
    }
  ];
  
  console.log('Processing contracts through monitoring pipeline...\n');
  
  for (const contract of contracts) {
    const result = await pipeline.processContract(contract.address, contract);
    
    console.log(`Contract: ${contract.address}`);
    console.log(`  Score: ${result.score.score}`);
    console.log(`  Level: ${result.score.level}`);
    console.log(`  Trend: ${result.trend}`);
    
    if (result.alerts.length > 0) {
      console.log('  Alerts:');
      result.alerts.forEach(alert => {
        console.log(`    [${alert.level.toUpperCase()}] ${alert.message}`);
      });
    }
    console.log('');
  }
}

// ============================================================================
// Example 6: Historical Data Analysis
// ============================================================================

function historicalDataAnalysis() {
  console.log('\n=== Example 6: Historical Data Analysis ===\n');
  
  const fs = require('fs');
  const path = require('path');
  
  const dataPath = path.join(__dirname, 'data', 'historical_exploits.json');
  const historicalData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  console.log(`Total Incidents: ${historicalData.statistics.total_incidents}`);
  console.log(`Total Losses: $${(historicalData.statistics.total_financial_impact_usd / 1000000000).toFixed(2)}B`);
  console.log(`Recovery Rate: ${((historicalData.statistics.incidents_with_recovery / historicalData.statistics.total_incidents) * 100).toFixed(1)}%`);
  
  // Find largest exploit
  const largestExploit = historicalData.exploits.reduce((max, exploit) => 
    exploit.financial_impact_usd > max.financial_impact_usd ? exploit : max
  );
  
  console.log('\nLargest Exploit:');
  console.log(`  Protocol: ${largestExploit.protocol_name}`);
  console.log(`  Loss: $${(largestExploit.financial_impact_usd / 1000000).toFixed(0)}M`);
  console.log(`  Date: ${largestExploit.date}`);
  console.log(`  Type: ${largestExploit.attack_type}`);
  
  // Count by vulnerability type
  const vulnCounts = {};
  historicalData.exploits.forEach(exploit => {
    const category = exploit.vulnerability_category;
    vulnCounts[category] = (vulnCounts[category] || 0) + 1;
  });
  
  console.log('\nVulnerabilities by Frequency:');
  Object.entries(vulnCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} incidents`);
    });
}

// ============================================================================
// Run All Examples
// ============================================================================

async function runAllExamples() {
  try {
    await basicRiskAssessment();
    // Uncomment to run API-dependent examples (requires API keys)
    // await contractAnalysisExample();
    await versionedScoringExample();
    await batchScoringExample();
    await monitoringPipelineExample();
    historicalDataAnalysis();
    
    console.log('\n=== All Examples Completed ===\n');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}

module.exports = {
  basicRiskAssessment,
  contractAnalysisExample,
  versionedScoringExample,
  batchScoringExample,
  monitoringPipelineExample,
  historicalDataAnalysis
};
