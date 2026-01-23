/**
 * Generates a fake suspicious sender email
 * @returns {string} Fake email address
 */
function generateFakeSenderEmail() {
  const suspiciousDomains = [
    'secure-verify.com',
    'account-confirm.net',
    'verify-identity.io',
    'security-alert.co',
    'urgent-support.com',
    'claims-notification.org',
    'delivery-confirm.net',
    'banking-update.io',
  ];
  const usernames = [
    'noreply',
    'admin',
    'support',
    'security',
    'verify',
    'alert',
    'notification',
    'system',
  ];

  const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
  const randomDomain = suspiciousDomains[Math.floor(Math.random() * suspiciousDomains.length)];

  return `${randomUsername}@${randomDomain}`;
}

/**
 * Generates a target company email
 * @returns {string} Company email address
 */
function generateTargetEmail() {
  const companyDomains = [
    '@company.com',
    '@enterprise.io',
    '@corporate.net',
    '@business.org',
    '@organization.com',
    '@firm.io',
  ];
  const usernames = [
    'john.doe',
    'jane.smith',
    'employee',
    'user',
    'staff',
    'member',
    'account',
    'person',
  ];

  const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
  const randomDomain = companyDomains[Math.floor(Math.random() * companyDomains.length)];

  return `${randomUsername}${randomDomain}`;
}

/**
 * Calculates severity based on phishing type and success rate
 * @param {string} type - Phishing type
 * @param {number} successRate - Success rate percentage
 * @returns {string} Severity level
 */
function calculateSeverity(type, successRate) {
  let baseSeverity = 0;

  // Type-based severity
  if (type === 'Credential Theft') baseSeverity = 3;
  else if (type === 'Malware Attachment') baseSeverity = 4;
  else if (type === 'Fake Link') baseSeverity = 2;

  // Success rate multiplier
  if (successRate >= 50) baseSeverity += 2;
  else if (successRate >= 30) baseSeverity += 1;

  if (baseSeverity <= 2) return 'Low';
  if (baseSeverity <= 4) return 'Medium';
  if (baseSeverity <= 5) return 'High';
  return 'Critical';
}

/**
 * Generates a simulated phishing attack with random parameters
 * @returns {Object} Phishing attack object with all simulation data
 */
function simulatePhishingAttack() {
  const phishingSubjects = [
    'Urgent: Account Verification Required',
    'Your package delivery failed',
    'Security Alert: Confirm your identity',
    'Action Required: Update your payment method',
    'Suspicious activity on your account',
    'Verify your account immediately',
    'Click here to confirm your credentials',
    'Important: Confirm your email address',
    'Your account has been compromised',
    'Update required for your banking app',
    'Unusual login attempt detected',
    'Claim your reward now',
  ];

  const phishingTypes = ['Credential Theft', 'Malware Attachment', 'Fake Link'];

  // Determine success rate based on category
  const successCategory = Math.random();
  let successRate;
  if (successCategory < 0.5) {
    // Low: 10%
    successRate = Math.floor(Math.random() * 10) + 1;
  } else if (successCategory < 0.75) {
    // Medium: 30%
    successRate = Math.floor(Math.random() * 20) + 20;
  } else {
    // High: 60%
    successRate = Math.floor(Math.random() * 40) + 50;
  }

  const phishingType = phishingTypes[Math.floor(Math.random() * phishingTypes.length)];

  return {
    senderEmail: generateFakeSenderEmail(),
    targetEmail: generateTargetEmail(),
    subject: phishingSubjects[Math.floor(Math.random() * phishingSubjects.length)],
    phishingType: phishingType,
    successRate: successRate,
    severity: calculateSeverity(phishingType, successRate),
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  simulatePhishingAttack,
};
