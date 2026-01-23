/**
 * Impact assessment levels
 */
const IMPACT_LEVELS = {
  'Critical': 'Systems are completely unavailable or compromised',
  'High': 'Significant degradation of services or major data exposure',
  'Medium': 'Moderate impact on services or sensitive data at risk',
  'Low': 'Minimal impact with limited data exposure',
};

/**
 * Maps attack types to common attack vectors
 */
const ATTACK_VECTORS = {
  'DDoS': 'Network-based volumetric attack overwhelming server resources through distributed sources',
  'Phishing': 'Social engineering attack using deceptive emails to trick users into revealing credentials or executing malware',
  'Malware': 'Malicious software execution on systems to compromise integrity, confidentiality, or availability',
  'SQLInjection': 'Web application attack exploiting SQL query vulnerabilities to access unauthorized database information',
  'XSS': 'Web application attack injecting malicious scripts to steal user data or session tokens',
};

/**
 * Gets Indicators of Compromise based on attack type
 * @param {Object} incident - Incident object
 * @returns {Array} Array of IOCs
 */
function extractIOCs(incident) {
  const iocs = [];

  // Source IP is always an IOC
  if (incident.sourceIP) {
    iocs.push({
      type: 'IP Address',
      value: incident.sourceIP,
      severity: incident.severity,
    });
  }

  // Attack-specific IOCs
  switch (incident.attackType) {
    case 'Malware':
      if (incident.md5Hash) {
        iocs.push({
          type: 'MD5 Hash',
          value: incident.md5Hash,
          severity: 'Critical',
        });
      }
      if (incident.infectedFilePath) {
        iocs.push({
          type: 'File Path',
          value: incident.infectedFilePath,
          severity: incident.severity,
        });
      }
      break;

    case 'Phishing':
      if (incident.senderEmail) {
        iocs.push({
          type: 'Email Address',
          value: incident.senderEmail,
          severity: 'High',
        });
      }
      if (incident.targetEmail) {
        iocs.push({
          type: 'Target Email',
          value: incident.targetEmail,
          severity: 'Medium',
        });
      }
      break;

    case 'SQLInjection':
      if (incident.payload) {
        iocs.push({
          type: 'SQL Payload',
          value: incident.payload,
          severity: incident.severity,
        });
      }
      break;

    case 'XSS':
      if (incident.payload) {
        iocs.push({
          type: 'XSS Payload',
          value: incident.payload,
          severity: incident.severity,
        });
      }
      break;

    case 'DDoS':
      if (incident.targetURL) {
        iocs.push({
          type: 'Target URL',
          value: incident.targetURL,
          severity: incident.severity,
        });
      }
      break;
  }

  return iocs;
}

/**
 * Generates recommended actions based on attack type and severity
 * @param {Object} incident - Incident object
 * @returns {Object} Actions organized by timeframe
 */
function generateRecommendedActions(incident) {
  const immediate = [];
  const shortTerm = [];
  const longTerm = [];

  // Universal immediate actions
  immediate.push('Isolate affected systems from the network if not already done');
  immediate.push('Collect logs and forensic data for analysis');
  immediate.push('Document all findings and timeline');

  // Attack-specific actions
  switch (incident.attackType) {
    case 'DDoS':
      immediate.push('Enable DDoS mitigation rules on firewalls');
      immediate.push('Contact ISP to implement upstream filtering');
      shortTerm.push('Implement rate limiting on edge servers');
      shortTerm.push('Deploy CDN services for traffic distribution');
      longTerm.push('Establish comprehensive DDoS response plan');
      longTerm.push('Implement advanced threat detection systems');
      break;

    case 'Phishing':
      immediate.push('Alert all users about the phishing campaign');
      immediate.push('Block sender domain in email filters');
      shortTerm.push('Force password reset for potentially affected users');
      shortTerm.push('Enable MFA on all user accounts');
      longTerm.push('Implement email authentication (SPF, DKIM, DMARC)');
      longTerm.push('Conduct security awareness training');
      break;

    case 'Malware':
      immediate.push(`Quarantine infected systems: ${incident.infectedFilePath || 'See IOCs'}`);
      immediate.push(`Scan all systems for MD5: ${incident.md5Hash || 'See IOCs'}`);
      shortTerm.push('Update antivirus signatures');
      shortTerm.push('Patch all vulnerable systems');
      longTerm.push('Implement behavioral analysis and EDR solutions');
      longTerm.push('Establish regular patching schedule');
      break;

    case 'SQLInjection':
      immediate.push('Apply input validation patches immediately');
      immediate.push('Review database access logs');
      shortTerm.push('Implement parameterized queries throughout application');
      shortTerm.push('Deploy Web Application Firewall (WAF)');
      longTerm.push('Establish secure SDLC practices');
      longTerm.push('Conduct security code review');
      break;

    case 'XSS':
      immediate.push('Apply output encoding patches');
      immediate.push('Review affected web pages for malicious code');
      shortTerm.push('Implement Content Security Policy (CSP) headers');
      shortTerm.push('Deploy Web Application Firewall (WAF)');
      longTerm.push('Establish secure development training');
      longTerm.push('Implement automated security testing');
      break;
  }

  return {
    immediate,
    shortTerm,
    longTerm,
  };
}

/**
 * Generates impact assessment based on incident data
 * @param {Object} incident - Incident object
 * @returns {Object} Impact assessment details
 */
function generateImpactAssessment(incident) {
  let affectedSystems = 0;
  let dataExposedCount = 0;

  switch (incident.attackType) {
    case 'DDoS':
      affectedSystems = 1; // Servers under attack
      break;

    case 'Phishing':
      affectedSystems = 1; // Single target
      dataExposedCount = incident.successRate || 0;
      break;

    case 'Malware':
      affectedSystems = incident.infectedSystemsCount || 0;
      break;

    case 'SQLInjection':
      if (incident.dataExposed) {
        dataExposedCount = (incident.dataExposed.usernamesExposed || 0) +
          (incident.dataExposed.emailsExposed || 0) +
          (incident.dataExposed.passwordsCount || 0);
      }
      affectedSystems = 1; // Database server
      break;

    case 'XSS':
      if (incident.dataExposed) {
        dataExposedCount = (incident.dataExposed.usersAffected || 0);
      }
      affectedSystems = 1; // Web application
      break;
  }

  return {
    affectedSystems,
    dataExposedRecords: dataExposedCount,
    potentialDamage: IMPACT_LEVELS[incident.severity] || 'Unknown',
    estimatedRecoveryTime: incident.severity === 'Critical' ? '4-24 hours' : '1-8 hours',
  };
}

/**
 * Generates executive summary for the incident
 * @param {Object} incident - Incident object
 * @returns {string} Executive summary text
 */
function generateExecutiveSummary(incident) {
  const timeStr = new Date(incident.timestamp).toLocaleString();
  const impactLevel = IMPACT_LEVELS[incident.severity] || 'Unknown';

  return `A ${incident.attackType} attack was detected on ${timeStr} from source IP ${incident.sourceIP}. ` +
    `The attack targeted ${incident.targetURL || incident.targetEndpoint || 'critical systems'} with ${incident.severity} severity. ` +
    `${impactLevel}. ` +
    `Immediate investigation and remediation actions are recommended.`;
}

/**
 * Generates a comprehensive security incident report
 * @param {Object} incident - Main incident object
 * @param {Array} relatedIncidents - Array of related incidents
 * @returns {Object} Structured report object
 */
function generateAttackReport(incident, relatedIncidents = []) {
  if (!incident) {
    throw new Error('Incident object is required');
  }

  const report = {
    reportMetadata: {
      generated: new Date().toISOString(),
      reportId: `RPT-${incident.incidentId}-${Date.now()}`,
      version: '1.0',
    },

    executiveSummary: generateExecutiveSummary(incident),

    attackDetails: {
      incidentId: incident.incidentId,
      attackType: incident.attackType,
      severity: incident.severity,
      status: incident.status || 'Open',
      sourceIP: incident.sourceIP,
      targetURL: incident.targetURL || incident.targetEndpoint || 'N/A',
      timestamp: incident.timestamp,
      success: incident.success !== undefined ? incident.success : 'N/A',
      ...incident,
    },

    attackVector: {
      description: ATTACK_VECTORS[incident.attackType] || 'Unknown attack vector',
      vulnerabilityType: incident.vulnerabilityType || incident.xssType || incident.phishingType || 'N/A',
      attackComplexity: incident.attackComplexity || 'N/A',
    },

    timeline: relatedIncidents.length > 0 ? relatedIncidents.map((inc, index) => ({
      sequence: index + 1,
      timestamp: inc.timestamp,
      event: `${inc.attackType} attack from ${inc.sourceIP}`,
      severity: inc.severity,
    })) : [{
      sequence: 1,
      timestamp: incident.timestamp,
      event: `${incident.attackType} attack initiated`,
      severity: incident.severity,
    }],

    impactAssessment: generateImpactAssessment(incident),

    indicatorsOfCompromise: extractIOCs(incident),

    recommendedActions: generateRecommendedActions(incident),

    relatedIncidents: relatedIncidents.map(inc => ({
      incidentId: inc.incidentId,
      attackType: inc.attackType,
      timestamp: inc.timestamp,
      severity: inc.severity,
      sourceIP: inc.sourceIP,
    })),

    statistics: {
      totalRelatedIncidents: relatedIncidents.length,
      reportGeneratedAt: new Date().toISOString(),
    },
  };

  return report;
}

/**
 * Exports report to JSON format
 * @param {Object} report - Report object from generateAttackReport
 * @returns {string} JSON string representation
 */
function exportToJSON(report) {
  return JSON.stringify(report, null, 2);
}

/**
 * Exports report to Markdown format
 * @param {Object} report - Report object from generateAttackReport
 * @returns {string} Markdown formatted report
 */
function exportToMarkdown(report) {
  let markdown = '';

  // Header
  markdown += `# Security Incident Report\n\n`;
  markdown += `**Report ID:** ${report.reportMetadata.reportId}\n`;
  markdown += `**Generated:** ${report.reportMetadata.generated}\n\n`;

  // Executive Summary
  markdown += `## Executive Summary\n\n`;
  markdown += `${report.executiveSummary}\n\n`;

  // Attack Details
  markdown += `## Attack Details\n\n`;
  markdown += `| Field | Value |\n`;
  markdown += `|-------|-------|\n`;
  markdown += `| Incident ID | ${report.attackDetails.incidentId} |\n`;
  markdown += `| Attack Type | ${report.attackDetails.attackType} |\n`;
  markdown += `| Severity | ${report.attackDetails.severity} |\n`;
  markdown += `| Status | ${report.attackDetails.status} |\n`;
  markdown += `| Source IP | ${report.attackDetails.sourceIP} |\n`;
  markdown += `| Target | ${report.attackDetails.targetURL} |\n`;
  markdown += `| Timestamp | ${report.attackDetails.timestamp} |\n`;
  markdown += `| Success | ${report.attackDetails.success} |\n\n`;

  // Attack Vector
  markdown += `## Attack Vector\n\n`;
  markdown += `**Description:** ${report.attackVector.description}\n\n`;
  markdown += `**Vulnerability Type:** ${report.attackVector.vulnerabilityType}\n\n`;
  markdown += `**Attack Complexity:** ${report.attackVector.attackComplexity}\n\n`;

  // Timeline
  markdown += `## Timeline\n\n`;
  report.timeline.forEach(entry => {
    markdown += `${entry.sequence}. **${new Date(entry.timestamp).toLocaleString()}** - ${entry.event} (${entry.severity})\n`;
  });
  markdown += `\n`;

  // Impact Assessment
  markdown += `## Impact Assessment\n\n`;
  markdown += `- **Affected Systems:** ${report.impactAssessment.affectedSystems}\n`;
  markdown += `- **Data Exposed:** ${report.impactAssessment.dataExposedRecords} records\n`;
  markdown += `- **Potential Damage:** ${report.impactAssessment.potentialDamage}\n`;
  markdown += `- **Estimated Recovery Time:** ${report.impactAssessment.estimatedRecoveryTime}\n\n`;

  // Indicators of Compromise
  markdown += `## Indicators of Compromise (IOCs)\n\n`;
  if (report.indicatorsOfCompromise.length > 0) {
    markdown += `| Type | Value | Severity |\n`;
    markdown += `|------|-------|----------|\n`;
    report.indicatorsOfCompromise.forEach(ioc => {
      markdown += `| ${ioc.type} | ${ioc.value} | ${ioc.severity} |\n`;
    });
  } else {
    markdown += `No indicators of compromise identified.\n`;
  }
  markdown += `\n`;

  // Recommended Actions
  markdown += `## Recommended Actions\n\n`;
  markdown += `### Immediate Actions\n`;
  report.recommendedActions.immediate.forEach(action => {
    markdown += `- ${action}\n`;
  });
  markdown += `\n`;

  markdown += `### Short-Term Actions (1-7 days)\n`;
  report.recommendedActions.shortTerm.forEach(action => {
    markdown += `- ${action}\n`;
  });
  markdown += `\n`;

  markdown += `### Long-Term Actions (1-3 months)\n`;
  report.recommendedActions.longTerm.forEach(action => {
    markdown += `- ${action}\n`;
  });
  markdown += `\n`;

  // Related Incidents
  if (report.relatedIncidents.length > 0) {
    markdown += `## Related Incidents\n\n`;
    markdown += `| Incident ID | Type | Timestamp | Severity |\n`;
    markdown += `|-------------|------|-----------|----------|\n`;
    report.relatedIncidents.forEach(inc => {
      markdown += `| ${inc.incidentId} | ${inc.attackType} | ${inc.timestamp} | ${inc.severity} |\n`;
    });
    markdown += `\n`;
  }

  return markdown;
}

module.exports = {
  generateAttackReport,
  exportToJSON,
  exportToMarkdown,
};
