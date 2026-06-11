// =============================================================================
// SECTION: Navbar — Landing Page Top Navigation
// Fixed top bar shown on the public landing page only.
// Hides the nav links on mobile and shows a hamburger placeholder.
// On scroll the shadow deepens slightly via a state toggle.
// =============================================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MaterialIcon from '../atoms/MaterialIcon';
import Button from '../atoms/Button';
import { ROUTES } from '../../utils/constants';

const NAV_LINKS = ['How It Works', 'Features', 'Community', 'Learn'];

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Deepen shadow once user scrolls past 20px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 w-full z-50 bg-[#f9f9ff] transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* --- Brand logo --- */}
        <div className="flex items-center gap-2">
          <MaterialIcon name="eco" fill={1} className="text-[#006b2c] text-3xl" />
          <span className="font-bold text-2xl text-[#006b2c] tracking-tight">CarbonTrace</span>
        </div>

        {/* --- Desktop nav links --- */}
        <div className="hidden md:flex gap-8" role="list">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[12px] font-medium text-[#3e4a3d] hover:text-[#006b2c] transition-colors uppercase tracking-widest"
              role="listitem"
            >
              {link}
            </a>
          ))}
        </div>

        {/* --- CTA buttons --- */}
        <div className="flex items-center gap-3">
          <button
            className="hidden md:block px-4 py-2 text-[#006b2c] font-semibold text-sm hover:opacity-80 transition-opacity"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Sign In
          </button>
          <Button onClick={() => navigate(ROUTES.LOGIN)}>
            Get Started Free
          </Button>
        </div>

      </div>
    </nav>
  );
}
