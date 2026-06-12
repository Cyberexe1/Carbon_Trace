// =============================================================================
// SECTION: InsightsPage
// Data analytics deep-dive page with:
//   - Summary stat strip
//   - Recharts area/line chart with period toggle (Week / Month / Year)
//   - Category donut breakdown + comparisons
//   - Carbon equivalents visual strip
//   - GitHub-style 12-week activity heatmap
//   - Top reduction opportunity cards
//   - Gemini AI Analysis panel
// =============================================================================

import { useState, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import DashboardShell from '../components/layout/DashboardShell';
import MaterialIcon from '../components/atoms/MaterialIcon';
import Badge from '../components/atoms/Badge';
import { analyzeFootprint } from '../services/geminiService';

// =============================================================================
// SECTION: Mock data sets for the three chart periods
// =============================================================================
const PERIOD_DATA = {
  Week: [
    { label: 'Mon', kg: 9.2 }, { label: 'Tue', kg: 6.8 }, { label: 'Wed', kg: 11.4 },
    { label: 'Thu', kg: 5.3 }, { label: 'Fri', kg: 13.1 }, { label: 'Sat', kg: 15.6 }, { label: 'Sun', kg: 3.2 },
  ],
  Month: [
    { label: 'W1', kg: 52 }, { label: 'W2', kg: 44 }, { label: 'W3', kg: 61 }, { label: 'W4', kg: 39 },
  ],
  Year: [
    { label: 'Jan', kg: 210 }, { label: 'Feb', kg: 195 }, { label: 'Mar', kg: 180 },
    { label: 'Apr', kg: 165 }, { label: 'May', kg: 172 }, { label: 'Jun', kg: 156 },
    { label: 'Jul', kg: 148 }, { label: 'Aug', kg: 160 }, { label: 'Sep', kg: 145 },
    { label: 'Oct', kg: 138 }, { label: 'Nov', kg: 130 }, { label: 'Dec', kg: 120 },
  ],
};

const PIE_DATA = [
  { name: 'Transport', value: 42, color: '#3b82f6', kg: 144, trend: '↓ 8%', trendGood: true },
  { name: 'Diet',      value: 29, color: '#f97316', kg: 98,  trend: '↑ 3%', trendGood: false },
  { name: 'Energy',    value: 18, color: '#eab308', kg: 62,  trend: '↓ 12%', trendGood: true },
  { name: 'Shopping',  value: 8,  color: '#9333ea', kg: 26,  trend: '—',    trendGood: null },
  { name: 'Waste',     value: 3,  color: '#14b8a6', kg: 12,  trend: '↓ 5%', trendGood: true },
];

const HEATMAP_WEEKS = 12;
const HEATMAP_DAYS  = 7;
const HEATMAP_DATA  = Array.from({ length: HEATMAP_WEEKS }, (_, w) =>
  Array.from({ length: HEATMAP_DAYS }, (_, d) => {
    const r = Math.random();
    return r < 0.15 ? 0 : r < 0.45 ? 1 : r < 0.7 ? 2 : r < 0.9 ? 3 : 4;
  })
);
const HEAT_COLORS = ['#f1f3ff', '#b1f2be', '#62df7d', '#2e6a41', '#006b2c'];

const OPPORTUNITIES = [
  { icon: 'directions_bus', category: 'Transport', action: 'Switch Tuesday commute to public transit', saving: 45, pct: 13, difficulty: 'Easy' },
  { icon: 'restaurant',     category: 'Diet',      action: 'Replace 2 beef meals/week with chicken',  saving: 32, pct: 9,  difficulty: 'Easy' },
  { icon: 'wb_sunny',       category: 'Energy',    action: 'Install solar on your hot water system',   saving: 28, pct: 8,  difficulty: 'Hard' },
];

// =============================================================================
// SECTION: SummaryStrip — 4 key metrics in a horizontal row
// =============================================================================
function SummaryStrip() {
  const stats = [
    { label: 'This Month',   value: '342 kg', sub: 'CO₂e',       icon: 'co2',          iconBg: 'bg-blue-50',   iconColor: 'text-blue-600', trend: '↓ 18%', good: true },
    { label: 'Best Day',     value: '3.2 kg', sub: 'Last Tue',    icon: 'emoji_events', iconBg: 'bg-green-50',  iconColor: 'text-green-600', trend: null, good: null },
    { label: 'Worst Cat.',   value: 'Transport', sub: '42%',      icon: 'warning',      iconBg: 'bg-amber-50',  iconColor: 'text-amber-600', trend: null, good: null },
    { label: 'Goal Progress',value: '67%',    sub: 'Complete',    icon: 'track_changes',iconBg: 'bg-purple-50', iconColor: 'text-purple-600',trend: null, good: null },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#bdcaba]/30 flex items-start gap-4">
          <span className={`p-2.5 rounded-xl ${s.iconBg} ${s.iconColor} flex-shrink-0`}>
            <MaterialIcon name={s.icon} fill={1} className="text-2xl" />
          </span>
          <div>
            <p className="text-[11px] font-bold text-[#3e4a3d] uppercase tracking-wider">{s.label}</p>
            <p className="font-mono text-xl font-bold text-[#141b2b] leading-tight">{s.value}</p>
            <p className="text-xs text-[#3e4a3d]">
              {s.sub}{' '}
              {s.trend && (
                <span className={s.good ? 'text-[#006b2c] font-bold' : 'text-[#dc2626] font-bold'}>
                  {s.trend}
                </span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// SECTION: TrendChart — Area chart with period toggle
// =============================================================================
function TrendChart() {
  const [period, setPeriod] = useState('Week');
  const data = PERIOD_DATA[period];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h3 className="text-lg font-bold text-[#141b2b]">Carbon Trend</h3>
        <div className="flex gap-1 bg-[#f1f3ff] p-1 rounded-xl" role="tablist" aria-label="Period selector">
          {['Week', 'Month', 'Year'].map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={period === p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-all ${
                period === p ? 'bg-white text-[#006b2c] shadow-sm' : 'text-[#3e4a3d] hover:bg-[#e1e8fd]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Accessible table */}
      <table className="sr-only">
        <caption>Carbon emissions — {period} view</caption>
        <thead><tr><th scope="col">Period</th><th scope="col">kg CO₂e</th></tr></thead>
        <tbody>{data.map((d) => <tr key={d.label}><td>{d.label}</td><td>{d.kg}</td></tr>)}</tbody>
      </table>

      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#006b2c" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#006b2c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3ff" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#3e4a3d', fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#3e4a3d' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #bdcaba', borderRadius: '10px', fontSize: '12px' }}
              formatter={(v) => [`${v} kg`, 'Emissions']}
            />
            <Area type="monotone" dataKey="kg" stroke="#006b2c" strokeWidth={2.5}
              fill="url(#areaGrad)" dot={{ fill: '#006b2c', r: 4 }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: BreakdownAndComparison — Donut + bar comparisons side by side
// =============================================================================
function BreakdownAndComparison() {
  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return percent > 0.07 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

      {/* Donut */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30">
        <h3 className="text-lg font-bold text-[#141b2b] mb-5">Breakdown by Category</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div aria-hidden="true">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  dataKey="value" labelLine={false} label={renderLabel}>
                  {PIE_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2 w-full">
            {PIE_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f9f9ff]">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} aria-hidden="true" />
                  <span className="text-sm font-semibold text-[#141b2b]">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-[#141b2b]">{item.kg} kg</span>
                  <span className="text-[#3e4a3d] w-8 text-right">{item.value}%</span>
                  <span className={`text-[11px] font-bold w-12 text-right ${item.trendGood === true ? 'text-[#006b2c]' : item.trendGood === false ? 'text-[#dc2626]' : 'text-[#3e4a3d]'}`}>
                    {item.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparisons */}
      <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30">
        <h3 className="text-lg font-bold text-[#141b2b] mb-5">How You Compare</h3>
        {[
          { label: 'vs. Global Average', yours: 37, theirs: 100, text: 'You emit 61% less than the global average', good: true },
          { label: 'vs. National Average', yours: 62, theirs: 100, text: '38% below your country\'s average', good: true },
          { label: 'vs. Last Month', yours: 82, theirs: 100, text: '↓ 18% improvement month over month', good: true },
        ].map((row) => (
          <div key={row.label} className="mb-5 last:mb-0">
            <p className="text-[11px] font-bold text-[#3e4a3d] uppercase tracking-wider mb-2">{row.label}</p>
            <div className="relative h-4 bg-[#f1f3ff] rounded-full overflow-hidden mb-1">
              <div className="absolute h-full bg-[#dce2f7] rounded-full" style={{ width: '100%' }} aria-hidden="true" />
              <div className="absolute h-full bg-[#006b2c] rounded-full transition-all duration-700" style={{ width: `${row.yours}%` }}
                role="progressbar" aria-valuenow={row.yours} aria-valuemin={0} aria-valuemax={100} aria-label={row.label} />
            </div>
            <p className="text-xs font-semibold text-[#006b2c]">{row.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: CarbonEquivalents — 4 fun equivalent cards
// =============================================================================
function CarbonEquivalents() {
  const items = [
    { icon: 'directions_car', label: '= Driving 2,156 km', sub: 'in a petrol car' },
    { icon: 'smartphone',     label: '= 41,300 charges',   sub: 'of a smartphone' },
    { icon: 'forest',         label: '= 15 trees',         sub: 'to absorb in 1 year' },
    { icon: 'flight',         label: '= 0.4 flights',      sub: 'short-haul return' },
  ];
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-[#141b2b] mb-4">What Your Emissions Look Like</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#bdcaba]/30 text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-[#f0fdf4] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <MaterialIcon name={item.icon} fill={1} className="text-[#006b2c] text-3xl" />
            </div>
            <p className="font-semibold text-sm text-[#141b2b]">{item.label}</p>
            <p className="text-xs text-[#3e4a3d] mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: ActivityHeatmap — GitHub-style 12-week grid
// =============================================================================
function ActivityHeatmap() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 className="text-lg font-bold text-[#141b2b]">Activity Heatmap — Last 12 Weeks</h3>
        <div className="flex items-center gap-2 text-[11px] text-[#3e4a3d] font-bold">
          <span>Less</span>
          {HEAT_COLORS.map((c) => (
            <span key={c} className="w-4 h-4 rounded-sm" style={{ background: c }} aria-hidden="true" />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max" aria-hidden="true">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            <div className="w-4 h-4" />
            {days.map((d, i) => (
              <div key={i} className="w-4 h-4 text-[9px] text-[#6e7b6c] font-bold flex items-center justify-center">
                {i % 2 === 0 ? d : ''}
              </div>
            ))}
          </div>
          {HEATMAP_DATA.map((week, w) => (
            <div key={w} className="flex flex-col gap-1">
              <div className="h-4 text-[9px] text-[#6e7b6c] font-bold text-center">
                {w === 0 ? 'W1' : w === 4 ? 'W5' : w === 8 ? 'W9' : ''}
              </div>
              {week.map((level, d) => (
                <div
                  key={d}
                  className="w-4 h-4 rounded-sm cursor-default"
                  style={{ background: HEAT_COLORS[level] }}
                  title={`Week ${w + 1}, ${days[d]}: ${level === 0 ? 'No log' : level + ' activities'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: ReductionOpportunities — 3 AI-scored cards
// =============================================================================
function ReductionOpportunities() {
  const diffBadge = { Easy: 'green', Moderate: 'amber', Hard: 'red' };
  return (
    <div className="mb-2">
      <h3 className="text-lg font-bold text-[#141b2b] mb-4">Your Biggest Reduction Opportunities</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OPPORTUNITIES.map((op) => (
          <div key={op.action} className="bg-white rounded-2xl p-5 shadow-sm border border-[#bdcaba]/30 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#f0fdf4] rounded-xl flex items-center justify-center">
                <MaterialIcon name={op.icon} fill={1} className="text-[#006b2c] text-xl" />
              </div>
              <Badge variant={diffBadge[op.difficulty]}>{op.difficulty}</Badge>
            </div>
            <p className="text-sm font-semibold text-[#141b2b] mb-3 leading-snug">{op.action}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-2xl font-bold text-[#006b2c]">~{op.saving} kg</p>
                <p className="text-[11px] text-[#3e4a3d]">= {op.pct}% of your footprint</p>
              </div>
              <button className="text-xs font-bold text-[#006b2c] hover:underline flex items-center gap-1">
                See how <MaterialIcon name="arrow_forward" className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: GeminiAnalysisPanel
// Calls Gemini to generate a personalised 3-bullet carbon footprint analysis.
// Uses the same mock stats that drive the rest of the page.
// =============================================================================

// Stats payload derived from the mock data above
const ANALYSIS_STATS = {
  totalKg: 342,
  categories: PIE_DATA.map((c) => ({ name: c.name, kg: c.kg, pct: c.value })),
  vsAvgPct: -61,   // 61% below global average
  trendPct: -18,   // 18% improvement vs last period
};

function GeminiAnalysisPanel() {
  const [bullets, setBullets]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    setBullets(null);

    const { text, error: err } = await analyzeFootprint(ANALYSIS_STATS);

    setLoading(false);
    if (err) { setError(err); return; }

    // Split on bullet character — guard against model using "- " or "* " too
    const parsed = text
      .split('\n')
      .map((l) => l.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);

    setBullets(parsed);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          {/* Gemini spark icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4285F4] via-[#9B72CF] to-[#D96570] flex items-center justify-center flex-shrink-0">
            <MaterialIcon name="auto_awesome" fill={1} className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#141b2b]">Gemini AI Analysis</h3>
            <p className="text-xs text-[#3e4a3d]">Powered by Google Gemini · personalised to your data</p>
          </div>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4285F4] to-[#9B72CF] text-white text-sm font-bold shadow hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Generate AI analysis"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
              Analysing…
            </>
          ) : (
            <>
              <MaterialIcon name="auto_awesome" fill={1} className="text-base" />
              {bullets ? 'Regenerate' : 'Analyse My Data'}
            </>
          )}
        </button>
      </div>

      {/* States */}
      {!bullets && !loading && !error && (
        <div className="bg-[#f1f3ff] rounded-xl p-5 text-center">
          <p className="text-sm text-[#3e4a3d]">
            Click <strong>Analyse My Data</strong> to get a personalised 3-point summary from Gemini.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-[#fff1f0] border border-[#ffdad6] rounded-xl p-4 flex items-start gap-3" role="alert">
          <MaterialIcon name="error" fill={1} className="text-[#ba1a1a] text-xl flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#ba1a1a] font-medium">{error}</p>
        </div>
      )}

      {bullets && (
        <ul className="space-y-3" aria-label="AI analysis results">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 bg-[#f0fdf4] rounded-xl p-4">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4285F4] to-[#9B72CF] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-[#141b2b] leading-relaxed">{b}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Attribution */}
      <p className="text-[10px] text-[#bdcaba] text-right mt-4 font-semibold">
        Gemini 2.0 Flash · google.com/gemini
      </p>
    </div>
  );
}

// =============================================================================
// SECTION: InsightsPage — Default Export
// =============================================================================
export default function InsightsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#141b2b]">Insights</h1>
          <p className="text-sm text-[#3e4a3d] mt-1">Understand your patterns. Find your biggest wins.</p>
        </div>
        <select className="border border-[#bdcaba] rounded-xl px-4 py-2 text-sm text-[#141b2b] bg-white focus:ring-2 focus:ring-[#006b2c] outline-none">
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>This year</option>
        </select>
      </div>

      <SummaryStrip />
      <TrendChart />
      <GeminiAnalysisPanel />
      <BreakdownAndComparison />
      <CarbonEquivalents />
      <ActivityHeatmap />
      <ReductionOpportunities />
    </DashboardShell>
  );
}
