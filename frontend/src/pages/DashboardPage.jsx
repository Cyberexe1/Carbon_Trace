// =============================================================================
// SECTION: DashboardPage
// Main authenticated view. Layout: Sidebar (desktop) + MobileBottomNav.
// Sections rendered in the main content area:
//   Header → Hero Score Widget → Stat Cards → Chart + Recommendations
//   → Goals → Community Challenge → Recent Activity
// =============================================================================

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import MaterialIcon from '../components/atoms/MaterialIcon';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';
import { useAuth } from '../context/AuthContext';
import { WEEKLY_CHART_DATA, EMISSION_CATEGORIES } from '../utils/constants';

// =============================================================================
// SECTION: DashboardHeader
// Greeting text + notification bell + user avatar.
// =============================================================================
function DashboardHeader({ name }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-bold text-[#141b2b]">
          {greeting}, {name} 👋
        </h2>
        <p className="text-sm text-[#3e4a3d]">
          Here is your carbon footprint overview for today.
        </p>
      </div>
      <div className="hidden md:flex items-center gap-3">
        <button
          className="relative p-2 rounded-full hover:bg-[#e9edff] transition-colors"
          aria-label="Notifications (2 unread)"
        >
          <MaterialIcon name="notifications" className="text-[#3e4a3d] text-2xl" />
          <span
            className="absolute top-1 right-1 w-4 h-4 bg-[#ba1a1a] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            2
          </span>
        </button>
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full bg-[#006b2c] text-white flex items-center justify-center font-bold"
          aria-label={`Avatar for ${name}`}
        >
          {name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}

// =============================================================================
// SECTION: HeroScoreWidget
// Large prominent card showing today's kg CO₂e score, status badge,
// comparison text, and an inline sparkline SVG.
// =============================================================================
function HeroScoreWidget() {
  return (
    <section
      className="bg-white rounded-xl p-6 shadow-sm border border-[#bdcaba]/30 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden"
      aria-label="Today's carbon footprint score"
    >
      {/* Decorative blob */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#006b2c]/5 rounded-full -translate-y-20 translate-x-20 blur-3xl pointer-events-none" />

      {/* Score + status */}
      <div className="flex-grow z-10">
        <p className="text-[11px] font-bold text-[#3e4a3d] uppercase tracking-widest mb-2">
          Today's Footprint
        </p>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-mono text-6xl font-bold text-[#141b2b]">8.4</span>
          <span className="text-xl text-[#3e4a3d] font-medium">kg CO₂e</span>
        </div>
        <Badge variant="amber" className="mb-3">
          <MaterialIcon name="warning" fill={1} className="text-xs" />
          Moderate
        </Badge>
        <p className="text-sm text-[#3e4a3d] max-w-sm leading-relaxed">
          You are 12% above your daily goal. Reducing red meat or taking the bus today could help
          bridge the gap.
        </p>
      </div>

      {/* Sparkline */}
      <div className="w-full md:w-64 z-10" aria-hidden="true">
        <p className="text-[10px] text-[#3e4a3d] mb-2 font-bold uppercase">7-Day Trend</p>
        <svg viewBox="0 0 200 80" className="w-full h-20">
          <defs>
            <linearGradient id="sparkGrad" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#006b2c" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#006b2c" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,55 Q30,40 60,50 T120,28 T180,38 T200,18"
            fill="none"
            stroke="#006b2c"
            strokeWidth="2.5"
          />
          <path
            d="M0,55 Q30,40 60,50 T120,28 T180,38 T200,18 V80 H0 Z"
            fill="url(#sparkGrad)"
          />
        </svg>
      </div>

      {/* Weekly / Monthly stats */}
      <div className="flex md:flex-col gap-6 md:gap-4 z-10 text-center md:text-right flex-shrink-0">
        {[{ label: 'This Week', value: '42 kg' }, { label: 'This Month', value: '156 kg' }, { label: 'vs. Avg', value: '↓ 38%', green: true }].map(
          (s) => (
            <div key={s.label}>
              <p className="text-[10px] text-[#3e4a3d] uppercase font-bold mb-0.5">{s.label}</p>
              <p
                className={`font-mono font-bold text-lg ${s.green ? 'text-[#006b2c]' : 'text-[#141b2b]'}`}
              >
                {s.value}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: StatCards
// 4 category stat cards — Transport, Diet, Energy, Streak.
// =============================================================================
function StatCards() {
  const stats = [
    {
      label: 'Transport',
      icon: 'commute',
      value: '3.2kg',
      change: '-2.4kg',
      changeType: 'bad',
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      label: 'Diet',
      icon: 'restaurant',
      value: '2.8kg',
      change: '+1.1kg',
      changeType: 'good',
      bg: 'bg-orange-50',
      color: 'text-orange-600',
    },
    {
      label: 'Energy',
      icon: 'bolt',
      value: '2.4kg',
      change: '+0.5kg',
      changeType: 'good',
      bg: 'bg-yellow-50',
      color: 'text-yellow-600',
    },
    {
      label: 'Streak',
      icon: 'local_fire_department',
      value: 'Day 12',
      change: 'On Track',
      changeType: 'neutral',
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list" aria-label="Category stats">
      {stats.map((s) => (
        <article
          key={s.label}
          className="bg-white p-5 rounded-xl shadow-sm border border-[#bdcaba]/20 hover:scale-[1.02] transition-transform"
          role="listitem"
        >
          <div className="flex justify-between items-start mb-3">
            <span className={`p-2 ${s.bg} ${s.color} rounded-lg`}>
              <MaterialIcon name={s.icon} className="text-xl" />
            </span>
            <span
              className={`font-bold text-xs ${
                s.changeType === 'bad'
                  ? 'text-[#ba1a1a]'
                  : s.changeType === 'good'
                  ? 'text-[#006b2c]'
                  : 'text-[#006b2c]'
              }`}
            >
              {s.change}
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#3e4a3d] uppercase tracking-wider mb-1">
            {s.label}
          </p>
          <p className="font-mono font-bold text-lg text-[#141b2b]">
            {s.value}{' '}
            <span className="text-xs text-[#3e4a3d] font-normal">today</span>
          </p>
        </article>
      ))}
    </div>
  );
}

// =============================================================================
// SECTION: WeeklyChart
// Recharts BarChart showing Mon–Sun carbon vs. a goal reference line.
// Saturday bar is highlighted amber to show the high-emission day.
// =============================================================================
function WeeklyChart() {
  const GOAL = 50; // goal line in %

  return (
    <section
      className="bg-white p-6 rounded-xl shadow-sm border border-[#bdcaba]/30"
      aria-labelledby="chart-heading"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 id="chart-heading" className="text-lg font-semibold text-[#141b2b]">
          Weekly Emissions vs Goal
        </h3>
        <div className="flex gap-4 text-[10px] font-bold uppercase">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#006b2c] inline-block" aria-hidden="true" />
            Actual
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#bdcaba] inline-block" aria-hidden="true" />
            Goal
          </span>
        </div>
      </div>

      {/* Accessible data table hidden from sighted users */}
      <table className="sr-only">
        <caption>Weekly carbon emissions by day</caption>
        <thead>
          <tr><th scope="col">Day</th><th scope="col">Value (%)</th></tr>
        </thead>
        <tbody>
          {WEEKLY_CHART_DATA.map((d) => (
            <tr key={d.day}><td>{d.day}</td><td>{d.value}%</td></tr>
          ))}
        </tbody>
      </table>

      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={WEEKLY_CHART_DATA} barSize={32} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: '#3e4a3d', fontWeight: 600, textTransform: 'uppercase' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: '#f1f3ff' }}
              contentStyle={{
                background: '#fff',
                border: '1px solid #bdcaba',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(v) => [`${v}%`, 'Emissions']}
            />
            <ReferenceLine
              y={GOAL}
              stroke="#bdcaba"
              strokeDasharray="4 4"
              label={{ value: 'Goal', fill: '#bdcaba', fontSize: 10, position: 'right' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {WEEKLY_CHART_DATA.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.day === 'Sat' ? '#8d4b00' : entry.day === 'Sun' ? '#62df7d' : '#006b2c'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: RecommendationCards
// 3 AI-generated tips with "Done" and "Skip" actions.
// =============================================================================
function RecommendationCards() {
  const [hidden, setHidden] = useState([]);

  const tips = [
    {
      id: 1,
      icon: 'eco',
      iconColor: 'text-[#006b2c]',
      title: 'Switch to LED Bulbs',
      desc: 'Your energy log shows high nighttime usage. LEDs can cut your lighting footprint by 75%.',
      saving: 'Saves ~8kg/wk',
    },
    {
      id: 2,
      icon: 'restaurant',
      iconColor: 'text-[#8d4b00]',
      title: 'Meat-free Mondays',
      desc: 'Transitioning one day a week to plant-based meals significantly reduces methane emissions.',
      saving: 'Saves ~12kg/wk',
    },
    {
      id: 3,
      icon: 'directions_bus',
      iconColor: 'text-[#006b2c]',
      title: 'Bus on Tuesdays',
      desc: 'Your Tuesday commute by car emits 5.4kg. The bus route saves ~80% of that.',
      saving: 'Saves ~4kg/wk',
    },
  ];

  const visible = tips.filter((t) => !hidden.includes(t.id));

  return (
    <section aria-labelledby="tips-heading">
      <h3 id="tips-heading" className="text-lg font-semibold text-[#141b2b] mb-4">
        Smart Tips
      </h3>

      {visible.length === 0 ? (
        <div className="bg-[#f1f3ff] rounded-xl p-6 text-center">
          <MaterialIcon name="lightbulb" fill={1} className="text-[#006b2c] text-4xl mb-2" />
          <p className="text-sm text-[#3e4a3d]">All tips actioned! Check back tomorrow.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((tip) => (
            <article
              key={tip.id}
              className="bg-[#f1f3ff] p-4 rounded-xl border border-[#bdcaba]/30 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <MaterialIcon name={tip.icon} fill={1} className={`${tip.iconColor} text-2xl`} />
                <Badge variant="green">{tip.saving}</Badge>
              </div>
              <p className="font-semibold text-sm text-[#141b2b] mb-1">{tip.title}</p>
              <p className="text-xs text-[#3e4a3d] mb-3 line-clamp-2">{tip.desc}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setHidden((h) => [...h, tip.id])}
                  className="text-[11px] font-bold text-[#006b2c] border border-[#006b2c] px-3 py-1 rounded-lg hover:bg-[#f0fdf4] transition-colors"
                  aria-label={`Mark "${tip.title}" as done`}
                >
                  ✓ Done
                </button>
                <button
                  onClick={() => setHidden((h) => [...h, tip.id])}
                  className="text-[11px] font-bold text-[#3e4a3d] border border-[#bdcaba] px-3 py-1 rounded-lg hover:bg-[#e9edff] transition-colors"
                  aria-label={`Skip "${tip.title}"`}
                >
                  ✕ Skip
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// =============================================================================
// SECTION: GoalsProgress
// Three progress bars for active goals.
// =============================================================================
function GoalsProgress() {
  const goals = [
    { label: 'Monthly Reduction', value: 64 },
    { label: 'Zero Waste Days', value: 60, note: '12/20' },
    { label: 'Public Transit Use', value: 85, secondary: true },
  ];

  return (
    <section
      className="bg-white p-6 rounded-xl shadow-sm border border-[#bdcaba]/30 flex flex-col gap-5"
      aria-labelledby="goals-heading"
    >
      <h3 id="goals-heading" className="text-lg font-semibold text-[#141b2b]">
        Active Goals
      </h3>
      {goals.map((g) => (
        <div key={g.label}>
          <div className="flex justify-between text-[11px] font-bold text-[#3e4a3d] uppercase mb-1">
            <span>{g.label}</span>
            <span>{g.note ?? `${g.value}%`}</span>
          </div>
          <div className="w-full h-2 bg-[#e1e8fd] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${g.secondary ? 'bg-[#96d5a3]' : 'bg-[#006b2c]'}`}
              style={{ width: `${g.value}%` }}
              role="progressbar"
              aria-valuenow={g.value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={g.label}
            />
          </div>
        </div>
      ))}
      <button className="w-full flex items-center justify-center gap-2 border-2 border-[#bdcaba] py-2 rounded-lg text-[12px] font-bold text-[#3e4a3d] uppercase tracking-wider hover:bg-[#f1f3ff] transition-colors mt-auto">
        <MaterialIcon name="add" className="text-lg" />
        Set New Goal
      </button>
    </section>
  );
}

// =============================================================================
// SECTION: CommunityChallengeBanner
// Full-width green banner promoting the active community challenge.
// =============================================================================
function CommunityChallengeBanner() {
  return (
    <section
      className="bg-[#006b2c] text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
      aria-labelledby="challenge-heading"
    >
      <div className="z-10">
        <Badge variant="default" className="!bg-white/20 !text-white mb-3">
          Community Challenge
        </Badge>
        <h4 id="challenge-heading" className="text-xl font-bold mb-1">
          Plastic-Free Week
        </h4>
        <p className="text-sm text-white/90 max-w-xs">
          Join 1,240 others in reducing single-use plastics. 3 days remaining!
        </p>
      </div>
      <div className="z-10 flex flex-col items-start md:items-end gap-3 flex-shrink-0">
        <div>
          <p className="text-[10px] text-white/60 font-bold uppercase mb-0.5">Your Rank</p>
          <p className="font-mono text-2xl font-bold">#12 <span className="text-sm font-normal text-white/70">of 847</span></p>
        </div>
        <Button
          variant="ghost"
          className="!bg-white !text-[#006b2c] font-bold hover:!bg-[#f0fdf4]"
        >
          Participate Now
        </Button>
      </div>
      {/* Decorative glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#f7fff2]/20 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}

// =============================================================================
// SECTION: RecentActivity
// List of today's last 3 logged activities.
// =============================================================================
function RecentActivity() {
  const activities = [
    { icon: 'pedal_bike', title: 'Commute to Work', detail: 'Cycling • 8.2 km', value: '0.0 kg', valueColor: 'text-[#006b2c]' },
    { icon: 'shopping_basket', title: 'Grocery Shopping', detail: 'Sustainable Goods', value: '1.2 kg', valueColor: 'text-[#3e4a3d]' },
    { icon: 'ac_unit', title: 'HVAC Usage', detail: 'Heating • 4 hrs', value: '2.8 kg', valueColor: 'text-[#8d4b00]' },
  ];

  return (
    <section
      className="bg-white p-6 rounded-xl shadow-sm border border-[#bdcaba]/30"
      aria-labelledby="activity-heading"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 id="activity-heading" className="text-lg font-semibold text-[#141b2b]">
          Recent Activity
        </h3>
        <button className="text-sm text-[#006b2c] font-semibold hover:underline">View All</button>
      </div>
      <ul className="flex flex-col gap-3" role="list">
        {activities.map((a) => (
          <li
            key={a.title}
            className="flex items-center justify-between p-2 hover:bg-[#f9f9ff] rounded-lg transition-colors"
            role="listitem"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-[#e9edff] text-[#3e4a3d] rounded-lg">
                <MaterialIcon name={a.icon} className="text-xl" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#141b2b]">{a.title}</p>
                <p className="text-[11px] text-[#3e4a3d]">{a.detail}</p>
              </div>
            </div>
            <span className={`font-mono font-bold text-sm ${a.valueColor}`}>{a.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// =============================================================================
// SECTION: DashboardPage — Default Export
// Assembles sidebar + mobile nav + main content grid.
// =============================================================================
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <Sidebar />
      <MobileBottomNav />

      {/* Main content shifts right by sidebar width on desktop */}
      <main
        className="md:ml-64 p-4 md:p-8 pb-24 md:pb-8 min-h-screen"
        id="main-content"
        aria-label="Dashboard main content"
      >
        <DashboardHeader name={user?.name || 'there'} />

        {/* Bento grid */}
        <div className="flex flex-col gap-5">
          {/* Row 1 — Hero score */}
          <HeroScoreWidget />

          {/* Row 2 — Stat cards */}
          <StatCards />

          {/* Row 3 — Chart left, Tips right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-8">
              <WeeklyChart />
            </div>
            <div className="md:col-span-4">
              <RecommendationCards />
            </div>
          </div>

          {/* Row 4 — Recent Activity left, Goals right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-8">
              <RecentActivity />
            </div>
            <div className="md:col-span-4">
              <GoalsProgress />
            </div>
          </div>

          {/* Row 5 — Community challenge full width */}
          <CommunityChallengeBanner />
        </div>
      </main>

      {/* Mobile FAB — Log Activity */}
      <button
        className="md:hidden fixed bottom-20 right-5 w-14 h-14 bg-[#006b2c] text-white rounded-full shadow-xl flex items-center justify-center z-50 hover:bg-[#00873a] transition-colors"
        aria-label="Log a new activity"
      >
        <MaterialIcon name="add" className="text-3xl" />
      </button>
    </div>
  );
}
