# Risk Taxonomy Framework

## Overview

The SentinelZero Risk Taxonomy Framework provides a standardized approach to classifying and scoring smart contract vulnerabilities. This framework is based on analysis of 20+ historical DeFi exploits and current security best practices.

## Risk Categories

### 1. Reentrancy Attacks (RISK-001)
**Severity Weight:** 0.95 (Critical)

Reentrancy occurs when external calls can re-enter a contract before state updates are complete, allowing attackers to drain funds.

**Indicators:**
- External calls before state updates
- Missing reentrancy guards
- Unprotected callback functions

**Mitigation Strategies:**
- Use ReentrancyGuard from OpenZeppelin
- Follow Checks-Effects-Interactions pattern
- Use pull payment patterns

**Historical Examples:** Curve Finance Vyper (EXP-011), Rari Capital (EXP-020)

### 2. Price Oracle Manipulation (RISK-002)
**Severity Weight:** 0.90 (Critical)

Exploitation of price feeds through flash loans or low-liquidity markets to manipulate protocol behavior.

**Indicators:**
- Single source price oracle
- No TWAP or time-weighted mechanisms
- Low liquidity dependency
- Flash loan vulnerability

**Mitigation Strategies:**
- Use Chainlink or multiple oracle sources
- Implement TWAP with adequate time windows
- Add price deviation checks
- Use flash loan resistant oracles

**Historical Examples:** Cream Finance (EXP-002), Mango Markets (EXP-010), Deus Finance (EXP-014), Nirvana Finance (EXP-019)

### 3. Smart Contract Logic Errors (RISK-003)
**Severity Weight:** 0.85 (High)

Flaws in business logic implementation that allow unintended behaviors.

**Indicators:**
- Missing input validation
- Incorrect state transitions
- Math calculation errors
- Unchecked return values

**Mitigation Strategies:**
- Comprehensive unit testing
- Formal verification
- Multiple security audits
- Gradual rollout with monitoring

**Historical Examples:** Poly Network (EXP-001), Wormhole (EXP-004), Nomad Bridge (EXP-005), Euler Finance (EXP-008)

### 4. Governance Exploits (RISK-004)
**Severity Weight:** 0.88 (Critical)

Attacks on governance mechanisms including flash loan voting and key compromises.

**Indicators:**
- Insufficient voting delays
- No quorum requirements
- Centralized multisig with low threshold
- Flash loan enabled governance tokens

**Mitigation Strategies:**
- Implement time-locks on governance actions
- Require token vesting for voting power
- Use vote-escrowed tokens
- Multi-signature with high threshold

**Historical Examples:** Ronin Network (EXP-003), Beanstalk (EXP-006), Harmony Bridge (EXP-007)

### 5. Cryptographic Vulnerabilities (RISK-005)
**Severity Weight:** 0.92 (Critical)

Weaknesses in cryptographic implementations, signature verification, or key management.

**Indicators:**
- Weak signature validation
- Missing nonce checks
- Predictable randomness
- Inadequate key generation

**Mitigation Strategies:**
- Use battle-tested cryptographic libraries
- Implement proper nonce mechanisms
- Use hardware security modules for key storage
- Regular key rotation policies

**Historical Examples:** BNB Chain Bridge (EXP-009), Wintermute (EXP-012), Nerve Bridge (EXP-021)

### 6. Cross-Chain Bridge Vulnerabilities (RISK-006)
**Severity Weight:** 0.93 (Critical)

Exploits targeting bridge contracts and cross-chain communication.

**Indicators:**
- Insufficient validator diversity
- Weak message verification
- Missing replay protection
- Centralized bridge design

**Mitigation Strategies:**
- Implement robust multi-signature schemes
- Add message hash verification
- Use optimistic verification with fraud proofs
- Distribute validator control

**Historical Examples:** Multiple major bridge hacks including Poly Network, Ronin, Wormhole

### 7. Infrastructure & Front-end Compromises (RISK-007)
**Severity Weight:** 0.75 (High)

Attacks on web infrastructure, DNS, or front-end applications.

**Indicators:**
- Centralized front-end hosting
- Missing content integrity checks
- No DNS security extensions
- Lack of CSP headers

**Mitigation Strategies:**
- Use IPFS or decentralized hosting
- Implement Subresource Integrity (SRI)
- Enable DNSSEC
- Add Content Security Policy headers

**Historical Examples:** BadgerDAO (EXP-016)

### 8. MEV & Front-running (RISK-008)
**Severity Weight:** 0.70 (Medium-High)

Maximal Extractable Value attacks and transaction ordering manipulation.

**Indicators:**
- Public transaction mempool exposure
- Predictable transaction ordering
- No slippage protection
- Lack of private transaction options

**Mitigation Strategies:**
- Use Flashbots or private mempools
- Implement commit-reveal schemes
- Add slippage protection
- Use batch auctions

### 9. Access Control Failures (RISK-009)
**Severity Weight:** 0.87 (High)

Insufficient or misconfigured access controls allowing unauthorized actions.

**Indicators:**
- Missing access modifiers
- Incorrect role assignments
- Unprotected initialization
- Missing ownership checks

**Mitigation Strategies:**
- Use OpenZeppelin AccessControl
- Implement proper role hierarchies
- Add initialization protection
- Regular access control audits

### 10. Flash Loan Attacks (RISK-010)
**Severity Weight:** 0.82 (High)

Exploitation using uncollateralized flash loans to manipulate protocol state.

**Indicators:**
- Single transaction state dependency
- Inadequate price slippage checks
- Unprotected liquidation mechanisms
- Governance tokens without time-locks

**Mitigation Strategies:**
- Implement multi-block TWAP oracles
- Add transaction origin checks where appropriate
- Use time-weighted governance
- Implement rate limiting

**Historical Examples:** Cream Finance (EXP-002), Beanstalk (EXP-006)

## Severity Levels

| Level | Score Range | Description | Action Required |
|-------|-------------|-------------|-----------------|
| **Critical** | 90-100 | Immediate threat with high probability of significant financial loss | Immediate pause and remediation required |
| **High** | 75-89 | Serious vulnerability requiring urgent attention | Urgent review and fix within 24-48 hours |
| **Medium** | 50-74 | Moderate risk requiring scheduled remediation | Plan fix in next development cycle |
| **Low** | 25-49 | Minor issues with limited impact | Address in regular maintenance |
| **Informational** | 0-24 | Best practice recommendations | Consider for future improvements |

## Scoring Methodology

The risk score is calculated using a weighted combination of multiple factors:

### Scoring Factors

1. **Vulnerability Presence (40%)**: Base score from identified vulnerability categories
2. **TVL Exposure (25%)**: Total Value Locked in the protocol
3. **Audit Status (15%)**: Quality and recency of security audits
4. **Code Complexity (10%)**: Code complexity and external dependencies
5. **Time in Production (5%)**: Length of time deployed without incidents
6. **Bug Bounty (5%)**: Presence and quality of bug bounty program

### Calculation Example

```javascript
const contractData = {
  vulnerabilities: ['reentrancy', 'price_oracle_manipulation'],
  tvl: 50000000, // $50M
  isAudited: true,
  auditAge: 120, // days
  complexity: 7, // out of 10
  daysInProduction: 45,
  hasBugBounty: true
};

const riskAssessment = calculateRiskScore(contractData);
// Returns: { score: 78, level: 'high', ... }
```

## Usage in Dynamic Scoring Pipelines

The taxonomy can be integrated into automated scoring pipelines:

```javascript
const { calculateRiskScore, getMitigationStrategies } = require('./risk_utils');

// Analyze contract
const analysis = analyzeContract(contractAddress);

// Calculate risk score
const riskScore = calculateRiskScore({
  vulnerabilities: analysis.detectedVulnerabilities,
  tvl: await getTVL(contractAddress),
  isAudited: await checkAuditStatus(contractAddress),
  // ... other factors
});

// Get mitigation recommendations
const mitigations = getMitigationStrategies(analysis.detectedVulnerabilities);

console.log(`Risk Score: ${riskScore.score} (${riskScore.level})`);
console.log(`Action Required: ${riskScore.action_required}`);
```

## Integration with Historical Database

The taxonomy references historical exploits stored in `data/historical_exploits.json`. Each risk category includes references to real-world incidents (e.g., EXP-001, EXP-002) that demonstrate the vulnerability in action.

## Continuous Improvement

This taxonomy is designed to evolve as new vulnerability patterns emerge. Regular updates should include:

- New vulnerability categories from emerging attack vectors
- Adjusted severity weights based on incident data
- Updated mitigation strategies reflecting current best practices
- Additional historical examples as new exploits occur

## References

- Rekt News: https://rekt.news
- Halborn DeFi Hacks: https://halborn.com/blog
- CertiK Security Reports: https://www.certik.com
- PeckShield Blog: https://blog.peckshield.com
- Chainalysis Crypto Crime Reports: https://www.chainalysis.com

## Version History

- **v1.0.0** (2026-01-12): Initial release with 10 risk categories and 23 historical exploits
