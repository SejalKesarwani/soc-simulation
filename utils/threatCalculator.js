/**
 * Known attacker IP addresses (in a real system, this would be loaded from a database)
 */
const KNOWN_ATTACKER_IPS = [
  '192.168.1.100',
  '10.0.0.50',
  '172.16.0.1',
  '203.0.113.45',
  '198.51.100.89',
];

/**
 * Attack type weight multipliers
 */
const ATTACK_TYPE_WEIGHTS = {
  'DDoS': 20,
  'Phishing': 25,
  'Malware': 30,
  'SQLInjection': 35,
  'XSS': 15,
};

/**
 * Target criticality levels
 */
const TARGET_CRITICALITY = {
  '/api/login': 0.95,
  '/api/search': 0.50,
  '/api/users': 0.85,
  '/api/products': 0.60,
  '/api/dashboard': 0.80,
  '/api/data': 0.75,
  '/admin': 0.95,
  '/': 0.40,
  '/profile': 0.70,
};

/**
 * Gets success/impact factor based on attack type and success status
 * @param {string} attackType - Type of attack
 * @param {Object} attackData - Attack object data
 * @returns {number} Factor between 0-1
 */
function getSuccessImpactFactor(attackType, attackData) {
  let factor = 0.5; // Default neutral factor

  switch (attackType) {
    case 'DDoS':
      // Factor based on intensity (higher intensity = higher factor)
      factor = Math.min(attackData.requestsPerSecond / 5000, 1);
      break;

    case 'Phishing':
      // Factor based on success rate
      factor = (attackData.successRate || 0) / 100;
      break;

    case 'Malware':
      // Factor based on infected systems count
      factor = Math.min((attackData.infectedSystemsCount || 1) / 50, 1);
      break;

    case 'SQLInjection':
      // Factor based on success and data exposed
      if (attackData.success && attackData.dataExposed) {
        const totalExposed = (attackData.dataExposed.usernamesExposed || 0) +
          (attackData.dataExposed.emailsExposed || 0) +
          (attackData.dataExposed.passwordsCount || 0);
        factor = Math.min(totalExposed / 1000, 1);
      } else {
        factor = 0.2;
      }
      break;

    case 'XSS':
      // Factor based on success and data exposed
      if (attackData.success && attackData.dataExposed) {
        const totalExposed = (attackData.dataExposed.cookiesStolen || 0) +
          (attackData.dataExposed.sessionTokensStolen || 0) +
          (attackData.dataExposed.usersAffected || 0);
        factor = Math.min(totalExposed / 500, 1);
      } else {
        factor = 0.2;
      }
      break;
  }

  return Math.min(Math.max(factor, 0), 1); // Ensure 0-1 range
}

/**
 * Gets target criticality factor
 * @param {Object} attackData - Attack object data
 * @returns {number} Factor between 0-1
 */
function getTargetCriticalityFactor(attackData) {
  // Try to determine target from different attack types
  let target = attackData.targetURL || attackData.targetEndpoint || '/';

  return TARGET_CRITICALITY[target] || 0.50;
}

/**
 * Checks if source IP is in known attacker list
 * @param {string} sourceIP - Source IP address
 * @returns {boolean} Whether IP is known attacker
 */
function isKnownAttacker(sourceIP) {
  return KNOWN_ATTACKER_IPS.includes(sourceIP);
}

/**
 * Calculates threat level for an attack
 * @param {Object} attack - Attack object with all data
 * @returns {Object} Threat analysis object with {score, severity, factors}
 */
function calculateThreatLevel(attack) {
  const factors = [];
  let baseScore = 0;

  // 1. Attack type weight (0-35 points)
  const attackType = attack.attackType || 'Unknown';
  const typeWeight = ATTACK_TYPE_WEIGHTS[attackType] || 15;
  baseScore += (typeWeight / 35) * 35; // Normalize to 0-35
  factors.push(`${attackType} attack (weight: ${typeWeight})`);

  // 2. Success/Impact factor (0-35 points)
  const impactFactor = getSuccessImpactFactor(attackType, attack);
  baseScore += impactFactor * 35;
  const impactPercentage = Math.round(impactFactor * 100);
  factors.push(`Success/impact factor: ${impactPercentage}%`);

  // 3. Target criticality (0-20 points)
  const criticalityFactor = getTargetCriticalityFactor(attack);
  baseScore += criticalityFactor * 20;
  const criticalityPercentage = Math.round(criticalityFactor * 100);
  factors.push(`Target criticality: ${criticalityPercentage}%`);

  // 4. Source reputation (0-10 points)
  const sourceIP = attack.sourceIP;
  let reputationScore = 0;
  if (isKnownAttacker(sourceIP)) {
    reputationScore = 10;
    factors.push(`Known attacker IP detected: ${sourceIP}`);
  } else {
    reputationScore = 2;
    factors.push(`Unknown source IP: ${sourceIP}`);
  }
  baseScore += reputationScore;

  // Normalize final score to 0-100 range
  const score = Math.min(Math.round(baseScore), 100);

  // Determine severity based on score
  let severity;
  if (score <= 25) {
    severity = 'Low';
  } else if (score <= 50) {
    severity = 'Medium';
  } else if (score <= 75) {
    severity = 'High';
  } else {
    severity = 'Critical';
  }

  return {
    score,
    severity,
    factors,
  };
}

module.exports = {
  calculateThreatLevel,
};
