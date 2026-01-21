import StatsCard from '../components/StatsCard.jsx';
import { AlertTriangle, Shield, CheckCircle, Activity } from 'lucide-react';

const statsData = [
  {
    icon: Activity,
    title: 'Total Incidents',
    value: '1,234',
    trend: 'up',
    trendValue: '+12%',
  },
  {
    icon: AlertTriangle,
    title: 'Critical Threats',
    value: '23',
    trend: 'down',
    trendValue: '-5%',
  },
  {
    icon: CheckCircle,
    title: 'Resolved',
    value: '1,156',
    trend: 'up',
    trendValue: '+8%',
  },
  {
    icon: Shield,
    title: 'Active',
    value: '55',
    trend: 'up',
    trendValue: '+3%',
  },
];

const recentIncidents = [
  { id: 1, title: 'Malware detected on workstation-42', severity: 'Critical', time: '5m ago' },
  { id: 2, title: 'Unauthorized access attempt', severity: 'High', time: '12m ago' },
  { id: 3, title: 'Suspicious network traffic', severity: 'Medium', time: '28m ago' },
  { id: 4, title: 'Failed login attempts detected', severity: 'Low', time: '1h ago' },
  { id: 5, title: 'DDoS attack mitigated', severity: 'Critical', time: '2h ago' },
  { id: 6, title: 'Policy violation detected', severity: 'Medium', time: '3h ago' },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Incidents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentIncidents.map((incident) => (
            <div
              key={incident.id}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 p-4 shadow-lg shadow-black/20 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-xs font-semibold',
                    incident.severity === 'Critical' && 'bg-red-500/20 text-red-400 border border-red-500/30',
                    incident.severity === 'High' && 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
                    incident.severity === 'Medium' && 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
                    incident.severity === 'Low' && 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
                  ].join(' ')}
                >
                  {incident.severity}
                </span>
                <span className="text-xs text-gray-400">{incident.time}</span>
              </div>
              <h3 className="text-sm font-medium text-white">{incident.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
