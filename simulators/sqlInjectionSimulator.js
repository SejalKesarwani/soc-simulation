const { generateRandomIP } = require('../utils/generators');

/**
 * SQL injection payloads to simulate various attack types
 */
const SQL_INJECTION_PAYLOADS = [
  { payload: "' OR '1'='1", type: 'Union-based' },
  { payload: "admin'--", type: 'Error-based' },
  { payload: "1; DROP TABLE users--", type: 'Blind' },
  { payload: "' UNION SELECT * FROM passwords--", type: 'Union-based' },
];

/**
 * Vulnerability types for SQL injection
 */
const VULNERABILITY_TYPES = ['Error-based', 'Union-based', 'Blind', 'Time-based'];

/**
 * Attack complexity levels
 */
const ATTACK_COMPLEXITIES = ['Low', 'Medium', 'High'];

/**
 * Target endpoints for SQL injection attacks
 */
const TARGET_ENDPOINTS = ['/api/login', '/api/search', '/api/users', '/api/products'];

/**
 * Generates random exposed data when SQL injection succeeds
 * @returns {Object} Exposed data object
 */
function generateExposedData() {
  return {
    usernamesExposed: Math.floor(Math.random() * 500) + 10,
    emailsExposed: Math.floor(Math.random() * 500) + 10,
    passwordsCount: Math.floor(Math.random() * 500) + 10,
  };
}

/**
 * Calculates severity based on success status and data exposed
 * @param {boolean} success - Whether the SQL injection was successful
 * @param {Object} exposedData - Data that was exposed
 * @returns {string} Severity level (Low, Medium, High, Critical)
 */
function calculateSeverity(success, exposedData) {
  if (!success) return 'Low';

  const totalExposed = exposedData.usernamesExposed + exposedData.emailsExposed + exposedData.passwordsCount;

  if (totalExposed <= 50) return 'Medium';
  if (totalExposed <= 200) return 'High';
  return 'Critical';
}

/**
 * Simulates a SQL injection attack with random parameters
 * @returns {Object} SQL injection attack object with all simulation data
 */
function simulateSQLInjection() {
  // Determine if attack is successful (30% success, 70% failure)
  const success = Math.random() < 0.3;

  // Select random payload
  const payloadObj = SQL_INJECTION_PAYLOADS[Math.floor(Math.random() * SQL_INJECTION_PAYLOADS.length)];

  // Generate exposed data only if successful
  const exposedData = success ? generateExposedData() : null;

  // Determine vulnerability type
  const vulnerabilityType = success ? payloadObj.type : VULNERABILITY_TYPES[Math.floor(Math.random() * VULNERABILITY_TYPES.length)];

  // Determine attack complexity
  const attackComplexity = ATTACK_COMPLEXITIES[Math.floor(Math.random() * ATTACK_COMPLEXITIES.length)];

  // Calculate severity based on success and exposed data
  const severity = calculateSeverity(success, exposedData);

  return {
    sourceIP: generateRandomIP(),
    targetEndpoint: TARGET_ENDPOINTS[Math.floor(Math.random() * TARGET_ENDPOINTS.length)],
    payload: payloadObj.payload,
    vulnerabilityType: vulnerabilityType,
    attackComplexity: attackComplexity,
    success: success,
    dataExposed: exposedData,
    severity: severity,
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  simulateSQLInjection,
};
