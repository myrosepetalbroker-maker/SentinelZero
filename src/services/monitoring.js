const cron = require('node-cron');
const logger = require('../utils/logger');
const blockchainService = require('./blockchain');

class MonitoringService {
  constructor() {
    this.isRunning = false;
    this.schedule = process.env.CRON_SCHEDULE || '0 */6 * * *'; // Every 6 hours by default
  }

  start() {
    if (this.isRunning) {
      logger.warn('Monitoring service is already running');
      return;
    }

    logger.info(`Starting monitoring service with schedule: ${this.schedule}`);
    
    this.job = cron.schedule(this.schedule, async () => {
      await this.performMonitoring();
    });

    this.isRunning = true;
    logger.info('✅ Monitoring service started');

    // Run initial monitoring
    this.performMonitoring();
  }

  stop() {
    if (!this.isRunning) {
      logger.warn('Monitoring service is not running');
      return;
    }

    if (this.job) {
      this.job.stop();
    }

    this.isRunning = false;
    logger.info('🛑 Monitoring service stopped');
  }

  async performMonitoring() {
    try {
      logger.info('🔍 Starting scheduled monitoring check...');

      // Check blockchain connection
      if (!blockchainService.isConnected()) {
        logger.warn('Blockchain not connected, attempting to reconnect...');
        await blockchainService.connect();
      }

      // Get current block number
      const blockNumber = await blockchainService.getBlockNumber();
      logger.info(`Current block number: ${blockNumber}`);

      // Here you would add logic to:
      // - Monitor tracked contracts
      // - Check for new exploits
      // - Update risk scores
      // - Send alerts

      logger.info('✅ Monitoring check completed');
    } catch (error) {
      logger.error('Monitoring error:', error);
    }
  }

  getStatus() {
    return {
      running: this.isRunning,
      schedule: this.schedule
    };
  }
}

module.exports = new MonitoringService();
