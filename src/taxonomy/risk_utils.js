/**
 * Risk Taxonomy and Scoring Utilities
 * 
 * This module provides functions to calculate risk scores based on the
 * SentinelZero risk taxonomy framework.
 */

const fs = require('fs');
const path = require('path');

// Load taxonomy data
const taxonomyPath = path.join(__dirname, 'risk_taxonomy.json');
const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));

/**
 * Calculate base risk score for a contract based on identified vulnerabilities
 * @param {Array<string>} vulnerabilities - Array of vulnerability category IDs
 * @returns {number} Base risk score (0-100)
 */
function calculateBaseRiskScore(vulnerabilities) {
  if (!vulnerabilities || vulnerabilities.length === 0) {
    return 0;
  }

  const weights = vulnerabilities.map(vulnId => {
    const category = Object.values(taxonomy.risk_categories).find(
      cat => cat.id === vulnId || Object.keys(taxonomy.risk_categories).find(
        key => key === vulnId
      )
    );
    return category ? category.severity_weight : 0;
  });

  // Use maximum weight as base (worst-case scenario)
  const maxWeight = Math.max(...weights);
  return Math.round(maxWeight * 100);
}

/**
 * Calculate comprehensive risk score considering multiple factors
 * @param {Object} contractData - Contract information object
 * @param {Array<string>} contractData.vulnerabilities - Identified vulnerabilities
 * @param {number} contractData.tvl - Total Value Locked in USD
 * @param {boolean} contractData.isAudited - Whether contract has been audited
 * @param {number} contractData.auditAge - Age of audit in days
 * @param {number} contractData.complexity - Code complexity score (0-10)
 * @param {number} contractData.daysInProduction - Days since deployment
 * @param {boolean} contractData.hasBugBounty - Whether bug bounty exists
 * @returns {Object} Risk assessment with score and level
 */
function calculateRiskScore(contractData) {
  const {
    vulnerabilities = [],
    tvl = 0,
    isAudited = false,
    auditAge = 999,
    complexity = 5,
    daysInProduction = 0,
    hasBugBounty = false
  } = contractData;

  // Factor 1: Vulnerability presence (40% weight)
  const baseScore = calculateBaseRiskScore(vulnerabilities);
  const vulnerabilityScore = baseScore * taxonomy.scoring_factors.vulnerability_presence.weight;

  // Factor 2: TVL exposure (25% weight)
  let tvlScore = 0;
  if (tvl > 100000000) tvlScore = 100;
  else if (tvl > 10000000) tvlScore = 80;
  else if (tvl > 1000000) tvlScore = 60;
  else if (tvl > 100000) tvlScore = 40;
  else tvlScore = 20;
  const tvlWeighted = tvlScore * taxonomy.scoring_factors.tvl_exposure.weight;

  // Factor 3: Audit status (15% weight)
  let auditScore = 100;
  if (isAudited) {
    if (auditAge < 90) auditScore = 20;
    else if (auditAge < 180) auditScore = 40;
    else if (auditAge < 365) auditScore = 60;
    else auditScore = 80;
  }
  const auditWeighted = auditScore * taxonomy.scoring_factors.audit_status.weight;

  // Factor 4: Code complexity (10% weight)
  const complexityScore = (complexity / 10) * 100;
  const complexityWeighted = complexityScore * taxonomy.scoring_factors.code_complexity.weight;

  // Factor 5: Time in production (5% weight)
  let productionScore = 100;
  if (daysInProduction > 365) productionScore = 20;
  else if (daysInProduction > 180) productionScore = 40;
  else if (daysInProduction > 90) productionScore = 60;
  else if (daysInProduction > 30) productionScore = 80;
  const productionWeighted = productionScore * taxonomy.scoring_factors.time_in_production.weight;

  // Factor 6: Bug bounty (5% weight)
  const bountyScore = hasBugBounty ? 20 : 80;
  const bountyWeighted = bountyScore * taxonomy.scoring_factors.bug_bounty.weight;

  // Calculate final score
  const totalScore = Math.round(
    vulnerabilityScore + tvlWeighted + auditWeighted +
    complexityWeighted + productionWeighted + bountyWeighted
  );

  // Determine severity level
  const severityLevel = getSeverityLevel(totalScore);

  return {
    score: totalScore,
    level: severityLevel.name,
    color: severityLevel.color,
    action_required: severityLevel.action_required,
    breakdown: {
      vulnerability: Math.round(vulnerabilityScore),
      tvl: Math.round(tvlWeighted),
      audit: Math.round(auditWeighted),
      complexity: Math.round(complexityWeighted),
      production: Math.round(productionWeighted),
      bugBounty: Math.round(bountyWeighted)
    }
  };
}

/**
 * Get severity level based on score
 * @param {number} score - Risk score (0-100)
 * @returns {Object} Severity level information
 */
function getSeverityLevel(score) {
  for (const [name, level] of Object.entries(taxonomy.severity_levels)) {
    const [min, max] = level.score_range;
    if (score >= min && score <= max) {
      return { name, ...level };
    }
  }
  return { name: 'unknown', ...taxonomy.severity_levels.informational };
}

/**
 * Get vulnerability category information
 * @param {string} categoryKey - Category key or ID
 * @returns {Object|null} Category information
 */
function getVulnerabilityCategory(categoryKey) {
  return taxonomy.risk_categories[categoryKey] || null;
}

/**
 * Get all risk categories
 * @returns {Object} All risk categories
 */
function getAllCategories() {
  return taxonomy.risk_categories;
}

/**
 * Get mitigation strategies for specific vulnerabilities
 * @param {Array<string>} vulnerabilities - Array of vulnerability category keys
 * @returns {Array<Object>} Mitigation strategies
 */
function getMitigationStrategies(vulnerabilities) {
  return vulnerabilities.map(vulnKey => {
    const category = taxonomy.risk_categories[vulnKey];
    if (!category) return null;
    
    return {
      vulnerability: category.name,
      strategies: category.mitigation_strategies,
      severity_weight: category.severity_weight
    };
  }).filter(Boolean);
}

module.exports = {
  calculateBaseRiskScore,
  calculateRiskScore,
  getSeverityLevel,
  getVulnerabilityCategory,
  getAllCategories,
  getMitigationStrategies,
  taxonomy
};
