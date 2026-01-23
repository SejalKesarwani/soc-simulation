export const stats = [
  {
    label: 'Active Alerts',
    value: 124,
    change: '+12% vs last 24h',
    tone: 'alert',
  },
  {
    label: 'Open Incidents',
    value: 37,
    change: '-5% vs last 24h',
    tone: 'signal',
  },
  {
    label: 'Avg. Response Time',
    value: '7m 42s',
    change: '+9% slower',
    tone: 'warn',
  },
  {
    label: 'Patch Coverage',
    value: '92%',
    change: '+2% vs last week',
    tone: 'success',
  },
];

export const recentAlerts = [
  {
    id: 'ALT-9821',
    severity: 'High',
    source: 'EDR - Workstation 22',
    category: 'Malware',
    time: '5m ago',
    status: 'Investigating',
  },
  {
    id: 'ALT-9819',
    severity: 'Medium',
    source: 'Firewall - Branch 3',
    category: 'Port Scan',
    time: '17m ago',
    status: 'Queued',
  },
  {
    id: 'ALT-9815',
    severity: 'Critical',
    source: 'SIEM - Core',
    category: 'Privileged Access',
    time: '26m ago',
    status: 'Containment',
  },
  {
    id: 'ALT-9808',
    severity: 'Low',
    source: 'Email Gateway',
    category: 'Phishing',
    time: '48m ago',
    status: 'Closed',
  },
];
