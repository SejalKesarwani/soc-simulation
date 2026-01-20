import clsx from 'classnames';

function Badge({ severity }) {
  const base = 'px-2 py-1 rounded-full text-xs font-semibold';
  const color = {
    Critical: 'bg-alert/20 text-alert border border-alert/30',
    High: 'bg-orange-500/20 text-orange-200 border border-orange-400/40',
    Medium: 'bg-amber-500/20 text-amber-200 border border-amber-400/40',
    Low: 'bg-success/20 text-success border border-success/40',
  }[severity];
  return <span className={clsx(base, color)}>{severity}</span>;
}

function StatusPill({ status }) {
  const styles = {
    Investigating: 'bg-signal/20 text-signal border border-signal/40',
    Containment: 'bg-alert/20 text-alert border border-alert/40',
    Queued: 'bg-white/5 text-gray-200 border border-white/10',
    Closed: 'bg-success/20 text-success border border-success/40',
  }[status] || 'bg-white/5 text-gray-200 border border-white/10';

  return <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', styles)}>{status}</span>;
}

function AlertTable({ alerts }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 text-sm font-semibold">Recent Alerts</div>
      <div className="overflow-x-auto scroll-area">
        <table className="min-w-full text-sm text-gray-200">
          <thead className="bg-white/5 uppercase tracking-wide text-xs text-gray-400">
            <tr>
              <th className="text-left px-4 py-3">Alert ID</th>
              <th className="text-left px-4 py-3">Severity</th>
              <th className="text-left px-4 py-3">Source</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Time</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-xs">{alert.id}</td>
                <td className="px-4 py-3"><Badge severity={alert.severity} /></td>
                <td className="px-4 py-3">{alert.source}</td>
                <td className="px-4 py-3">{alert.category}</td>
                <td className="px-4 py-3 text-gray-400">{alert.time}</td>
                <td className="px-4 py-3"><StatusPill status={alert.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlertTable;
