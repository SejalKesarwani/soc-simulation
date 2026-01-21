import { Shield, Zap, Bug, Network, Clock, ChevronRight, CheckCircle } from 'lucide-react';

const attackTypeConfig = {
  DDoS: { icon: Zap, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  Phishing: { icon: Shield, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  Malware: { icon: Bug, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  'SQL Injection': { icon: Network, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
};

const severityConfig = {
  Low: 'bg-green-500/10 text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  High: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  Critical: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const statusConfig = {
  Active: 'bg-red-500/10 text-red-400 border-red-500/30',
  Investigating: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  Resolved: 'bg-green-500/10 text-green-400 border-green-500/30',
};

function IncidentCard({ attackType, severity, sourceIP, target, timestamp, status, id, onViewDetails, onMarkResolved }) {
  const attackConfig = attackTypeConfig[attackType] || { icon: Shield, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
  const AttackIcon = attackConfig.icon;

  const formatTimestamp = (ts) => {
    if (!ts) return 'unknown';
    const date = new Date(ts);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className={['flex items-center gap-1.5 rounded-full border px-2.5 py-1', attackConfig.color].join(' ')}>
            <AttackIcon className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="text-xs font-semibold">{attackType}</span>
          </div>
          <div className={['rounded-full border px-2.5 py-1', severityConfig[severity]].join(' ')}>
            <span className="text-xs font-semibold">{severity}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 font-medium">ID: {id}</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Source IP</div>
          <div className="font-mono text-sm text-gray-900">{sourceIP}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Target System</div>
          <div className="text-sm font-medium text-gray-900">{target}</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Clock className="h-3.5 w-3.5" strokeWidth={2} />
          <span>{formatTimestamp(timestamp)}</span>
        </div>
        <div className={['rounded-full border px-2.5 py-1', statusConfig[status]].join(' ')}>
          <span className="text-xs font-semibold">{status}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onViewDetails}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150"
        >
          View Details
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
        <button
          onClick={onMarkResolved}
          disabled={status === 'Resolved'}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-green-200 bg-green-50 py-2 px-3 text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Mark Resolved
          <CheckCircle className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default IncidentCard;
