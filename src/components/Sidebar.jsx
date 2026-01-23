import { NavLink } from 'react-router-dom';
import { navLinks } from '../utils/navLinks.js';

const linkClasses = ({ isActive }) =>
  [
    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150',
    isActive ? 'bg-signal/10 text-white border border-signal/40' : 'text-gray-300 hover:text-white hover:bg-white/5',
  ].join(' ');

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate px-4 py-6 border-r border-white/5">
      <div className="mb-8">
        <div className="text-lg font-semibold">SOC Console</div>
        <div className="text-xs text-gray-400">Security Operations Center</div>
      </div>
      <nav className="space-y-2">
        {navLinks.map((link) => (
          <NavLink key={link.path} to={link.path} className={linkClasses}>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
