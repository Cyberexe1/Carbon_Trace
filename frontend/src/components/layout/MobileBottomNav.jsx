// =============================================================================
// SECTION: MobileBottomNav — Dashboard Layout (Mobile)
// Fixed bottom tab bar shown only on screens below md breakpoint.
// Uses navigate() so all real routes work properly.
// =============================================================================

import { useLocation, useNavigate } from 'react-router-dom';
import MaterialIcon from '../atoms/MaterialIcon';
import { MOBILE_NAV_ITEMS } from '../../utils/constants';

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#bdcaba] flex justify-around items-center h-16 z-50"
      aria-label="Mobile bottom navigation"
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 px-2 transition-colors ${
              isActive ? 'text-[#006b2c]' : 'text-[#3e4a3d]'
            }`}
          >
            <MaterialIcon name={item.icon} fill={isActive ? 1 : 0} className="text-2xl" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
