const blockchainService = require('./blockchain');
const logger = require('../utils/logger');
const { db } = require('../utils/database');
const riskTaxonomy = require('../data/riskTaxonomy.json');

class RiskAnalyzer {
  constructor() {
    this.riskThresholds = {
      low: parseInt(process.env.RISK_THRESHOLD_LOW) || 30,
      medium: parseInt(process.env.RISK_THRESHOLD_MEDIUM) || 60,
      high: parseInt(process.env.RISK_THRESHOLD_HIGH) || 80
    };
    
    // Balance risk thresholds in BNB
    this.balanceThresholds = {
      low: 1,
      moderate: 100,
      significant: 1000
    };
  }

  async analyzeContract(contractAddress) {
    try {
      logger.info(`Starting risk analysis for ${contractAddress}`);

      // Validate address
      if (!blockchainService.isValidAddress(contractAddress)) {
        throw new Error('Invalid contract address');
      }

      // Get contract data
      const code = await blockchainService.getContractCode(contractAddress);
      const balance = await blockchainService.getContractBalance(contractAddress);
      const txCount = await blockchainService.getTransactionCount(contractAddress);

      // Check if contract exists
      if (code === '0x' || code === '0x0') {
        throw new Error('No contract found at this address');
      }

      // Perform risk analysis
      const riskFactors = this.calculateRiskFactors(code, balance, txCount);
      const riskScore = this.calculateRiskScore(riskFactors);
      const riskLevel = this.determineRiskLevel(riskScore);
      const vulnerabilities = this.identifyVulnerabilities(code, riskFactors);

      const analysis = {
        contractAddress,
        timestamp: new Date().toISOString(),
        riskScore,
        riskLevel,
        riskFactors,
        vulnerabilities,
        contractData: {
          codeSize: code.length,
          balance: balance,
          transactionCount: txCount
        },
        recommendations: this.generateRecommendations(riskLevel, vulnerabilities)
      };

      // Store analysis
      await db.addAnalysis(analysis);
      logger.info(`Analysis complete for ${contractAddress}: Risk Level ${riskLevel} (Score: ${riskScore})`);

      return analysis;
    } catch (error) {
      logger.error(`Risk analysis failed for ${contractAddress}:`, error.message);
      throw error;
    }
  }

  calculateRiskFactors(code, balance, txCount) {
    const factors = {
      codeComplexity: this.assessCodeComplexity(code),
      balanceRisk: this.assessBalanceRisk(balance),
      activityLevel: this.assessActivityLevel(txCount),
      knownPatterns: this.detectKnownPatterns(code)
    };

    return factors;
  }

  assessCodeComplexity(code) {
    // Simple complexity assessment based on code size
    const codeSize = code.length;
    
    if (codeSize < 1000) return { score: 10, description: 'Simple contract' };
    if (codeSize < 5000) return { score: 30, description: 'Moderate complexity' };
    if (codeSize < 20000) return { score: 50, description: 'Complex contract' };
    return { score: 70, description: 'Highly complex contract' };
  }

  assessBalanceRisk(balance) {
    const balanceFloat = parseFloat(balance);
    
    if (balanceFloat < this.balanceThresholds.low) return { score: 10, description: 'Low value locked' };
    if (balanceFloat < this.balanceThresholds.moderate) return { score: 30, description: 'Moderate value locked' };
    if (balanceFloat < this.balanceThresholds.significant) return { score: 50, description: 'Significant value locked' };
    return { score: 70, description: 'High value locked' };
  }

  assessActivityLevel(txCount) {
    if (txCount < 10) return { score: 20, description: 'Low activity' };
    if (txCount < 100) return { score: 40, description: 'Moderate activity' };
    if (txCount < 1000) return { score: 30, description: 'High activity' };
    return { score: 20, description: 'Very high activity (established)' };
  }

  detectKnownPatterns(code) {
    const patterns = [];
    let totalScore = 0;

    // Check for common vulnerability patterns
    const vulnerabilityPatterns = {
      'selfdestruct': { score: 30, severity: 'medium' },
      'delegatecall': { score: 40, severity: 'high' },
      'callcode': { score: 50, severity: 'high' },
      'tx.origin': { score: 35, severity: 'medium' },
      'suicide': { score: 30, severity: 'medium' }
    };

    for (const [pattern, data] of Object.entries(vulnerabilityPatterns)) {
      if (code.toLowerCase().includes(pattern.toLowerCase())) {
        patterns.push({ pattern, ...data });
        totalScore += data.score;
      }
    }

    return {
      score: Math.min(totalScore, 100),
      patterns,
      description: patterns.length > 0 ? 'Risky patterns detected' : 'No obvious risk patterns'
    };
  }

  calculateRiskScore(riskFactors) {
    const weights = {
      codeComplexity: 0.25,
      balanceRisk: 0.25,
      activityLevel: 0.20,
      knownPatterns: 0.30
    };

    let totalScore = 0;
    for (const [factor, weight] of Object.entries(weights)) {
      totalScore += riskFactors[factor].score * weight;
    }

    return Math.round(totalScore);
  }

  determineRiskLevel(score) {
    if (score < this.riskThresholds.low) return 'LOW';
    if (score < this.riskThresholds.medium) return 'MEDIUM';
    if (score < this.riskThresholds.high) return 'HIGH';
    return 'CRITICAL';
  }

  identifyVulnerabilities(code, riskFactors) {
    const vulnerabilities = [];

    // Add vulnerabilities based on detected patterns
    if (riskFactors.knownPatterns.patterns) {
      riskFactors.knownPatterns.patterns.forEach(pattern => {
        vulnerabilities.push({
          type: pattern.pattern,
          severity: pattern.severity,
          description: `Detected use of ${pattern.pattern} which may pose security risks`,
          mitigation: `Review and secure all ${pattern.pattern} implementations`
        });
      });
    }

    return vulnerabilities;
  }

  generateRecommendations(riskLevel, vulnerabilities) {
    const recommendations = [];

    if (riskLevel === 'LOW') {
      recommendations.push('Contract appears to have low risk. Continue monitoring for changes.');
    } else if (riskLevel === 'MEDIUM') {
      recommendations.push('Contract has moderate risk. Review identified vulnerabilities.');
      recommendations.push('Consider additional security audits.');
    } else if (riskLevel === 'HIGH') {
      recommendations.push('Contract has high risk. Immediate security review recommended.');
      recommendations.push('Consider professional security audit before significant use.');
    } else {
      recommendations.push('CRITICAL RISK DETECTED. Do not use without thorough security audit.');
      recommendations.push('Multiple high-severity issues identified.');
    }

    if (vulnerabilities.length > 0) {
      const vulnCount = vulnerabilities.length;
      recommendations.push(`Address ${vulnCount} identified ${vulnCount === 1 ? 'vulnerability' : 'vulnerabilities'}.`);
    }

    return recommendations;
  }

  async getAllAnalyses() {
    return db.getAnalyses();
  }

  async getStatistics() {
    const analyses = db.getAnalyses();
    const stats = {
      total: analyses.length,
      byRiskLevel: {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        CRITICAL: 0
      },
      averageRiskScore: 0,
      totalVulnerabilities: 0
    };

    let totalScore = 0;
    analyses.forEach(analysis => {
      stats.byRiskLevel[analysis.riskLevel]++;
      totalScore += analysis.riskScore;
      stats.totalVulnerabilities += analysis.vulnerabilities.length;
    });

    if (analyses.length > 0) {
      stats.averageRiskScore = Math.round(totalScore / analyses.length);
    }

    return stats;
  }
}

module.exports = new RiskAnalyzer();
