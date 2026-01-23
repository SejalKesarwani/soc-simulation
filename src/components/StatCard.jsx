import clsx from 'classnames';

function StatCard({ label, value, change, tone = 'signal' }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-4 shadow-lg shadow-black/20">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-2xl font-semibold">{value}</div>
        <span
          className={clsx('text-xs font-medium px-2 py-1 rounded-full', {
            'bg-alert/10 text-alert': tone === 'alert',
            'bg-success/10 text-success': tone === 'success',
            'bg-signal/10 text-signal': tone === 'signal',
            'bg-amber-500/10 text-amber-300': tone === 'warn',
          })}
        >
          {change}
        </span>
      </div>
    </div>
  );
}

export default StatCard;
