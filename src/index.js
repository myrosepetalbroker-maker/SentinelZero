require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const blockchainService = require('./services/blockchain');
const riskAnalyzer = require('./services/riskAnalyzer');
const autoApprovalService = require('./services/autoApproval');
const monitoringService = require('./services/monitoring');
const { initializeDatabase } = require('./utils/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
async function initialize() {
  try {
    logger.info('🚀 Initializing SentinelZero...');
    
    // Initialize database
    await initializeDatabase();
    logger.info('✅ Database initialized');
    
    // Initialize blockchain connection
    await blockchainService.connect();
    logger.info('✅ Blockchain connected');
    
    // Start monitoring service if enabled
    if (process.env.ENABLE_MONITORING === 'true') {
      monitoringService.start();
      logger.info('✅ Monitoring service started');
    }
    
    logger.info('🎯 SentinelZero is ready!');
  } catch (error) {
    logger.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'SentinelZero',
    version: '1.0.0',
    description: 'Continuous Risk Analysis for Smart Contracts on BNB Chain',
    status: 'running',
    autoApproval: process.env.AUTO_APPROVE_ENABLED === 'true',
    network: process.env.NETWORK || 'mainnet'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    blockchain: blockchainService.isConnected(),
    autoApproval: autoApprovalService.getStatus()
  });
});

app.post('/analyze', async (req, res) => {
  try {
    const { contractAddress } = req.body;
    
    if (!contractAddress) {
      return res.status(400).json({ error: 'Contract address is required' });
    }
    
    logger.info(`📊 Analyzing contract: ${contractAddress}`);
    
    // Perform risk analysis
    const analysis = await riskAnalyzer.analyzeContract(contractAddress);
    
    // Apply auto-approval if enabled
    if (process.env.AUTO_APPROVE_ENABLED === 'true') {
      const approval = await autoApprovalService.processAnalysis(analysis);
      analysis.approval = approval;
    }
    
    res.json(analysis);
  } catch (error) {
    logger.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/contracts', async (req, res) => {
  try {
    const contracts = await riskAnalyzer.getAllAnalyses();
    res.json(contracts);
  } catch (error) {
    logger.error('Error fetching contracts:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/stats', async (req, res) => {
  try {
    const stats = await riskAnalyzer.getStatistics();
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
initialize().then(() => {
  app.listen(PORT, () => {
    logger.info(`🌐 Server running on http://localhost:${PORT}`);
    logger.info(`📡 Connected to ${process.env.NETWORK} network`);
    logger.info(`🔄 Auto-approval: ${process.env.AUTO_APPROVE_ENABLED === 'true' ? 'ENABLED' : 'DISABLED'}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
