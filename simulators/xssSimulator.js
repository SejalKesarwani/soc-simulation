const { generateRandomIP } = require('../utils/generators');

/**
 * XSS payload templates for different attack types
 */
const XSS_PAYLOADS = [
  { payload: "<script>alert('XSS')</script>", type: 'Stored' },
  { payload: '<img src=x onerror=alert(1)>', type: 'Reflected' },
  { payload: "<iframe src=javascript:alert('XSS')></iframe>", type: 'DOM-based' },
  { payload: "'-alert(1)-'", type: 'Reflected' },
];

/**
 * Vulnerable endpoints that can be targeted
 */
const VULNERABLE_ENDPOINTS = ['/search', '/comments', '/profile', '/dashboard'];

/**
 * Possible impacts from successful XSS attacks
 */
const XSS_IMPACTS = ['Cookie theft', 'Session hijacking', 'Defacement', 'Redirection'];

/**
 * Calculates severity based on XSS type and impact
 * @param {string} type - XSS type (Stored, Reflected, DOM-based)
 * @param {string} impact - Impact type
 * @returns {string} Severity level (Low, Medium, High, Critical)
 */
function calculateSeverity(type, impact) {
  // Base severity by type
  let baseSeverity = 0;

  if (type === 'Stored') {
    // Stored XSS is most dangerous as it affects all users
    baseSeverity = 3;
  } else if (type === 'DOM-based') {
    // DOM-based is dangerous
    baseSeverity = 2;
  } else if (type === 'Reflected') {
    // Reflected is less dangerous as it requires user interaction
    baseSeverity = 1;
  }

  // Increase severity based on impact
  if (impact === 'Session hijacking' || impact === 'Cookie theft') {
    baseSeverity += 2;
  } else if (impact === 'Defacement' || impact === 'Redirection') {
    baseSeverity += 1;
  }

  if (baseSeverity <= 2) return 'Low';
  if (baseSeverity <= 3) return 'Medium';
  if (baseSeverity <= 4) return 'High';
  return 'Critical';
}

/**
 * Generates a target URL with injected XSS payload
 * @param {string} endpoint - Target endpoint
 * @param {string} payload - XSS payload
 * @returns {string} Target URL with encoded payload
 */
function generateTargetURLWithPayload(endpoint, payload) {
  // In real scenarios, payloads would be URL-encoded
  // For simulation, we'll show the injection point
  const encodedPayload = encodeURIComponent(payload);
  return `http://vulnerable-app.com${endpoint}?input=${encodedPayload}`;
}

/**
 * Simulates a Cross-Site Scripting (XSS) attack
 * @returns {Object} XSS attack object with all simulation data
 */
function simulateXSSAttack() {
  // Determine if attack is successful (40% success, 60% failure due to input validation)
  const success = Math.random() < 0.4;

  // Select random payload and vulnerable endpoint
  const payloadObj = XSS_PAYLOADS[Math.floor(Math.random() * XSS_PAYLOADS.length)];
  const targetEndpoint = VULNERABLE_ENDPOINTS[Math.floor(Math.random() * VULNERABLE_ENDPOINTS.length)];

  // Select impact (only relevant if attack succeeds)
  const impact = XSS_IMPACTS[Math.floor(Math.random() * XSS_IMPACTS.length)];

  // Generate target URL with payload
  const targetURL = generateTargetURLWithPayload(targetEndpoint, payloadObj.payload);

  // Calculate severity
  const severity = calculateSeverity(payloadObj.type, success ? impact : 'None');

  return {
    sourceIP: generateRandomIP(),
    targetEndpoint: targetEndpoint,
    targetURL: targetURL,
    payload: payloadObj.payload,
    xssType: payloadObj.type,
    success: success,
    impact: success ? impact : null,
    severity: severity,
    inputValidationBypassed: success,
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  simulateXSSAttack,
};
