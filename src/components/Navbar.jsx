import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Incidents', path: '/incidents' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Settings', path: '/settings' },
];

const navLinkClasses = ({ isActive }) =>
  [
    'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
    isActive ? 'bg-[#1e40af] text-white shadow-sm shadow-blue-900/30' : 'text-gray-300 hover:text-white hover:bg-white/5',
  ].join(' ');

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((open) => !open);
  const closeMobile = () => setMobileOpen(false);
  const toggleProfile = () => setProfileOpen((open) => !open);

  return (
    <header className="bg-gray-900 border-b border-white/5 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-lg font-semibold tracking-tight text-white">SOC Dashboard</div>
            <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} className={navLinkClasses} onClick={closeMobile}>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-300 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              aria-label="Notifications"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.172V11a6 6 0 1 0-12 0v3.172a2 2 0 0 1-.6 1.428L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9"
                />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                3
              </span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={toggleProfile}
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1e40af] text-xs font-semibold uppercase">AM</span>
                <span className="hidden sm:inline">Alex Morgan</span>
                <svg className="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {profileOpen ? (
                <div className="absolute right-0 mt-2 w-44 rounded-lg border border-white/10 bg-gray-800 shadow-xl shadow-black/30" role="menu">
                  <button className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-white/5" role="menuitem">
                    Profile
                  </button>
                  <button className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-white/5" role="menuitem">
                    Settings
                  </button>
                  <div className="h-px bg-white/10" />
                  <button className="block w-full px-4 py-2 text-left text-sm text-red-300 hover:bg-white/5" role="menuitem">
                    Logout
                  </button>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              onClick={toggleMobile}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="md:hidden pb-4" aria-label="Mobile navigation">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'bg-[#1e40af] text-white' : 'text-gray-300 hover:text-white hover:bg-white/5',
                    ].join(' ')
                  }
                  onClick={closeMobile}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Navbar;
