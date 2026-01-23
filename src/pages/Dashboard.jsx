import { useState, useEffect } from 'react';
import axios from 'axios';
import StatsCard from '../components/StatsCard.jsx';
import IncidentCard from '../components/IncidentCard.jsx';
import AnalyticsCharts from '../components/AnalyticsCharts.jsx';
import { AlertTriangle, Shield, CheckCircle, Activity, Loader } from 'lucide-react';

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
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5001/api/incidents');
        setIncidents(response.data.incidents || response.data || []);
      } catch (err) {
        console.error('Error fetching incidents:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch incidents');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 px-3 sm:px-4 md:px-6 lg:px-8 py-4">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </section>

      <section>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Analytics</h2>
        <AnalyticsCharts />
      </section>

      <section>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Recent Incidents</h2>
        
        {loading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center">
            <Loader className="h-8 w-8 text-blue-500 animate-spin mb-3" />
            <p className="text-gray-400">Loading incidents...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-semibold mb-1">Error Loading Incidents</h3>
                <p className="text-red-300/80 text-sm">{error}</p>
                <p className="text-gray-400 text-xs mt-2">Make sure the backend server is running on port 5000</p>
              </div>
            </div>
          </div>
        ) : incidents.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-gray-300">
            No incidents found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {incidents.map((incident) => (
              <IncidentCard
                key={incident._id || incident.id}
                id={incident._id || incident.id}
                attackType={incident.attackType}
                severity={incident.severity}
                sourceIP={incident.sourceIP}
                target={incident.target}
                timestamp={incident.timestamp}
                status={incident.status}
                description={incident.description}
                onViewDetails={() => console.log('View details for', incident._id || incident.id)}
                onMarkResolved={() => console.log('Mark resolved', incident._id || incident.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
