const { generateRandomIP } = require('../utils/generators');

/**
 * Calculates severity level based on attack intensity
 * @param {number} intensity - Requests per second
 * @returns {string} Severity level (Low, Medium, High, Critical)
 */
function calculateSeverity(intensity) {
  if (intensity <= 500) return 'Low';
  if (intensity <= 1000) return 'Medium';
  if (intensity <= 5000) return 'High';
  return 'Critical';
}

/**
 * Generates a simulated DDoS attack with random parameters
 * @returns {Object} Attack object with all simulation data
 */
function simulateDDoSAttack() {
  const targetUrls = ['/api/login', '/api/dashboard', '/api/data'];
  const ports = [80, 443, 8080, 3000];
  
  // Generate attack intensity based on categories
  const intensityCategory = Math.random();
  let intensity;
  if (intensityCategory < 0.33) {
    // Low: 100-500
    intensity = Math.floor(Math.random() * 401) + 100;
  } else if (intensityCategory < 0.66) {
    // Medium: 501-1000
    intensity = Math.floor(Math.random() * 500) + 501;
  } else {
    // High: 1001-5000
    intensity = Math.floor(Math.random() * 4000) + 1001;
  }

  return {
    sourceIP: generateRandomIP(),
    targetURL: targetUrls[Math.floor(Math.random() * targetUrls.length)],
    attackIntensity: intensity,
    requestsPerSecond: intensity,
    severity: calculateSeverity(intensity),
    port: ports[Math.floor(Math.random() * ports.length)],
    duration: Math.floor(Math.random() * 56) + 5,
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  simulateDDoSAttack,
};
