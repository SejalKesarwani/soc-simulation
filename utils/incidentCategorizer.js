/**
 * Category mappings for each attack type
 */
const CATEGORY_MAPPING = {
  'DDoS': {
    categories: ['Network Attack', 'Availability'],
    mitreId: 'T1499',
    mitreName: 'Endpoint Denial of Service',
  },
  'Phishing': {
    categories: ['Social Engineering', 'Credential Theft'],
    mitreId: 'T1566',
    mitreName: 'Phishing',
  },
  'Malware': {
    categories: ['Application Attack', 'Data Integrity'],
    mitreId: 'T1204',
    mitreName: 'User Execution',
  },
  'SQLInjection': {
    categories: ['Application Attack', 'Data Breach'],
    mitreId: 'T1190',
    mitreName: 'Exploit Public-Facing Application',
  },
  'XSS': {
    categories: ['Web Attack', 'Client-side'],
    mitreId: 'T1189',
    mitreName: 'Drive-by Compromise',
  },
};

/**
 * Mitigation strategies for each attack type
 */
const MITIGATION_MAPPING = {
  'DDoS': [
    'Enable DDoS protection services',
    'Configure rate limiting on network devices',
    'Implement traffic filtering and blocking rules',
    'Scale infrastructure to handle traffic spikes',
    'Use CDN services to absorb attacks',
    'Monitor network bandwidth and traffic patterns',
  ],
  'Phishing': [
    'Conduct user security awareness training',
    'Implement email filtering and authentication (SPF, DKIM, DMARC)',
    'Deploy advanced threat protection on email',
    'Enable multi-factor authentication (MFA)',
    'Monitor for suspicious email patterns',
    'Create clear incident reporting procedures',
  ],
  'Malware': [
    'Update and patch all systems regularly',
    'Deploy endpoint protection software',
    'Implement application whitelisting',
    'Monitor process execution and network connections',
    'Isolate infected systems immediately',
    'Perform forensic analysis on compromised systems',
    'Review and update security policies',
  ],
  'SQLInjection': [
    'Use parameterized queries and prepared statements',
    'Implement input validation and sanitization',
    'Apply principle of least privilege to database accounts',
    'Use Web Application Firewalls (WAF)',
    'Encrypt sensitive data in databases',
    'Regular security code reviews and testing',
    'Monitor database query logs for suspicious patterns',
  ],
  'XSS': [
    'Implement Content Security Policy (CSP) headers',
    'Use output encoding and escaping for all user input',
    'Validate and sanitize all user inputs',
    'Use secure JavaScript libraries and frameworks',
    'Deploy Web Application Firewalls (WAF)',
    'Regular security testing and code reviews',
    'Keep all client-side libraries updated',
  ],
};

/**
 * Categorizes a security incident based on its attack type
 * @param {Object} incident - Incident object with attackType and other data
 * @returns {Object} Categorized incident object with categories, mitreId, and mitigation steps
 */
function categorizeIncident(incident) {
  const attackType = incident.attackType || 'Unknown';

  // Get mapping for this attack type, default to generic if not found
  const mapping = CATEGORY_MAPPING[attackType] || {
    categories: ['Unknown Attack'],
    mitreId: 'Unknown',
    mitreName: 'Unknown',
  };

  // Get mitigation steps for this attack type
  const mitigation = MITIGATION_MAPPING[attackType] || [
    'Isolate affected systems',
    'Analyze attack patterns',
    'Document incident details',
  ];

  return {
    incidentId: incident.incidentId,
    attackType: attackType,
    categories: mapping.categories,
    mitreAttack: {
      id: mapping.mitreId,
      name: mapping.mitreName,
    },
    mitigation: mitigation,
    severity: incident.severity || 'Unknown',
    timestamp: incident.timestamp || new Date().toISOString(),
  };
}

module.exports = {
  categorizeIncident,
};
