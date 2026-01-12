const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🚨 SentinelZero Setup Wizard\n');
  console.log('This wizard will help you configure SentinelZero for first use.\n');

  // Check if .env exists
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');

  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('\n=== Blockchain Configuration ===');
  const network = await question('Select network (mainnet/testnet) [mainnet]: ') || 'mainnet';
  
  console.log('\n=== Auto-Approval Configuration ===');
  const autoApproveEnabled = await question('Enable auto-approval? (Y/n): ');
  const enableAutoApprove = autoApproveEnabled.toLowerCase() !== 'n';
  
  let autoApproveLow = 'true';
  let autoApproveMedium = 'false';
  let threshold = '70';

  if (enableAutoApprove) {
    autoApproveLow = await question('Auto-approve LOW risk contracts? (Y/n): ');
    autoApproveLow = autoApproveLow.toLowerCase() !== 'n' ? 'true' : 'false';
    
    autoApproveMedium = await question('Auto-approve MEDIUM risk contracts? (y/N): ');
    autoApproveMedium = autoApproveMedium.toLowerCase() === 'y' ? 'true' : 'false';
    
    threshold = await question('Risk score threshold for auto-approval (0-100) [70]: ') || '70';
  }

  console.log('\n=== Server Configuration ===');
  const port = await question('Server port [3000]: ') || '3000';

  console.log('\n=== Monitoring Configuration ===');
  const enableMonitoring = await question('Enable continuous monitoring? (Y/n): ');
  const monitoringEnabled = enableMonitoring.toLowerCase() !== 'n';

  // Create .env file
  const envContent = `# BNB Chain Configuration
BNB_CHAIN_RPC_URL=https://bsc-dataseed.binance.org/
BNB_CHAIN_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
NETWORK=${network}

# Auto-Approval Configuration
AUTO_APPROVE_ENABLED=${enableAutoApprove}
AUTO_APPROVE_THRESHOLD=${threshold}
AUTO_APPROVE_LOW_RISK=${autoApproveLow}
AUTO_APPROVE_MEDIUM_RISK=${autoApproveMedium}
AUTO_APPROVE_HIGH_RISK=false

# Risk Scoring Thresholds
RISK_THRESHOLD_LOW=30
RISK_THRESHOLD_MEDIUM=60
RISK_THRESHOLD_HIGH=80

# API Configuration
PORT=${port}
API_KEY=your-api-key-here

# Database Configuration
DB_PATH=./data/db.json

# Monitoring Configuration
CRON_SCHEDULE=0 */6 * * *
ENABLE_MONITORING=${monitoringEnabled}

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
`;

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Configuration saved to .env');

  // Create necessary directories
  const dirs = ['data', 'logs'];
  dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created ${dir}/ directory`);
    }
  });

  console.log('\n🎉 Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm start');
  console.log('3. Visit: http://localhost:' + port);
  console.log('\nFor more information, see SETUP.md\n');

  rl.close();
}

setup().catch(error => {
  console.error('Setup failed:', error);
  rl.close();
  process.exit(1);
});
