import { TrendingUp, TrendingDown } from 'lucide-react';

function StatsCard({ icon: Icon, title, value, trend, trendValue }) {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  const borderColor = isPositive ? 'border-green-500/30' : isNegative ? 'border-red-500/30' : 'border-white/10';
  const trendColor = isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400';
  const trendBgColor = isPositive ? 'bg-green-500/10' : isNegative ? 'bg-red-500/10' : 'bg-gray-500/10';

  return (
    <div
      className={[
        'relative overflow-hidden rounded-lg sm:rounded-xl border-2 bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 shadow-lg shadow-black/20',
        'transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/30',
        borderColor,
      ].join(' ')}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            {Icon && (
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-[#1e40af]/20 text-[#1e40af]">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              </div>
            )}
            <h3 className="text-xs sm:text-sm font-medium text-gray-400">{title}</h3>
          </div>
          <div className="mb-2 sm:mb-3">
            <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
          </div>
          {trend && trendValue && (
            <div className={['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', trendBgColor, trendColor].join(' ')}>
              {isPositive && <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />}
              {isNegative && <TrendingDown className="h-3.5 w-3.5" strokeWidth={2.5} />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
    </div>
  );
}

export default StatsCard;
