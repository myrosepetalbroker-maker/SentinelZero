const logger = require('../utils/logger');
const { db } = require('../utils/database');

class AutoApprovalService {
  constructor() {
    this.enabled = process.env.AUTO_APPROVE_ENABLED === 'true';
    this.threshold = parseInt(process.env.AUTO_APPROVE_THRESHOLD) || 70;
    this.autoApproveLowRisk = process.env.AUTO_APPROVE_LOW_RISK === 'true';
    this.autoApproveMediumRisk = process.env.AUTO_APPROVE_MEDIUM_RISK === 'true';
    this.autoApproveHighRisk = process.env.AUTO_APPROVE_HIGH_RISK === 'false';
  }

  getStatus() {
    return {
      enabled: this.enabled,
      threshold: this.threshold,
      settings: {
        autoApproveLowRisk: this.autoApproveLowRisk,
        autoApproveMediumRisk: this.autoApproveMediumRisk,
        autoApproveHighRisk: this.autoApproveHighRisk
      }
    };
  }

  async processAnalysis(analysis) {
    try {
      if (!this.enabled) {
        logger.info('Auto-approval is disabled');
        return {
          approved: false,
          reason: 'Auto-approval is disabled',
          requiresManualReview: true
        };
      }

      const { riskScore, riskLevel, contractAddress } = analysis;
      
      logger.info(`Processing auto-approval for ${contractAddress}: ${riskLevel} (${riskScore})`);

      // Determine if contract should be auto-approved
      const decision = this.makeApprovalDecision(riskScore, riskLevel);

      // Store approval decision
      await db.addApproval({
        contractAddress,
        approved: decision.approved,
        riskScore,
        riskLevel,
        reason: decision.reason,
        automatic: true
      });

      logger.info(`Auto-approval decision for ${contractAddress}: ${decision.approved ? 'APPROVED' : 'REJECTED'}`);
      logger.info(`Reason: ${decision.reason}`);

      return decision;
    } catch (error) {
      logger.error('Auto-approval processing error:', error);
      return {
        approved: false,
        reason: 'Error during auto-approval processing',
        requiresManualReview: true,
        error: error.message
      };
    }
  }

  makeApprovalDecision(riskScore, riskLevel) {
    // Check risk level settings
    if (riskLevel === 'LOW' && !this.autoApproveLowRisk) {
      return {
        approved: false,
        reason: 'Low risk contracts are not set for auto-approval',
        requiresManualReview: true
      };
    }

    if (riskLevel === 'MEDIUM' && !this.autoApproveMediumRisk) {
      return {
        approved: false,
        reason: 'Medium risk contracts are not set for auto-approval',
        requiresManualReview: true
      };
    }

    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
      return {
        approved: false,
        reason: `${riskLevel} risk contracts require manual review`,
        requiresManualReview: true
      };
    }

    // Check score threshold
    if (riskScore > this.threshold) {
      return {
        approved: false,
        reason: `Risk score ${riskScore} exceeds threshold ${this.threshold}`,
        requiresManualReview: true
      };
    }

    // Approve if all checks pass
    return {
      approved: true,
      reason: `Auto-approved: Risk score ${riskScore} is below threshold ${this.threshold} and risk level ${riskLevel} is acceptable`,
      requiresManualReview: false
    };
  }

  async getApprovalHistory() {
    return db.getApprovals();
  }

  async getApprovalStats() {
    const approvals = db.getApprovals();
    const stats = {
      total: approvals.length,
      approved: 0,
      rejected: 0,
      byRiskLevel: {
        LOW: { approved: 0, rejected: 0 },
        MEDIUM: { approved: 0, rejected: 0 },
        HIGH: { approved: 0, rejected: 0 },
        CRITICAL: { approved: 0, rejected: 0 }
      }
    };

    approvals.forEach(approval => {
      if (approval.approved) {
        stats.approved++;
        stats.byRiskLevel[approval.riskLevel].approved++;
      } else {
        stats.rejected++;
        stats.byRiskLevel[approval.riskLevel].rejected++;
      }
    });

    return stats;
  }
}

module.exports = new AutoApprovalService();
