// =============================================================================
// SECTION: LogActivityPage
// Two-column layout:
//   Left  — Step-by-step activity logging form (category → subtype → qty → date)
//   Right — Today's logged activities list with running total
// Live carbon preview updates in real-time as the user adjusts quantity.
// No backend — activities stored in local component state for the session.
// =============================================================================

import { useState, useMemo } from 'react';
import DashboardShell from '../components/layout/DashboardShell';
import MaterialIcon from '../components/atoms/MaterialIcon';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';

// =============================================================================
// SECTION: Data — Categories & Subtypes with emission factors (kg CO₂e/unit)
// Source: IPCC AR6 / EPA eGRID 2023 simplified factors
// =============================================================================
const CATEGORIES = [
  {
    id: 'transport', label: 'Transport', icon: 'commute',
    bg: 'bg-blue-50', color: 'text-blue-600', accent: '#3b82f6',
    subtypes: [
      { id: 'car_petrol', label: 'Car (Petrol)', factor: 0.21, unit: 'km' },
      { id: 'car_ev',     label: 'Car (EV)',     factor: 0.05, unit: 'km' },
      { id: 'bus',        label: 'Bus',          factor: 0.089, unit: 'km' },
      { id: 'train',      label: 'Train',        factor: 0.041, unit: 'km' },
      { id: 'flight',     label: 'Flight',       factor: 0.255, unit: 'km' },
      { id: 'cycle',      label: 'Cycling',      factor: 0,     unit: 'km' },
    ],
  },
  {
    id: 'diet', label: 'Diet', icon: 'restaurant',
    bg: 'bg-orange-50', color: 'text-orange-600', accent: '#f97316',
    subtypes: [
      { id: 'beef',       label: 'Beef meal',    factor: 6.61, unit: 'serving' },
      { id: 'chicken',    label: 'Chicken meal', factor: 1.26, unit: 'serving' },
      { id: 'fish',       label: 'Fish meal',    factor: 2.04, unit: 'serving' },
      { id: 'vegan',      label: 'Vegan meal',   factor: 0.50, unit: 'serving' },
      { id: 'dairy',      label: 'Dairy (milk)', factor: 3.15, unit: 'litre' },
    ],
  },
  {
    id: 'energy', label: 'Energy', icon: 'bolt',
    bg: 'bg-yellow-50', color: 'text-yellow-600', accent: '#eab308',
    subtypes: [
      { id: 'elec',    label: 'Electricity',   factor: 0.233, unit: 'kWh' },
      { id: 'gas',     label: 'Natural gas',   factor: 2.04,  unit: 'm³' },
      { id: 'heating', label: 'Oil heating',   factor: 2.52,  unit: 'litre' },
    ],
  },
  {
    id: 'shopping', label: 'Shopping', icon: 'shopping_bag',
    bg: 'bg-purple-50', color: 'text-purple-600', accent: '#9333ea',
    subtypes: [
      { id: 'clothing', label: 'New clothing item', factor: 8.1,  unit: 'item' },
      { id: 'laptop',   label: 'Laptop/device',     factor: 300,  unit: 'item' },
      { id: 'online',   label: 'Online parcel',     factor: 0.43, unit: 'parcel' },
    ],
  },
  {
    id: 'waste', label: 'Waste', icon: 'delete',
    bg: 'bg-teal-50', color: 'text-teal-600', accent: '#14b8a6',
    subtypes: [
      { id: 'landfill', label: 'Landfill waste',    factor: 0.57, unit: 'kg' },
      { id: 'recycled', label: 'Recycled waste',    factor: 0.02, unit: 'kg' },
      { id: 'compost',  label: 'Composted organic', factor: 0.01, unit: 'kg' },
    ],
  },
];

// Helper: compute carbon status colour from kg value
function carbonColor(kg) {
  if (kg <= 2) return 'text-[#006b2c]';
  if (kg <= 8) return 'text-[#d97706]';
  return 'text-[#dc2626]';
}

// =============================================================================
// SECTION: LiveCarbonPreview
// Card that shows real-time kg CO₂e estimate as user adjusts quantity.
// Changes colour based on low / moderate / high thresholds.
// =============================================================================
function LiveCarbonPreview({ kg }) {
  const equiv =
    kg === 0
      ? 'Zero emissions — great choice!'
      : kg < 1
      ? `≈ ${Math.round(kg * 1000)}g — lighter than a coffee`
      : kg < 5
      ? `≈ charging ${Math.round(kg * 121)} smartphones`
      : `≈ driving ${Math.round(kg / 0.21)} km in a petrol car`;

  const bg =
    kg === 0 ? 'bg-[#b1f2be]' : kg <= 5 ? 'bg-[#fef3c7]' : 'bg-[#ffdad6]';

  return (
    <div
      className={`${bg} rounded-2xl p-5 text-center transition-all duration-300`}
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#3e4a3d] mb-1">
        Carbon Preview
      </p>
      <p className={`font-mono text-5xl font-bold mb-1 ${carbonColor(kg)}`}>
        {kg.toFixed(2)}
      </p>
      <p className="text-sm font-semibold text-[#3e4a3d]">kg CO₂e</p>
      <p className="text-xs text-[#3e4a3d] mt-2">{equiv}</p>
    </div>
  );
}

// =============================================================================
// SECTION: LogActivityPage — Default Export
// =============================================================================
export default function LogActivityPage() {
  const [selCategory, setSelCategory] = useState(null);
  const [selSubtype,  setSelSubtype]  = useState(null);
  const [quantity,    setQuantity]    = useState(1);
  const [date,        setDate]        = useState(new Date().toISOString().split('T')[0]);
  const [notes,       setNotes]       = useState('');
  const [logged,      setLogged]      = useState([
    { id: 1, icon: 'pedal_bike',     label: 'Cycling to work',    detail: '8.2 km',      kg: 0.0,  accent: '#3b82f6' },
    { id: 2, icon: 'shopping_basket',label: 'Grocery shopping',   detail: 'Sustainable', kg: 1.2,  accent: '#9333ea' },
    { id: 3, icon: 'ac_unit',        label: 'HVAC usage',         detail: 'Heating 4h',  kg: 2.8,  accent: '#eab308' },
  ]);
  const [toast, setToast] = useState('');

  const category = CATEGORIES.find((c) => c.id === selCategory);
  const subtype  = category?.subtypes.find((s) => s.id === selSubtype);

  // Live carbon calculation
  const carbonKg = useMemo(() => {
    if (!subtype) return 0;
    return Math.round(quantity * subtype.factor * 1000) / 1000;
  }, [quantity, subtype]);

  const todayTotal = useMemo(
    () => logged.reduce((sum, a) => sum + a.kg, 0),
    [logged]
  );

  const handleLog = () => {
    if (!category || !subtype || quantity <= 0) return;
    const newEntry = {
      id: Date.now(),
      icon: category.icon,
      label: `${subtype.label}`,
      detail: `${quantity} ${subtype.unit}`,
      kg: carbonKg,
      accent: category.accent,
    };
    setLogged((prev) => [newEntry, ...prev]);
    setToast(`Logged! +${carbonKg.toFixed(2)} kg CO₂e`);
    setTimeout(() => setToast(''), 3000);
    // Reset form
    setSelSubtype(null);
    setQuantity(1);
    setNotes('');
  };

  const handleDelete = (id) => setLogged((prev) => prev.filter((a) => a.id !== id));

  return (
    <DashboardShell>
      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-50 bg-[#006b2c] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 animate-fade-in"
        >
          <MaterialIcon name="check_circle" fill={1} className="text-lg" />
          {toast}
        </div>
      )}

      {/* Page header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#141b2b]">Log Activity</h1>
          <p className="text-sm text-[#3e4a3d] mt-1">
            What did you do today? We'll calculate the carbon impact instantly.
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 border border-[#bdcaba] px-4 py-2 rounded-xl text-sm font-semibold text-[#3e4a3d] hover:bg-[#e9edff] transition-colors">
          <MaterialIcon name="upload_file" className="text-lg" />
          Import CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ------------------------------------------------------------------ */}
        {/* LEFT — Log Form */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-7 flex flex-col gap-5">

          {/* Step 1 — Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30">
            <p className="text-[11px] font-bold text-[#3e4a3d] uppercase tracking-widest mb-4">
              1 · Choose a Category
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3" role="group" aria-label="Emission category">
              {CATEGORIES.map((cat) => {
                const active = selCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setSelCategory(cat.id); setSelSubtype(null); }}
                    aria-pressed={active}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006b2c] ${
                      active
                        ? 'border-[#006b2c] bg-[#f0fdf4] shadow-md'
                        : 'border-[#bdcaba] hover:border-[#006b2c] hover:bg-[#f9f9ff]'
                    }`}
                  >
                    {active && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#006b2c] rounded-full flex items-center justify-center">
                        <MaterialIcon name="check" className="text-white text-xs" />
                      </span>
                    )}
                    <span className={`p-2 rounded-lg ${cat.bg} ${cat.color}`}>
                      <MaterialIcon name={cat.icon} className="text-xl" />
                    </span>
                    <span className="text-[11px] font-bold text-[#141b2b] text-center leading-tight">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 — Subtype (conditional) */}
          {category && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30 animate-fade-in">
              <p className="text-[11px] font-bold text-[#3e4a3d] uppercase tracking-widest mb-4">
                2 · Select Activity Type
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Activity subtype">
                {category.subtypes.map((sub) => {
                  const active = selSubtype === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelSubtype(sub.id)}
                      aria-pressed={active}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006b2c] ${
                        active
                          ? 'bg-[#006b2c] text-white border-[#006b2c]'
                          : 'bg-white text-[#3e4a3d] border-[#bdcaba] hover:border-[#006b2c]'
                      }`}
                    >
                      {sub.label}
                      <span className="ml-1 opacity-60 text-[11px]">
                        {sub.factor > 0 ? `~${sub.factor} kg/${sub.unit}` : '0 kg'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3 — Quantity (conditional) */}
          {subtype && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30 animate-fade-in">
              <p className="text-[11px] font-bold text-[#3e4a3d] uppercase tracking-widest mb-4">
                3 · Enter Quantity
              </p>
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(0.5, parseFloat((q - 0.5).toFixed(1))))}
                  className="w-11 h-11 rounded-full bg-[#f1f3ff] text-[#141b2b] text-2xl font-bold flex items-center justify-center hover:bg-[#e1e8fd] transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-28 text-center font-mono text-4xl font-bold text-[#141b2b] bg-transparent border-b-2 border-[#006b2c] focus:outline-none"
                    aria-label={`Quantity in ${subtype.unit}`}
                  />
                  <p className="text-sm text-[#3e4a3d] mt-1 font-semibold">{subtype.unit}</p>
                </div>
                <button
                  onClick={() => setQuantity((q) => parseFloat((q + 0.5).toFixed(1)))}
                  className="w-11 h-11 rounded-full bg-[#f1f3ff] text-[#141b2b] text-2xl font-bold flex items-center justify-center hover:bg-[#e1e8fd] transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {/* Slider */}
              <input
                type="range"
                min="0"
                max={subtype.unit === 'km' ? 200 : subtype.unit === 'kWh' ? 100 : 20}
                step="0.5"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                className="w-full accent-[#006b2c]"
                aria-label="Quantity slider"
              />
            </div>
          )}

          {/* Live preview */}
          {subtype && <LiveCarbonPreview kg={carbonKg} />}

          {/* Step 4 — Date & Notes */}
          {subtype && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30 animate-fade-in">
              <p className="text-[11px] font-bold text-[#3e4a3d] uppercase tracking-widest mb-4">
                4 · Date & Notes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="activity-date" className="block text-xs font-bold text-[#3e4a3d] uppercase mb-1">
                    Date
                  </label>
                  <input
                    id="activity-date"
                    type="date"
                    value={date}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f1f3ff] rounded-lg border-0 focus:ring-2 focus:ring-[#006b2c] text-[#141b2b]"
                  />
                </div>
                <div>
                  <label htmlFor="activity-notes" className="block text-xs font-bold text-[#3e4a3d] uppercase mb-1">
                    Notes (optional)
                  </label>
                  <input
                    id="activity-notes"
                    type="text"
                    placeholder="e.g. drove to client meeting"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={160}
                    className="w-full px-4 py-2.5 bg-[#f1f3ff] rounded-lg border-0 focus:ring-2 focus:ring-[#006b2c] text-[#141b2b] placeholder:text-[#bdcaba]"
                  />
                </div>
              </div>
              <Button
                fullWidth
                className="mt-5 py-4 text-base rounded-xl"
                onClick={handleLog}
                disabled={!selCategory || !selSubtype || quantity <= 0}
              >
                <MaterialIcon name="add_circle" fill={1} className="text-xl" />
                Log Activity
              </Button>
            </div>
          )}

          {/* Empty state when nothing selected */}
          {!selCategory && (
            <div className="bg-[#f1f3ff] rounded-2xl p-10 text-center border-2 border-dashed border-[#bdcaba]">
              <MaterialIcon name="touch_app" className="text-[#bdcaba] text-5xl mb-3 block mx-auto" />
              <p className="text-base font-semibold text-[#3e4a3d]">Select a category above to start logging</p>
              <p className="text-sm text-[#6e7b6c] mt-1">Takes under 2 minutes</p>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT — Today's log */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30 sticky top-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg font-bold text-[#141b2b]">Today's Log</h3>
                <p className={`font-mono text-sm font-bold mt-0.5 ${carbonColor(todayTotal)}`}>
                  {todayTotal.toFixed(2)} kg total
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['All', 'Transport', 'Diet', 'Energy'].map((f) => (
                  <span key={f} className="text-[10px] font-bold bg-[#f1f3ff] text-[#3e4a3d] px-2 py-1 rounded-full cursor-pointer hover:bg-[#e9edff]">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Activity list */}
            {logged.length === 0 ? (
              <div className="text-center py-10">
                <MaterialIcon name="eco" fill={1} className="text-[#bdcaba] text-5xl block mx-auto mb-2" />
                <p className="text-sm text-[#3e4a3d]">No activities logged yet today.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2 max-h-[480px] overflow-y-auto hide-scrollbar" role="list">
                {logged.map((act) => (
                  <li
                    key={act.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f9f9ff] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${act.accent}15` }}>
                        <MaterialIcon name={act.icon} className="text-xl" style={{ color: act.accent }} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#141b2b]">{act.label}</p>
                        <p className="text-[11px] text-[#3e4a3d]">{act.detail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm font-bold ${carbonColor(act.kg)}`}>
                        {act.kg === 0 ? '0 kg' : `${act.kg} kg`}
                      </span>
                      <button
                        onClick={() => handleDelete(act.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#ffdad6] transition-all"
                        aria-label={`Delete ${act.label}`}
                      >
                        <MaterialIcon name="delete" className="text-[#ba1a1a] text-base" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Daily progress bar */}
            <div className="mt-5 pt-4 border-t border-[#bdcaba]/30">
              <div className="flex justify-between text-[11px] font-bold text-[#3e4a3d] mb-1 uppercase">
                <span>Daily Goal: 10 kg</span>
                <span>{Math.min(100, Math.round((todayTotal / 10) * 100))}%</span>
              </div>
              <div className="h-2 bg-[#e1e8fd] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    todayTotal > 10 ? 'bg-[#ba1a1a]' : todayTotal > 7 ? 'bg-[#d97706]' : 'bg-[#006b2c]'
                  }`}
                  style={{ width: `${Math.min(100, (todayTotal / 10) * 100)}%` }}
                  role="progressbar"
                  aria-valuenow={Math.min(100, Math.round((todayTotal / 10) * 100))}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Daily carbon goal progress"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
