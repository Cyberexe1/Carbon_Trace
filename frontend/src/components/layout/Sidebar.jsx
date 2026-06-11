// =============================================================================
// SECTION: Sidebar — Dashboard Layout Navigation
// Fixed left sidebar (240px) for desktop.
// Highlights the active route item with a green pill background.
// Bottom section shows an upgrade nudge card and utility links.
// =============================================================================

import { useNavigate, useLocation } from 'react-router-dom';
import MaterialIcon from '../atoms/MaterialIcon';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS, ROUTES } from '../../utils/constants';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Handle sign-out and return to landing page
  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <aside
      className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 p-6 gap-4 border-r border-[#bdcaba] bg-[#f1f3ff] z-40"
      aria-label="Dashboard sidebar"
    >
      {/* --- Brand mark --- */}
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-2">
          <MaterialIcon name="eco" fill={1} className="text-[#006b2c] text-2xl" />
          <h1 className="font-bold text-lg text-[#006b2c]">CarbonTrace</h1>
        </div>
        <p className="text-[11px] font-medium text-[#3e4a3d] uppercase tracking-widest">
          Eco Dashboard
        </p>
      </div>

      {/* --- Navigation links --- */}
      <nav className="flex-grow flex flex-col gap-1" role="navigation" aria-label="Sidebar links">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-all text-[12px] font-medium uppercase tracking-wider w-full text-left ${
                isActive
                  ? 'bg-[#b1f2be] text-[#347047]'
                  : 'text-[#3e4a3d] hover:bg-[#e1e8fd]'
              }`}
            >
              <MaterialIcon
                name={item.icon}
                fill={isActive ? 1 : 0}
                className="text-xl"
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* --- Upgrade nudge card --- */}
      <div className="p-4 bg-[#00873a] rounded-xl text-[#f7fff2] mb-4">
        <p className="text-xs font-bold mb-1">Upgrade to Pro</p>
        <p className="text-[11px] opacity-90 leading-snug">
          Get detailed AI-driven climate impact reports.
        </p>
      </div>

      {/* --- Utility links --- */}
      <div className="flex flex-col gap-1">
        <button
          className="flex items-center gap-4 px-4 py-2 rounded-lg text-[#3e4a3d] hover:bg-[#e1e8fd] transition-all text-[12px] font-medium uppercase tracking-wider"
          aria-label="Settings"
        >
          <MaterialIcon name="settings" className="text-xl" />
          Settings
        </button>
        <button
          className="flex items-center gap-4 px-4 py-2 rounded-lg text-[#3e4a3d] hover:bg-[#e1e8fd] transition-all text-[12px] font-medium uppercase tracking-wider"
          aria-label="Help Center"
        >
          <MaterialIcon name="help" className="text-xl" />
          Help Center
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-2 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6] transition-all text-[12px] font-medium uppercase tracking-wider"
          aria-label="Sign out"
        >
          <MaterialIcon name="logout" className="text-xl" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
