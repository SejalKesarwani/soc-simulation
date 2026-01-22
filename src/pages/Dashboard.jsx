import StatsCard from '../components/StatsCard.jsx';
import IncidentCard from '../components/IncidentCard.jsx';
import AnalyticsCharts from '../components/AnalyticsCharts.jsx';
import { AlertTriangle, Shield, CheckCircle, Activity } from 'lucide-react';
import { mockIncidents } from '../utils/mockIncidents.js';

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

function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Analytics</h2>
        <AnalyticsCharts />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Incidents</h2>
        {mockIncidents.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-gray-300">
            No incidents found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                id={incident.id}
                attackType={incident.attackType}
                severity={incident.severity}
                sourceIP={incident.sourceIP}
                target={incident.target}
                timestamp={incident.timestamp}
                status={incident.status}
                description={incident.description}
                onViewDetails={() => console.log('View details for', incident.id)}
                onMarkResolved={() => console.log('Mark resolved', incident.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
