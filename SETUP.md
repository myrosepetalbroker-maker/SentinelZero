# 🚀 SentinelZero Setup Guide

Complete setup instructions for running SentinelZero - Continuous Risk Analysis for Smart Contracts on BNB Chain.

---

## 📋 Prerequisites

- **Node.js** v16.0.0 or higher
- **npm** or **yarn** package manager
- Internet connection for blockchain RPC access

---

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Setup Wizard

```bash
npm run setup
```

The setup wizard will guide you through:
- Network selection (mainnet/testnet)
- Auto-approval configuration
- Server settings
- Monitoring options

### 3. Start the Application

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

---

## 🔧 Manual Configuration

If you prefer manual setup, copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Configuration Options

#### Blockchain Settings
- `BNB_CHAIN_RPC_URL`: BNB Chain mainnet RPC endpoint
- `BNB_CHAIN_TESTNET_RPC_URL`: BNB Chain testnet RPC endpoint
- `NETWORK`: Choose `mainnet` or `testnet`

#### Auto-Approval Settings
- `AUTO_APPROVE_ENABLED`: Enable/disable auto-approval (`true`/`false`)
- `AUTO_APPROVE_THRESHOLD`: Risk score threshold (0-100)
- `AUTO_APPROVE_LOW_RISK`: Auto-approve low risk contracts
- `AUTO_APPROVE_MEDIUM_RISK`: Auto-approve medium risk contracts
- `AUTO_APPROVE_HIGH_RISK`: Auto-approve high risk contracts (not recommended)

#### Risk Thresholds
- `RISK_THRESHOLD_LOW`: Score below this = LOW risk (default: 30)
- `RISK_THRESHOLD_MEDIUM`: Score below this = MEDIUM risk (default: 60)
- `RISK_THRESHOLD_HIGH`: Score below this = HIGH risk (default: 80)
- Above HIGH threshold = CRITICAL risk

#### Server Settings
- `PORT`: API server port (default: 3000)

#### Monitoring
- `ENABLE_MONITORING`: Enable continuous monitoring
- `CRON_SCHEDULE`: Monitoring schedule in cron format

---

## 🎯 Usage Examples

### Analyze a Smart Contract

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"contractAddress": "0x..."}'
```

### Check System Health

```bash
curl http://localhost:3000/health
```

### View All Analyses

```bash
curl http://localhost:3000/contracts
```

### Get Statistics

```bash
curl http://localhost:3000/stats
```

---

## 🔄 Auto-Approval Workflow

When auto-approval is enabled:

1. Contract is analyzed for risk factors
2. Risk score is calculated (0-100)
3. Risk level is determined (LOW/MEDIUM/HIGH/CRITICAL)
4. Auto-approval rules are applied:
   - If score > threshold → Manual review required
   - If risk level = HIGH or CRITICAL → Manual review required
   - If settings allow risk level → Auto-approved
5. Decision is logged and stored

### Recommended Auto-Approval Settings

**Conservative (Default)**:
```
AUTO_APPROVE_THRESHOLD=70
AUTO_APPROVE_LOW_RISK=true
AUTO_APPROVE_MEDIUM_RISK=false
AUTO_APPROVE_HIGH_RISK=false
```

**Moderate**:
```
AUTO_APPROVE_THRESHOLD=80
AUTO_APPROVE_LOW_RISK=true
AUTO_APPROVE_MEDIUM_RISK=true
AUTO_APPROVE_HIGH_RISK=false
```

**Aggressive** (Not Recommended):
```
AUTO_APPROVE_THRESHOLD=90
AUTO_APPROVE_LOW_RISK=true
AUTO_APPROVE_MEDIUM_RISK=true
AUTO_APPROVE_HIGH_RISK=true
```

---

## 🧪 Testing the Setup

After starting the application, test the API:

```bash
# Check if server is running
curl http://localhost:3000/

# Check health status
curl http://localhost:3000/health

# Analyze a known BNB Chain contract (example: PancakeSwap Router)
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"contractAddress": "0x10ED43C718714eb63d5aA57B78B54704E256024E"}'
```

---

## 📊 Understanding Risk Scores

| Risk Level | Score Range | Auto-Approval | Description |
|-----------|-------------|---------------|-------------|
| LOW | 0-29 | ✅ Recommended | Minimal risk detected |
| MEDIUM | 30-59 | ⚠️ Optional | Moderate risk factors present |
| HIGH | 60-79 | ❌ Not recommended | Significant risks identified |
| CRITICAL | 80-100 | ❌ Never | Severe vulnerabilities detected |

---

## 🔍 Risk Factors Analyzed

1. **Code Complexity**: Contract size and complexity assessment
2. **Balance Risk**: Value locked in the contract
3. **Activity Level**: Transaction count and usage patterns
4. **Known Patterns**: Detection of risky code patterns:
   - `selfdestruct` / `suicide`
   - `delegatecall` / `callcode`
   - `tx.origin` usage
   - Other vulnerability indicators

---

## 🛠️ Troubleshooting

### Connection Issues

If you see blockchain connection errors:

1. Check your internet connection
2. Verify RPC endpoint is accessible
3. Try alternative RPC endpoints:
   - `https://bsc-dataseed1.binance.org/`
   - `https://bsc-dataseed2.binance.org/`
   - `https://bsc-dataseed3.binance.org/`

### Port Already in Use

If port 3000 is already in use:
```bash
# Change PORT in .env file
PORT=3001
```

### Missing Dependencies

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Logs

Logs are stored in the `logs/` directory:
- `combined.log`: All application logs
- `error.log`: Error logs only

To view logs in real-time:
```bash
tail -f logs/combined.log
```

---

## 🔒 Security Considerations

1. **API Key**: Set a strong API key in production
2. **RPC Endpoint**: Use dedicated RPC for production
3. **Rate Limiting**: Implement rate limiting for public APIs
4. **HTTPS**: Use HTTPS in production environments
5. **Auto-Approval**: Use conservative settings for production

---

## 📚 Additional Resources

- [BNB Chain Documentation](https://docs.bnbchain.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Risk Taxonomy Reference](./src/data/riskTaxonomy.json)

---

## 🤝 Support

For issues or questions:
1. Check the logs in `logs/` directory
2. Review this setup guide
3. Open an issue on GitHub

---

## 📄 License

Apache 2.0 - See LICENSE file for details
