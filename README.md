# 🚨 SentinelZero — Continuous Risk Analysis for Smart Contracts on BNB Chain

[![BNB Chain Builder Grant](https://img.shields.io/badge/BNB-Chain%20Grant-blue?logo=binance)](https://www.bnbchain.org/fr-FR/grants)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](https://www.apache.org/licenses/LICENSE-2.0)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

---

## 🎯 Overview
**SentinelZero** is a **proactive, continuous risk analysis platform** for smart contracts and DeFi protocols on BNB Chain.  
It aggregates **historical exploits**, applies a **standardized risk taxonomy**, and generates **dynamic risk scores**, helping developers, auditors, and investors **prevent exploits before they occur**.

> "Building trust in BNB Chain, one contract at a time."

**Key Areas:**  
- **Primary:** Yield Discovery & Risk Analytics  
- **Secondary:** Web3 Developer Tooling  

---

## ⚡ Key Features

| Feature | Description |
|---------|-------------|
| 📚 Historical Exploit Database | 30–50 documented incidents classified by risk type |
| 🧭 Risk Taxonomy | Standardized framework for vulnerability classification |
| ⚖️ Dynamic Risk Scoring | Continuous evaluation of contract risk levels |
| 🤖 Auto-Approval System | Automated approval workflow based on risk thresholds |
| 🔗 Blockchain Integration | Direct connection to BNB Chain mainnet and testnet |
| 🖥️ REST API | Easy-to-use API for contract analysis |
| 📊 Real-time Monitoring | Continuous monitoring of tracked contracts |
| 🌐 Open Source | Apache 2.0 licensed, encouraging collaboration |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16.0.0 or higher
- npm or yarn package manager

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/myrosepetalbroker-maker/SentinelZero.git
cd SentinelZero

# Install dependencies
npm install

# Run setup wizard
npm run setup

# Start the application
npm start
\`\`\`

The application will be available at \`http://localhost:3000\`

For detailed setup instructions, see [SETUP.md](./SETUP.md)

---

## 🔄 Auto-Approval System

SentinelZero includes an intelligent auto-approval system that automatically evaluates smart contracts based on risk scores:

### How It Works

1. **Risk Analysis**: Contract is analyzed for vulnerabilities and risk factors
2. **Score Calculation**: Dynamic risk score (0-100) is generated
3. **Level Determination**: Risk level assigned (LOW/MEDIUM/HIGH/CRITICAL)
4. **Auto-Approval Decision**: Based on configurable thresholds and rules
5. **Audit Trail**: All decisions logged for compliance

### Configuration

\`\`\`bash
# Enable/disable auto-approval
AUTO_APPROVE_ENABLED=true

# Set risk score threshold
AUTO_APPROVE_THRESHOLD=70

# Configure by risk level
AUTO_APPROVE_LOW_RISK=true
AUTO_APPROVE_MEDIUM_RISK=false
AUTO_APPROVE_HIGH_RISK=false
\`\`\`

---

## 📡 API Endpoints

### Analyze Contract
\`\`\`bash
POST /analyze
Content-Type: application/json

{
  "contractAddress": "0x10ED43C718714eb63d5aA57B78B54704E256024E"
}
\`\`\`

**Response:**
\`\`\`json
{
  "contractAddress": "0x10ED...",
  "riskScore": 16,
  "riskLevel": "LOW",
  "approval": {
    "approved": true,
    "reason": "Auto-approved: Risk score 16 is below threshold 70"
  }
}
\`\`\`

### Get All Analyses
\`\`\`bash
GET /contracts
\`\`\`

### Get Statistics
\`\`\`bash
GET /stats
\`\`\`

### Health Check
\`\`\`bash
GET /health
\`\`\`

---

## 🔗 Architecture Overview
\`\`\`
A[📥 Public Exploit Data] --> B[🧹 Data Ingestion & Cleaning]
B --> C[🗂️ Risk Taxonomy Classification]
C --> D[⚖️ Dynamic Risk Scoring Engine]
D --> E[🤖 Auto-Approval Decision]
E --> F[🖥️ Dashboard & Alerts]
D --> G[📄 Whitepaper & Documentation]
\`\`\`

---

## 🛑 Problem Statement

Even audited smart contracts remain vulnerable to repeated exploits.
Smaller projects often lack resources for continuous monitoring, leaving protocols on BNB Chain exposed to attacks and financial losses.

SentinelZero addresses this gap with a data-driven, automated approach to identify risks and reduce potential exploits.

---

## 🗓️ Roadmap (6 Months)

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Phase 1 | 6–8 weeks | Historical exploit database ✅ |
| Phase 2 | 8–12 weeks | Taxonomy & initial scoring ✅ |
| Phase 3 | 12–16 weeks | MVP dashboard & API ✅ |
| Phase 4 | 4–6 weeks | Whitepaper & open-source documentation |

---

## 💡 Expected Impact

✅ Improved visibility of smart contract risks  
✅ Reduced likelihood of post-audit exploits  
✅ Provides actionable insights to developers and investors  
✅ Encourages best practices across the BNB Chain ecosystem  
✅ Automated approval workflow reduces manual review overhead  

---

## 💰 Budget Estimate (USD)

| Phase | Cost |
|-------|------|
| Phase 1 | $15,000 |
| Phase 2 | $30,000 |
| Phase 3 | $45,000 |
| Phase 4 | $20,000 |
| **Total** | **$110,000** |

---

## 🖼️ Dashboard Preview 

<img width="1536" height="1024" alt="A_2D_digital_illustration_showcases_the_SentinelZe" src="https://github.com/user-attachments/assets/45abfd33-ee8c-48ea-b596-c80bc2f7fec2" />

Generated mockup of the MVP for initial presentation.

---

## 🤝 Collaboration & Contribution

We welcome developers, auditors, and researchers to collaborate:

- Submit bug reports or security incidents
- Propose new taxonomy entries
- Suggest dashboard features and UI improvements
- Contribute to auto-approval algorithms

Repository: https://github.com/myrosepetalbroker-maker/SentinelZero

---

## 📜 License

This project is open-source under the Apache 2.0 license.

---

## 🔗 References

- [Rekt News](https://rekt.news)
- [Halborn Top 100 DeFi Hacks](https://halborn.com)
- [PeckShield](https://peckshield.com) & [CertiK](https://certik.com) blogs
- [Frontal Blockchain Timeline](https://frontal.io)

---

## 📞 Support

For setup help, see [SETUP.md](./SETUP.md)  
For issues, open a GitHub issue  
For questions, check the documentation
