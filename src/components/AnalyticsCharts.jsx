import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const incidentsByHour = [
  { hour: '00:00', count: 12 },
  { hour: '02:00', count: 9 },
  { hour: '04:00', count: 7 },
  { hour: '06:00', count: 11 },
  { hour: '08:00', count: 18 },
  { hour: '10:00', count: 24 },
  { hour: '12:00', count: 21 },
  { hour: '14:00', count: 26 },
  { hour: '16:00', count: 30 },
  { hour: '18:00', count: 28 },
  { hour: '20:00', count: 22 },
  { hour: '22:00', count: 15 },
];

const attackTypeDistribution = [
  { name: 'DDoS', value: 28 },
  { name: 'Phishing', value: 22 },
  { name: 'Malware', value: 26 },
  { name: 'SQL Injection', value: 14 },
  { name: 'XSS', value: 10 },
];

const severityLevels = [
  { severity: 'Low', count: 18 },
  { severity: 'Medium', count: 32 },
  { severity: 'High', count: 24 },
  { severity: 'Critical', count: 12 },
];

const PIE_COLORS = ['#60a5fa', '#a855f7', '#22d3ee', '#f472b6', '#c084fc'];

function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-4 shadow-lg shadow-black/20">
        <div className="mb-3 flex items-center justify-between text-sm text-gray-200">
          <span className="font-semibold">Incidents (Last 24h)</span>
          <span className="text-gray-400">per hour</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incidentsByHour} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="hour" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '0.5rem' }} />
              <Legend verticalAlign="top" height={30} iconSize={12} wrapperStyle={{ color: '#e5e7eb' }} />
              <Line type="monotone" dataKey="count" name="Incidents" stroke="#60a5fa" strokeWidth={2.4} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-4 shadow-lg shadow-black/20">
        <div className="mb-3 flex items-center justify-between text-sm text-gray-200">
          <span className="font-semibold">Attack Type Distribution</span>
          <span className="text-gray-400">last 24h</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attackTypeDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {attackTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '0.5rem' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#e5e7eb', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-2 rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-4 shadow-lg shadow-black/20">
        <div className="mb-3 flex items-center justify-between text-sm text-gray-200">
          <span className="font-semibold">Severity Levels</span>
          <span className="text-gray-400">open incidents</span>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityLevels} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="severity" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '0.5rem' }} />
              <Legend verticalAlign="top" height={30} iconSize={12} wrapperStyle={{ color: '#e5e7eb' }} />
              <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]}>
                <Cell fill="#34d399" />
                <Cell fill="#fbbf24" />
                <Cell fill="#fb923c" />
                <Cell fill="#f87171" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCharts;
