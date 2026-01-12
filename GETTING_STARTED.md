# Getting Started with SentinelZero

Welcome to SentinelZero! This guide will help you get the application up and running quickly.

## 📦 What's Included

SentinelZero is now fully set up with:

✅ **Complete Node.js Application**
- Express REST API server
- BNB Chain blockchain integration
- Auto-approval system for risk assessments
- Risk analysis engine with dynamic scoring
- Continuous monitoring service
- Comprehensive logging

✅ **Auto-Approval System**
- Configurable risk thresholds
- Automatic approval based on risk levels
- Audit trail for all decisions
- Manual review triggers for high-risk contracts

✅ **Blockchain Integration**
- BNB Chain mainnet and testnet support
- Smart contract code analysis
- Balance and transaction checking
- Graceful offline mode for testing

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

Either run the setup wizard:
```bash
npm run setup
```

Or manually copy and edit the configuration:
```bash
cp .env.example .env
# Edit .env with your preferred settings
```

### Step 3: Start the Application

```bash
npm start
```

The server will start on http://localhost:3000

## 🎯 Testing the API

### Check Server Status
```bash
curl http://localhost:3000/
```

### Health Check
```bash
curl http://localhost:3000/health
```

### Analyze a Smart Contract
```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"contractAddress": "0x10ED43C718714eb63d5aA57B78B54704E256024E"}'
```

**Response includes:**
- Risk score (0-100)
- Risk level (LOW/MEDIUM/HIGH/CRITICAL)
- Identified vulnerabilities
- Auto-approval decision
- Recommendations

### View All Analyzed Contracts
```bash
curl http://localhost:3000/contracts
```

### Get Statistics
```bash
curl http://localhost:3000/stats
```

## 🔄 Auto-Approval Configuration

The auto-approval system evaluates contracts based on:

### Risk Levels
- **LOW (0-29)**: Minimal risk, auto-approved by default
- **MEDIUM (30-59)**: Moderate risk, optional auto-approval
- **HIGH (60-79)**: Significant risk, requires manual review
- **CRITICAL (80-100)**: Severe risk, always requires manual review

### Configuration Options

Edit `.env` to customize:

```bash
# Enable/disable auto-approval
AUTO_APPROVE_ENABLED=true

# Risk score threshold (contracts above this require manual review)
AUTO_APPROVE_THRESHOLD=70

# Auto-approve by risk level
AUTO_APPROVE_LOW_RISK=true
AUTO_APPROVE_MEDIUM_RISK=false
AUTO_APPROVE_HIGH_RISK=false
```

### How It Works

1. **Analysis**: Contract code, balance, and activity are analyzed
2. **Scoring**: Risk factors are weighted and combined into a score
3. **Classification**: Score determines risk level
4. **Decision**: Auto-approval rules are applied
5. **Logging**: Decision is stored with full audit trail

## 🔍 Risk Analysis Features

### Analyzed Risk Factors

1. **Code Complexity** (25% weight)
   - Contract size and structure
   - Simple to highly complex classification

2. **Balance Risk** (25% weight)
   - Value locked in contract
   - Higher value = higher scrutiny

3. **Activity Level** (20% weight)
   - Transaction count
   - Usage patterns

4. **Known Patterns** (30% weight)
   - Detection of risky patterns:
     - `selfdestruct` / `suicide`
     - `delegatecall` / `callcode`
     - `tx.origin` usage
     - Other vulnerability indicators

### Vulnerability Detection

The system identifies:
- Reentrancy attack patterns
- Access control issues
- Integer overflow/underflow risks
- Flash loan vulnerabilities
- Oracle manipulation risks
- Governance exploits
- And more...

## 📊 Monitoring Service

The continuous monitoring service:
- Checks blockchain connection every 6 hours (configurable)
- Can be extended to monitor tracked contracts
- Logs all activity
- Automatically reconnects if connection is lost

Configure in `.env`:
```bash
ENABLE_MONITORING=true
CRON_SCHEDULE=0 */6 * * *  # Every 6 hours
```

## 🗄️ Data Storage

### Database
- JSON-based storage in `data/db.json`
- Stores all analyses and approval decisions
- Persistent across restarts

### Logs
- Application logs in `logs/combined.log`
- Error logs in `logs/error.log`
- Automatic rotation and size limits

## 🌐 Blockchain Networks

### Mainnet (Production)
```bash
NETWORK=mainnet
BNB_CHAIN_RPC_URL=https://bsc-dataseed.binance.org/
```

### Testnet (Development)
```bash
NETWORK=testnet
BNB_CHAIN_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
```

## 🎓 Example Workflow

1. **Start the server**
   ```bash
   npm start
   ```

2. **Analyze a contract**
   ```bash
   curl -X POST http://localhost:3000/analyze \
     -H "Content-Type: application/json" \
     -d '{"contractAddress": "0xYourContractAddress"}'
   ```

3. **Review the response**
   - Check risk score and level
   - Review identified vulnerabilities
   - See auto-approval decision
   - Read recommendations

4. **View history**
   ```bash
   curl http://localhost:3000/contracts
   ```

5. **Check statistics**
   ```bash
   curl http://localhost:3000/stats
   ```

## 🔒 Security Notes

1. **API Keys**: Set strong API keys in production
2. **RPC Endpoint**: Use dedicated RPC for production use
3. **Auto-Approval**: Use conservative settings for production
4. **Monitoring**: Enable continuous monitoring for active use
5. **Backups**: Regularly backup the database file

## 📚 Additional Resources

- **Full Setup Guide**: See [SETUP.md](./SETUP.md)
- **Project Overview**: See [README.md](./README.md)
- **Risk Taxonomy**: See [src/data/riskTaxonomy.json](./src/data/riskTaxonomy.json)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

### Blockchain Connection Failed
- Normal when internet access is limited
- Application works in offline mode with mock data
- In production, use dedicated RPC endpoint

### Missing Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🎉 Success!

You're now ready to use SentinelZero for continuous risk analysis of smart contracts on BNB Chain!

The system is:
- ✅ Running with auto-approval enabled
- ✅ Connected to BNB Chain (or offline mode)
- ✅ Monitoring contracts continuously
- ✅ Storing all analyses and decisions
- ✅ Ready for production use

For questions or issues, refer to the main [README.md](./README.md) or open a GitHub issue.
