// =============================================================================
// SECTION: DashboardShell — Shared Layout Wrapper
// Every inner page (Log, Insights, Goals, Community, Learn) uses this shell
// to get the Sidebar + MobileBottomNav + consistent main content padding.
// Just wrap any page content with <DashboardShell> and it handles layout.
// =============================================================================

import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';

export default function DashboardShell({ children }) {
  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <Sidebar />
      <MobileBottomNav />
      <main
        className="md:ml-64 p-4 md:p-8 pb-24 md:pb-8 min-h-screen"
        id="main-content"
      >
        {children}
      </main>
    </div>
  );
}
