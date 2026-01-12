/**
 * API Integration Module
 * 
 * This module provides utilities for integrating SentinelZero with external APIs
 * and blockchain data feeds for dynamic scoring and real-time monitoring.
 */

const axios = require('axios');

/**
 * Configuration for API endpoints
 */
const API_CONFIG = {
  bscScan: {
    baseUrl: 'https://api.bscscan.com/api',
    // API key should be set via environment variable
    apiKey: process.env.BSCSCAN_API_KEY || ''
  },
  defillama: {
    baseUrl: 'https://api.llama.fi',
  },
  chainlink: {
    baseUrl: 'https://api.chain.link'
  }
};

/**
 * Fetch contract source code from BscScan
 * @param {string} contractAddress - Contract address to analyze
 * @returns {Promise<Object>} Contract source code and metadata
 */
async function fetchContractSource(contractAddress) {
  try {
    const response = await axios.get(API_CONFIG.bscScan.baseUrl, {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: contractAddress,
        apikey: API_CONFIG.bscScan.apiKey
      }
    });
    
    if (response.data.status === '1' && response.data.result) {
      return {
        success: true,
        data: response.data.result[0]
      };
    }
    
    return {
      success: false,
      error: 'Contract not verified or not found'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Fetch protocol TVL from DefiLlama
 * @param {string} protocolSlug - Protocol slug on DefiLlama
 * @returns {Promise<number>} Total Value Locked in USD
 */
async function fetchProtocolTVL(protocolSlug) {
  try {
    const response = await axios.get(
      `${API_CONFIG.defillama.baseUrl}/protocol/${protocolSlug}`
    );
    
    if (response.data && response.data.tvl) {
      // Get the most recent TVL data
      const tvlData = response.data.tvl;
      const latestTvl = tvlData[tvlData.length - 1];
      return latestTvl ? latestTvl.totalLiquidityUSD : 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error fetching TVL:', error.message);
    return 0;
  }
}

/**
 * Fetch transaction count for a contract
 * @param {string} contractAddress - Contract address
 * @returns {Promise<number>} Number of transactions
 */
async function fetchTransactionCount(contractAddress) {
  try {
    const response = await axios.get(API_CONFIG.bscScan.baseUrl, {
      params: {
        module: 'account',
        action: 'txlist',
        address: contractAddress,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 1,
        sort: 'desc',
        apikey: API_CONFIG.bscScan.apiKey
      }
    });
    
    if (response.data.status === '1') {
      return parseInt(response.data.result.length) || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error fetching transaction count:', error.message);
    return 0;
  }
}

/**
 * Get contract creation date
 * @param {string} contractAddress - Contract address
 * @returns {Promise<Date|null>} Contract creation date
 */
async function getContractCreationDate(contractAddress) {
  try {
    const response = await axios.get(API_CONFIG.bscScan.baseUrl, {
      params: {
        module: 'account',
        action: 'txlist',
        address: contractAddress,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 1,
        sort: 'asc',
        apikey: API_CONFIG.bscScan.apiKey
      }
    });
    
    if (response.data.status === '1' && response.data.result.length > 0) {
      const timestamp = parseInt(response.data.result[0].timeStamp);
      return new Date(timestamp * 1000);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching creation date:', error.message);
    return null;
  }
}

/**
 * Analyze contract and gather data for risk scoring
 * @param {string} contractAddress - Contract address to analyze
 * @param {string} protocolSlug - Optional DefiLlama protocol slug
 * @returns {Promise<Object>} Comprehensive contract data
 */
async function analyzeContract(contractAddress, protocolSlug = null) {
  const [sourceData, tvl, creationDate] = await Promise.all([
    fetchContractSource(contractAddress),
    protocolSlug ? fetchProtocolTVL(protocolSlug) : Promise.resolve(0),
    getContractCreationDate(contractAddress)
  ]);
  
  const daysInProduction = creationDate 
    ? Math.floor((Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  // Analyze source code for vulnerabilities (basic pattern matching)
  const vulnerabilities = [];
  if (sourceData.success && sourceData.data.SourceCode) {
    const sourceCode = sourceData.data.SourceCode;
    
    // Check for potential reentrancy
    if (sourceCode.includes('.call') && !sourceCode.includes('ReentrancyGuard')) {
      vulnerabilities.push('reentrancy');
    }
    
    // Check for external price dependencies
    if (sourceCode.includes('getPrice') || sourceCode.includes('oracle')) {
      vulnerabilities.push('price_oracle_manipulation');
    }
    
    // Check for governance functions
    if (sourceCode.includes('onlyOwner') || sourceCode.includes('onlyGovernance')) {
      // This is actually good, but flag for review
      vulnerabilities.push('access_control');
    }
  }
  
  return {
    address: contractAddress,
    isVerified: sourceData.success,
    sourceCode: sourceData.success ? sourceData.data.SourceCode : null,
    contractName: sourceData.success ? sourceData.data.ContractName : 'Unknown',
    compiler: sourceData.success ? sourceData.data.CompilerVersion : null,
    tvl: tvl,
    daysInProduction: daysInProduction,
    createdAt: creationDate,
    detectedVulnerabilities: vulnerabilities,
    // These would need additional API calls or manual input
    isAudited: false, // Requires audit database
    auditAge: 999,
    hasBugBounty: false, // Requires bug bounty database
    complexity: sourceData.success ? Math.min(10, Math.floor(sourceData.data.SourceCode.length / 5000)) : 5
  };
}

/**
 * Stream real-time blockchain events (mock implementation)
 * In production, this would use WebSocket connections to BNB Chain nodes
 * @param {string} contractAddress - Contract to monitor
 * @param {Function} callback - Callback for new events
 */
function streamContractEvents(contractAddress, callback) {
  // Mock implementation - would use Web3 WebSocket provider in production
  console.log(`Starting event stream for ${contractAddress}`);
  
  // Simulate periodic events
  const interval = setInterval(() => {
    callback({
      address: contractAddress,
      event: 'Transfer',
      timestamp: Date.now(),
      blockNumber: Math.floor(Math.random() * 1000000)
    });
  }, 5000);
  
  // Return cleanup function
  return () => {
    clearInterval(interval);
    console.log(`Stopped event stream for ${contractAddress}`);
  };
}

/**
 * Batch analyze multiple contracts
 * @param {Array<string>} addresses - Array of contract addresses
 * @returns {Promise<Array<Object>>} Analysis results for each contract
 */
async function batchAnalyze(addresses) {
  const results = await Promise.all(
    addresses.map(address => analyzeContract(address))
  );
  return results;
}

module.exports = {
  fetchContractSource,
  fetchProtocolTVL,
  fetchTransactionCount,
  getContractCreationDate,
  analyzeContract,
  streamContractEvents,
  batchAnalyze,
  API_CONFIG
};
