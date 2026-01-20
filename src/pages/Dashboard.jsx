import AlertTable from '../components/AlertTable.jsx';
import StatCard from '../components/StatCard.jsx';
import { recentAlerts, stats } from '../utils/mockData.js';

function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <AlertTable alerts={recentAlerts} />
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-4 h-full">
          <div className="text-sm font-semibold mb-2">SOC Health</div>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center justify-between">
              <span>Log Ingestion</span>
              <span className="text-success">Operational</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Detection Pipelines</span>
              <span className="text-signal">Degraded</span>
            </li>
            <li className="flex items-center justify-between">
              <span>SOAR Actions</span>
              <span className="text-success">Healthy</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Threat Intel Feeds</span>
              <span className="text-amber-300">Delayed</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
