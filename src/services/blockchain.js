const { ethers } = require('ethers');
const logger = require('../utils/logger');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.connected = false;
  }

  async connect() {
    try {
      const rpcUrl = process.env.NETWORK === 'testnet' 
        ? process.env.BNB_CHAIN_TESTNET_RPC_URL 
        : process.env.BNB_CHAIN_RPC_URL;

      logger.info(`Connecting to BNB Chain (${process.env.NETWORK})...`);
      logger.info(`RPC URL: ${rpcUrl}`);
      
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Test connection with timeout
      const networkPromise = this.provider.getNetwork();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      );
      
      const network = await Promise.race([networkPromise, timeoutPromise]);
      const blockNumber = await this.provider.getBlockNumber();
      
      this.connected = true;
      logger.info(`✅ Connected to chain ID: ${network.chainId}, Block: ${blockNumber}`);
      
      return true;
    } catch (error) {
      logger.warn('Blockchain connection failed:', error.message);
      logger.warn('⚠️  Running in offline mode - limited functionality');
      this.connected = false;
      // Don't throw - allow app to run in offline mode
      return false;
    }
  }

  isConnected() {
    return this.connected;
  }

  async getContractCode(address) {
    try {
      if (!this.connected) {
        // Return mock data in offline mode
        logger.warn('Using mock data - not connected to blockchain');
        return '0x' + '60806040'.repeat(100); // Mock contract bytecode
      }
      
      const code = await this.provider.getCode(address);
      return code;
    } catch (error) {
      logger.error(`Error getting contract code for ${address}:`, error.message);
      throw error;
    }
  }

  async getContractBalance(address) {
    try {
      if (!this.connected) {
        // Return mock data in offline mode
        logger.warn('Using mock data - not connected to blockchain');
        return '42.5';
      }
      
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      logger.error(`Error getting balance for ${address}:`, error.message);
      throw error;
    }
  }

  async getTransactionCount(address) {
    try {
      if (!this.connected) {
        // Return mock data in offline mode
        logger.warn('Using mock data - not connected to blockchain');
        return 156;
      }
      
      const count = await this.provider.getTransactionCount(address);
      return count;
    } catch (error) {
      logger.error(`Error getting transaction count for ${address}:`, error.message);
      throw error;
    }
  }

  async getBlockNumber() {
    try {
      if (!this.connected) {
        // Return mock data in offline mode
        return 43500000;
      }
      
      return await this.provider.getBlockNumber();
    } catch (error) {
      logger.error('Error getting block number:', error.message);
      throw error;
    }
  }

  isValidAddress(address) {
    return ethers.isAddress(address);
  }
}

module.exports = new BlockchainService();
