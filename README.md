# 🚨 SentinelZero — Continuous Risk Analysis for Smart Contracts on BNB Chain

[![BNB Chain Builder Grant](https://img.shields.io/badge/BNB-Chain%20Grant-blue?logo=binance)](https://www.bnbchain.org/fr-FR/grants)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](https://www.apache.org/licenses/LICENSE-2.0)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

---

## 🎯 Overview
**SentinelZero** is a **proactive, continuous risk analysis platform** for smart contracts and DeFi protocols on BNB Chain.  
It aggregates **historical exploits**, applies a **standardized risk taxonomy**, and generates **dynamic risk scores**, helping developers, auditors, and investors **prevent exploits before they occur**.

> “Building trust in BNB Chain, one contract at a time.”

**Key Areas:**  
- **Primary:** Yield Discovery & Risk Analytics  
- **Secondary:** Web3 Developer Tooling  

---

## ⚡ Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| 📚 Historical Exploit Database | 23+ documented real-world incidents with $3.9B+ in losses | ✅ Implemented |
| 🧭 Risk Taxonomy | 10 vulnerability categories with severity weights | ✅ Implemented |
| ⚖️ Dynamic Risk Scoring | Versioned scoring algorithms (v1.0, v1.1) | ✅ Implemented |
| 🖥️ MVP Dashboard | React + Chart.js interactive visualizations | ✅ Implemented |
| 🔍 Real-time Monitoring | Live contract tracking and alerts | ✅ Implemented |
| 🌐 Open Source | Apache 2.0 licensed, encouraging collaboration | ✅ Active |

---

## 🔗 Architecture Overview
    A[📥 Public Exploit Data] --> B[🧹 Data Ingestion & Cleaning]
    B --> C[🗂️ Risk Taxonomy Classification]
    C --> D[⚖️ Dynamic Risk Scoring Engine]
    D --> E[🖥️ Dashboard & Alerts]
    D --> F[📄 Whitepaper & Documentation]
.

🛑 Problem Statement

Even audited smart contracts remain vulnerable to repeated exploits.
Smaller projects often lack resources for continuous monitoring, leaving protocols on BNB Chain exposed to attacks and financial losses.

SentinelZero addresses this gap with a data-driven, automated approach to identify risks and reduce potential exploits.

🗓️ Roadmap (6 Months)
Phase	Duration	Deliverables
Phase 1	6–8 weeks	Historical exploit database
Phase 2	8–12 weeks	Taxonomy & initial scoring
Phase 3	12–16 weeks	MVP dashboard
Phase 4	4–6 weeks	Whitepaper & open-source documentation
💡 Expected Impact

✅ Improved visibility of smart contract risks

✅ Reduced likelihood of post-audit exploits

✅ Provides actionable insights to developers and investors

✅ Encourages best practices across the BNB Chain ecosystem

💰 Budget Estimate (USD)
Phase	Cost
Phase 1	$15,000
Phase 2	$30,000
Phase 3	$45,000
Phase 4	$20,000
Total: $110,000	

## 🏗️ Project Structure

```
SentinelZero/
├── data/
│   └── historical_exploits.json    # 23 real-world DeFi exploits database
├── src/
│   ├── taxonomy/
│   │   ├── risk_taxonomy.json      # 10 risk categories with severity weights
│   │   └── risk_utils.js           # Risk calculation utilities
│   └── scoring/
│       └── scoring_engine.js       # Versioned scoring algorithms
├── dashboard/                       # React MVP Dashboard
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── services/               # Data services
│   │   └── styles/                 # CSS styling
│   └── package.json
└── docs/
    └── risk_taxonomy.md            # Comprehensive taxonomy documentation
```

## 🚀 Quick Start

### Dashboard

```bash
cd dashboard
npm install
npm start
```

The dashboard will be available at `http://localhost:3000`

### Risk Scoring (Node.js)

```javascript
const { calculateRiskScore } = require('./src/taxonomy/risk_utils');

const contractData = {
  vulnerabilities: ['reentrancy', 'price_oracle_manipulation'],
  tvl: 50000000,
  isAudited: true,
  auditAge: 120,
  complexity: 7,
  daysInProduction: 45,
  hasBugBounty: true
};

const riskAssessment = calculateRiskScore(contractData);
console.log(`Risk Score: ${riskAssessment.score} (${riskAssessment.level})`);
```

## 📊 Risk Taxonomy

SentinelZero uses a comprehensive taxonomy covering 10 major vulnerability categories:

1. **Reentrancy Attacks** (Severity: 0.95) - e.g., Curve Finance, Rari Capital
2. **Price Oracle Manipulation** (Severity: 0.90) - e.g., Cream Finance, Mango Markets
3. **Logic Errors** (Severity: 0.85) - e.g., Poly Network, Euler Finance
4. **Governance Exploits** (Severity: 0.88) - e.g., Beanstalk, Ronin Network
5. **Cryptographic Vulnerabilities** (Severity: 0.92) - e.g., BNB Chain Bridge
6. **Cross-Chain Bridge** (Severity: 0.93) - e.g., Wormhole, Nomad Bridge
7. **Infrastructure/Frontend** (Severity: 0.75) - e.g., BadgerDAO
8. **MEV & Front-running** (Severity: 0.70)
9. **Access Control** (Severity: 0.87)
10. **Flash Loan Attacks** (Severity: 0.82) - e.g., Beanstalk, Platypus

See [docs/risk_taxonomy.md](docs/risk_taxonomy.md) for detailed documentation.

## 📈 Historical Database

The database includes 23 major exploits totaling **$3.9B+ in losses**:

- **Ronin Network**: $625M (March 2022)
- **Poly Network**: $611M (August 2021)
- **BNB Chain Bridge**: $586M (October 2022)
- **Wormhole**: $325M (February 2022)
- **Euler Finance**: $197M (March 2023, funds recovered)

Each entry includes protocol name, attack type, date, financial impact, and references to verified sources.

## 🖼️ Dashboard Preview

<img width="1536" height="1024" alt="A_2D_digital_illustration_showcases_the_SentinelZe" src="https://github.com/user-attachments/assets/45abfd33-ee8c-48ea-b596-c80bc2f7fec2" />

The MVP dashboard features:
- **Risk Score Calculator**: Analyze contracts with comprehensive breakdowns
- **Historical Trends**: Line charts showing exploit patterns over time
- **Vulnerability Distribution**: Doughnut charts of attack vectors
- **Live Monitoring**: Real-time tracking of multiple contracts
- **Recent Exploits**: Latest documented incidents

🤝 Collaboration & Contribution

We welcome developers, auditors, and researchers to collaborate:

Submit bug reports or security incidents

Propose new taxonomy entries

Suggest dashboard features and UI improvements

Repository: https://github.com/LCMF2022/SentinelZero

📜 License

This project is open-source under the Apache 2.0 license.

🔗 References

Rekt News

Halborn Top 100 DeFi Hacks

PeckShield & CertiK blogs

Frontal Blockchain Timeline


