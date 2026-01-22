const { simulateDDoSAttack } = require('./ddosSimulator');
const { simulatePhishingAttack } = require('./phishingSimulator');
const { simulateMalwareAttack } = require('./malwareSimulator');
const { simulateSQLInjection } = require('./sqlInjectionSimulator');
const { simulateXSSAttack } = require('./xssSimulator');

/**
 * Generates a random incident ID in format INC-XXXXXX
 * @returns {string} Incident ID
 */
function generateIncidentId() {
  const randomNum = Math.floor(Math.random() * 999999)
    .toString()
    .padStart(6, '0');
  return `INC-${randomNum}`;
}

/**
 * Randomly selects and simulates an attack based on weighted distribution
 * Weights: DDoS=30%, Phishing=25%, Malware=20%, SQLInjection=15%, XSS=10%
 * @returns {Object} Attack object with attackType and incidentId
 */
function generateRandomAttack() {
  const random = Math.random();
  let attackType;
  let simulationFunction;

  // Weighted distribution
  if (random < 0.3) {
    attackType = 'DDoS';
    simulationFunction = simulateDDoSAttack;
  } else if (random < 0.55) {
    // 0.3 + 0.25 = 0.55
    attackType = 'Phishing';
    simulationFunction = simulatePhishingAttack;
  } else if (random < 0.75) {
    // 0.55 + 0.20 = 0.75
    attackType = 'Malware';
    simulationFunction = simulateMalwareAttack;
  } else if (random < 0.9) {
    // 0.75 + 0.15 = 0.9
    attackType = 'SQLInjection';
    simulationFunction = simulateSQLInjection;
  } else {
    // 0.9 + 0.10 = 1.0
    attackType = 'XSS';
    simulationFunction = simulateXSSAttack;
  }

  // Call the appropriate simulator function
  const attackData = simulationFunction();

  // Add attackType and incidentId to the returned object
  return {
    incidentId: generateIncidentId(),
    attackType: attackType,
    ...attackData,
  };
}

module.exports = {
  generateRandomAttack,
};
