# SentinelZero API Documentation

## Overview

The SentinelZero platform provides several modules for smart contract risk analysis on BNB Chain. This document outlines the available APIs and how to use them.

## Modules

### 1. Risk Taxonomy (`src/taxonomy/risk_utils.js`)

Core module for risk classification and scoring.

#### Functions

##### `calculateRiskScore(contractData)`

Calculate comprehensive risk score for a smart contract.

**Parameters:**
```javascript
{
  vulnerabilities: Array<string>,    // Array of vulnerability category keys
  tvl: number,                       // Total Value Locked in USD
  isAudited: boolean,                // Whether contract has been audited
  auditAge: number,                  // Age of audit in days
  complexity: number,                // Code complexity score (0-10)
  daysInProduction: number,          // Days since deployment
  hasBugBounty: boolean             // Whether bug bounty exists
}
```

**Returns:**
```javascript
{
  score: number,              // Risk score (0-100)
  level: string,              // 'critical', 'high', 'medium', 'low', 'informational'
  color: string,              // Hex color code
  action_required: string,    // Recommended action
  breakdown: {
    vulnerability: number,
    tvl: number,
    audit: number,
    complexity: number,
    production: number,
    bugBounty: number
  }
}
```

**Example:**
```javascript
const { calculateRiskScore } = require('./src/taxonomy/risk_utils');

const result = calculateRiskScore({
  vulnerabilities: ['reentrancy', 'price_oracle_manipulation'],
  tvl: 50000000,
  isAudited: true,
  auditAge: 120,
  complexity: 7,
  daysInProduction: 45,
  hasBugBounty: true
});

console.log(result);
// Output:
// {
//   score: 72,
//   level: 'medium',
//   color: '#FFD700',
//   action_required: 'Plan fix in next development cycle',
//   breakdown: { ... }
// }
```

##### `getVulnerabilityCategory(categoryKey)`

Get information about a specific vulnerability category.

**Example:**
```javascript
const category = getVulnerabilityCategory('reentrancy');
console.log(category.name); // "Reentrancy Attacks"
console.log(category.severity_weight); // 0.95
```

##### `getMitigationStrategies(vulnerabilities)`

Get mitigation strategies for specific vulnerabilities.

**Example:**
```javascript
const strategies = getMitigationStrategies(['reentrancy', 'price_oracle_manipulation']);
// Returns array of mitigation strategies for each vulnerability
```

### 2. Scoring Engine (`src/scoring/scoring_engine.js`)

Versioned scoring algorithms with historical context.

#### Functions

##### `scoreContract(contractData, version)`

Score a contract using a specific algorithm version.

**Parameters:**
- `contractData`: Same as `calculateRiskScore`
- `version`: Algorithm version ('v1.0.0' or 'v1.1.0')

**Example:**
```javascript
const { scoreContract } = require('./src/scoring/scoring_engine');

const score = scoreContract(contractData, 'v1.1.0');
```

##### `batchScoreContracts(contracts, version)`

Score multiple contracts in batch.

**Example:**
```javascript
const contracts = [
  { address: '0x...', name: 'Contract A', ...contractData },
  { address: '0x...', name: 'Contract B', ...contractData }
];

const results = batchScoreContracts(contracts, 'v1.1.0');
```

#### Classes

##### `ScoringPipeline`

Real-time scoring pipeline for continuous monitoring.

**Example:**
```javascript
const { ScoringPipeline } = require('./src/scoring/scoring_engine');

const pipeline = new ScoringPipeline('v1.1.0');

const result = await pipeline.processContract(contractAddress, contractData);
console.log(result.score);
console.log(result.alerts);
console.log(result.trend); // 'increasing', 'decreasing', 'stable'
```

##### `ScoreHistory`

Track scoring history for contracts over time.

**Example:**
```javascript
const { ScoreHistory } = require('./src/scoring/scoring_engine');

const history = new ScoreHistory();
history.addScore(contractAddress, score);

const recentScores = history.getHistory(contractAddress, 10);
const trend = history.getTrend(contractAddress);
```

### 3. API Integration (`src/api/integration.js`)

External API integration for blockchain data.

#### Functions

##### `analyzeContract(contractAddress, protocolSlug)`

Comprehensive contract analysis using external APIs.

**Parameters:**
- `contractAddress`: BNB Chain contract address
- `protocolSlug`: Optional DefiLlama protocol identifier

**Returns:**
```javascript
{
  address: string,
  isVerified: boolean,
  sourceCode: string,
  contractName: string,
  compiler: string,
  tvl: number,
  daysInProduction: number,
  createdAt: Date,
  detectedVulnerabilities: Array<string>,
  isAudited: boolean,
  auditAge: number,
  hasBugBounty: boolean,
  complexity: number
}
```

**Example:**
```javascript
const { analyzeContract } = require('./src/api/integration');

const analysis = await analyzeContract(
  '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  'pancakeswap'
);

console.log(`Contract: ${analysis.contractName}`);
console.log(`TVL: $${analysis.tvl.toLocaleString()}`);
console.log(`Days in production: ${analysis.daysInProduction}`);
```

##### `fetchProtocolTVL(protocolSlug)`

Get Total Value Locked for a protocol from DefiLlama.

**Example:**
```javascript
const tvl = await fetchProtocolTVL('pancakeswap');
console.log(`PancakeSwap TVL: $${tvl.toLocaleString()}`);
```

##### `streamContractEvents(contractAddress, callback)`

Stream real-time events from a contract (WebSocket-based).

**Example:**
```javascript
const stopStream = streamContractEvents(contractAddress, (event) => {
  console.log('New event:', event);
});

// Later, stop streaming
stopStream();
```

##### `batchAnalyze(addresses)`

Analyze multiple contracts in parallel.

**Example:**
```javascript
const addresses = ['0x...', '0x...', '0x...'];
const results = await batchAnalyze(addresses);
```

## Data Formats

### Historical Exploits Database

Location: `data/historical_exploits.json`

**Schema:**
```json
{
  "schema_version": "1.0.0",
  "last_updated": "YYYY-MM-DD",
  "exploits": [
    {
      "id": "EXP-XXX",
      "protocol_name": "string",
      "chain": "string",
      "date": "YYYY-MM-DD",
      "attack_type": "string",
      "vulnerability_category": "string",
      "financial_impact_usd": number,
      "funds_recovered": boolean,
      "description": "string",
      "technical_details": "string",
      "references": ["url1", "url2"]
    }
  ],
  "statistics": {
    "total_incidents": number,
    "total_financial_impact_usd": number,
    "incidents_with_recovery": number,
    "most_common_vulnerability": "string",
    "most_targeted_chain": "string"
  }
}
```

### Risk Taxonomy

Location: `src/taxonomy/risk_taxonomy.json`

**Categories:**
- `reentrancy`: Reentrancy Attacks (0.95)
- `price_oracle_manipulation`: Price Oracle Manipulation (0.90)
- `logic_error`: Smart Contract Logic Errors (0.85)
- `governance_exploit`: Governance Exploits (0.88)
- `cryptographic_vulnerability`: Cryptographic Vulnerabilities (0.92)
- `cross_chain_bridge`: Cross-Chain Bridge Vulnerabilities (0.93)
- `infrastructure_frontend`: Infrastructure & Front-end Compromises (0.75)
- `mev_frontrunning`: MEV & Front-running (0.70)
- `access_control`: Access Control Failures (0.87)
- `flash_loan_attack`: Flash Loan Attacks (0.82)

## Environment Variables

Set these for API integration:

```bash
# BscScan API key (get from https://bscscan.com/apis)
BSCSCAN_API_KEY=your_api_key_here

# Optional: Custom API endpoints
DEFI_LLAMA_URL=https://api.llama.fi
```

## Complete Usage Example

```javascript
const { analyzeContract } = require('./src/api/integration');
const { calculateRiskScore } = require('./src/taxonomy/risk_utils');
const { ScoringPipeline } = require('./src/scoring/scoring_engine');

async function assessContractRisk(contractAddress, protocolSlug) {
  // 1. Analyze contract using external APIs
  const analysis = await analyzeContract(contractAddress, protocolSlug);
  
  console.log(`Analyzing ${analysis.contractName}...`);
  
  // 2. Calculate risk score
  const riskScore = calculateRiskScore({
    vulnerabilities: analysis.detectedVulnerabilities,
    tvl: analysis.tvl,
    isAudited: analysis.isAudited,
    auditAge: analysis.auditAge,
    complexity: analysis.complexity,
    daysInProduction: analysis.daysInProduction,
    hasBugBounty: analysis.hasBugBounty
  });
  
  console.log(`Risk Score: ${riskScore.score} (${riskScore.level})`);
  console.log(`Action Required: ${riskScore.action_required}`);
  
  // 3. Set up continuous monitoring
  const pipeline = new ScoringPipeline('v1.1.0');
  const result = await pipeline.processContract(contractAddress, {
    vulnerabilities: analysis.detectedVulnerabilities,
    tvl: analysis.tvl,
    // ... other parameters
  });
  
  if (result.alerts.length > 0) {
    console.log('Alerts:', result.alerts);
  }
  
  return {
    analysis,
    riskScore,
    monitoring: result
  };
}

// Usage
assessContractRisk('0x10ED43C718714eb63d5aA57B78B54704E256024E', 'pancakeswap')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Rate Limits

- **BscScan API**: 5 requests/second (free tier)
- **DefiLlama API**: No official rate limit, but be respectful

## Error Handling

All functions return promises and handle errors gracefully:

```javascript
try {
  const result = await analyzeContract(address);
  if (!result.success) {
    console.error('Error:', result.error);
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

## Support

For issues or questions:
- GitHub: https://github.com/LCMF2022/SentinelZero
- Documentation: See [docs/risk_taxonomy.md](risk_taxonomy.md)
