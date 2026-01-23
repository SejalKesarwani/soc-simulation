import { useLocation } from 'react-router-dom';

function Topbar() {
  const location = useLocation();
  const path = location.pathname === '/' ? '/dashboard' : location.pathname;
  const title = path
    .replace('/', '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-slate/80 backdrop-blur border-b border-white/5 px-6 py-4">
      <div className="font-semibold text-lg">{title || 'Dashboard'}</div>
      <div className="flex items-center gap-3">
        <input
          type="search"
          placeholder="Search alerts, assets, users..."
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-signal/60"
        />
        <div className="w-9 h-9 rounded-full bg-signal/20 border border-signal/60 grid place-items-center text-sm font-semibold">
          SOC
        </div>
      </div>
    </header>
  );
}

export default Topbar;
