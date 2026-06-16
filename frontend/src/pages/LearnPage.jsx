// =============================================================================
// SECTION: LearnPage
// Education hub with 4 tabs:
//   Articles  - searchable card grid
//   Videos    - thumbnail cards
//   Glossary  - alphabetical searchable terms
//   Myth vs Fact - click-to-flip cards
// =============================================================================

import { useState } from 'react';
import DashboardShell from '../components/layout/DashboardShell';
import MaterialIcon from '../components/atoms/MaterialIcon';
import Badge from '../components/atoms/Badge';

// =============================================================================
// SECTION: Mock Data
// NOTE: All strings use double-quotes so internal apostrophes never break the parser.
// =============================================================================
const ARTICLES = [
  { id: 1, cat: 'Energy',    title: "Why your electricity's carbon intensity changes every hour",   read: '5 min', date: 'May 28', emoji: '⚡' },
  { id: 2, cat: 'Diet',      title: "The real carbon cost of a beef burger vs. a plant burger",    read: '4 min', date: 'May 20', emoji: '🍔' },
  { id: 3, cat: 'Transport', title: "Electric cars: how green are they really?",                   read: '6 min', date: 'May 15', emoji: '🚗' },
  { id: 4, cat: 'Shopping',  title: "Fast fashion's hidden climate footprint",                     read: '3 min', date: 'May 10', emoji: '👕' },
  { id: 5, cat: 'Science',   title: "Understanding CO2 equivalents and why they matter",           read: '7 min', date: 'May 5',  emoji: '🔬' },
  { id: 6, cat: 'Policy',    title: "Carbon offsets: do they actually work?",                      read: '8 min', date: 'Apr 28', emoji: '📋' },
  { id: 7, cat: 'Energy',    title: "How to cut your home heating bill and your carbon footprint", read: '5 min', date: 'Apr 22', emoji: '🏠' },
  { id: 8, cat: 'Diet',      title: "A guide to low-carbon eating on a budget",                   read: '4 min', date: 'Apr 18', emoji: '🥦' },
  { id: 9, cat: 'Transport', title: "Is flying really that bad? The numbers explained",           read: '6 min', date: 'Apr 10', emoji: '✈️' },
];

const VIDEOS = [
  { id: 1, title: "How does the carbon cycle work?",        channel: 'TED-Ed',           duration: '4:32', emoji: '🌍' },
  { id: 2, title: "The true cost of your food",            channel: 'Kurzgesagt',        duration: '9:14', emoji: '🥩' },
  { id: 3, title: "Can renewable energy power the world?", channel: 'Our World in Data', duration: '7:05', emoji: '☀️' },
  { id: 4, title: "Why your commute matters for climate",  channel: 'CarbonTrace',       duration: '3:22', emoji: '🚌' },
  { id: 5, title: "Net zero: what does it actually mean?", channel: 'BBC Science',       duration: '5:48', emoji: '🌿' },
  { id: 6, title: "Ocean carbon sinks explained",          channel: 'NOAA',              duration: '6:11', emoji: '🌊' },
];

const GLOSSARY_TERMS = [
  { term: 'Carbon Footprint', def: "The total amount of greenhouse gases produced to support human activities, expressed in equivalent tons of CO2.",           related: ['CO2 Equivalent', 'Scope 1'] },
  { term: 'CO2 Equivalent',   def: "A metric used to compare emissions from various greenhouse gases based on their global warming potential relative to CO2.", related: ['Carbon Footprint'] },
  { term: 'Emission Factor',  def: "A coefficient that relates the quantity of a pollutant released to the unit of activity associated with the release.",      related: ['Scope 1', 'Scope 2'] },
  { term: 'IPCC',             def: "Intergovernmental Panel on Climate Change — the UN body for assessing the science related to climate change.",               related: ['Net Zero'] },
  { term: 'Net Zero',         def: "Achieving a balance between the greenhouse gases emitted into the atmosphere and those removed from it.",                    related: ['Carbon Offset', 'IPCC'] },
  { term: 'Carbon Credit',    def: "A permit allowing the holder to emit one tonne of CO2 or equivalent greenhouse gas.",                                       related: ['Carbon Offset'] },
  { term: 'Carbon Offset',    def: "A reduction in emissions of CO2 made to compensate for an emission made elsewhere.",                                        related: ['Carbon Credit', 'Net Zero'] },
  { term: 'Scope 1',          def: "Direct greenhouse gas emissions from sources controlled or owned by an organisation.",                                      related: ['Scope 2', 'Scope 3'] },
  { term: 'Scope 2',          def: "Indirect emissions from the generation of purchased electricity, heat, or steam.",                                          related: ['Scope 1', 'Scope 3'] },
  { term: 'Scope 3',          def: "All other indirect emissions that occur in a company's value chain, including end use by consumers.",                        related: ['Scope 1', 'Scope 2'] },
];

const MYTHS = [
  {
    myth: "Recycling is the most impactful climate action I can take.",
    fact: "Transport and diet have 10-50x more impact than recycling for most people. Recycling matters but it's not the top lever.",
    source: "IPCC AR6, 2021",
  },
  {
    myth: "Electric cars have a bigger carbon footprint than petrol cars due to battery production.",
    fact: "Over its lifetime, an EV emits 50-70% less CO2 than a petrol car, even accounting for battery manufacturing.",
    source: "IEA, Global EV Outlook 2023",
  },
  {
    myth: "Individual actions don't matter — only corporations can fix climate change.",
    fact: "Household consumption drives ~72% of global emissions. Individual choices aggregate into massive demand-side change.",
    source: "CDP, 2024",
  },
  {
    myth: "Going vegetarian doesn't really help if I fly once a year.",
    fact: "Both matter. A single transatlantic flight is roughly 1.5-3 tonnes CO2. Giving up beef for a year saves roughly 0.5-1 tonne. They compound.",
    source: "BBC Climate Calculator, 2023",
  },
  {
    myth: "Carbon offsets neutralise my flights completely.",
    fact: "Most offset projects are difficult to verify and may not permanently remove carbon. Reduction is always preferable to offsetting.",
    source: "Science Based Targets initiative, 2023",
  },
  {
    myth: "Local food is always lower carbon than imported food.",
    fact: "Transport accounts for less than 10% of most food's carbon footprint. What you eat matters far more than where it's from.",
    source: "Our World in Data, 2020",
  },
];

const CAT_COLORS = {
  Energy: 'green', Diet: 'amber', Transport: 'default', Shopping: 'red', Science: 'default', Policy: 'default',
};

// =============================================================================
// SECTION: ArticlesTab
// =============================================================================
function ArticlesTab() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Energy', 'Diet', 'Transport', 'Shopping', 'Science', 'Policy'];
  const [featured, ...rest] = ARTICLES;

  const filtered = (filter === 'All' ? rest : rest.filter((a) => a.cat === filter))
    .filter((a) => !search || a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-5">
        <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bdcaba] text-xl" aria-hidden="true" />
        <input
          id="articles-search"
          type="search"
          placeholder="Search articles..."
          aria-label="Search articles"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-[#bdcaba] focus:ring-2 focus:ring-[#006b2c] outline-none text-[#141b2b] placeholder:text-[#bdcaba]"
        />
      </div>

      {/* Featured article hero */}
      {!search && filter === 'All' && (
        <div className="bg-gradient-to-r from-[#006b2c] to-[#2e6a41] text-white rounded-2xl p-8 mb-6 flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:opacity-95 transition-opacity">
          <div className="text-8xl flex-shrink-0">{featured.emoji}</div>
          <div>
            <Badge variant="green" className="!bg-white/20 !text-white mb-2">{featured.cat}</Badge>
            <h3 className="text-2xl font-bold mb-2 leading-snug">{featured.title}</h3>
            <p className="text-white/70 text-sm">CarbonTrace Science Team · {featured.date} · {featured.read} read</p>
            <button className="mt-4 flex items-center gap-1 text-sm font-bold hover:gap-2 transition-all">
              Read Article <MaterialIcon name="arrow_forward" className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
              filter === c
                ? 'bg-[#006b2c] text-white'
                : 'bg-white border border-[#bdcaba] text-[#3e4a3d] hover:border-[#006b2c]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <MaterialIcon name="search_off" className="text-[#bdcaba] text-5xl block mx-auto mb-2" />
          <p className="text-[#3e4a3d] font-semibold">No results for &ldquo;{search}&rdquo;</p>
          <button onClick={() => setSearch('')} className="text-[#006b2c] text-sm font-bold mt-2 hover:underline">
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <article
              key={a.id}
              className="bg-white rounded-2xl p-5 border border-[#bdcaba]/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#f1f3ff] rounded-xl flex items-center justify-center text-2xl mb-4">
                {a.emoji}
              </div>
              <Badge variant={CAT_COLORS[a.cat] || 'default'} className="mb-3">{a.cat}</Badge>
              <h3 className="text-sm font-bold text-[#141b2b] mb-3 leading-snug line-clamp-2">{a.title}</h3>
              <p className="text-[11px] text-[#6e7b6c]">{a.date} · {a.read} read</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SECTION: VideosTab
// =============================================================================
function VideosTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {VIDEOS.map((v) => (
        <div
          key={v.id}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#bdcaba]/30 hover:shadow-md transition-shadow cursor-pointer group"
        >
          {/* Thumbnail placeholder */}
          <div className="bg-gradient-to-br from-[#f1f3ff] to-[#dce2f7] h-40 flex items-center justify-center relative">
            <span className="text-6xl">{v.emoji}</span>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                <MaterialIcon name="play_arrow" fill={1} className="text-[#006b2c] text-3xl" />
              </div>
            </div>
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-bold px-2 py-0.5 rounded">
              {v.duration}
            </span>
          </div>
          <div className="p-4">
            <p className="text-sm font-bold text-[#141b2b] line-clamp-2 mb-1">{v.title}</p>
            <p className="text-[11px] text-[#6e7b6c] font-semibold">{v.channel}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// SECTION: GlossaryTab
// =============================================================================
function GlossaryTab() {
  const [search, setSearch] = useState('');
  const filtered = GLOSSARY_TERMS.filter(
    (t) =>
      !search ||
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.def.toLowerCase().includes(search.toLowerCase())
  );
  const letters = [...new Set(filtered.map((t) => t.term[0]))].sort();

  return (
    <div>
      <div className="relative mb-5">
        <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bdcaba] text-xl" aria-hidden="true" />
        <input
          id="glossary-search"
          type="search"
          placeholder="Search glossary..."
          aria-label="Search glossary terms"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-[#bdcaba] focus:ring-2 focus:ring-[#006b2c] outline-none text-[#141b2b] placeholder:text-[#bdcaba]"
        />
      </div>

      {/* Alphabetical index */}
      {!search && (
        <div className="flex flex-wrap gap-1 mb-6">
          {letters.map((l) => (
            <a
              key={l}
              href={`#gls-${l}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f1f3ff] text-[#006b2c] font-bold text-sm hover:bg-[#b1f2be] transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {letters.map((l) => (
          <div key={l} id={`gls-${l}`}>
            {!search && (
              <p className="text-[11px] font-bold text-[#006b2c] uppercase tracking-widest mb-2 sticky top-0 bg-[#f9f9ff] py-1">
                {l}
              </p>
            )}
            {filtered
              .filter((t) => t.term[0] === l)
              .map((t) => (
                <div key={t.term} className="bg-white rounded-xl p-5 border-l-4 border-[#006b2c] shadow-sm mb-3">
                  <p className="font-bold text-[#141b2b] mb-1">{t.term}</p>
                  <p className="text-sm text-[#3e4a3d] leading-relaxed mb-2">{t.def}</p>
                  <div className="flex flex-wrap gap-2">
                    {t.related.map((r) => (
                      <span
                        key={r}
                        className="text-[10px] font-bold bg-[#f1f3ff] text-[#006b2c] px-2 py-0.5 rounded-full cursor-pointer hover:bg-[#b1f2be] transition-colors"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: MythVsFactTab — click to flip cards
// =============================================================================
function MythVsFactTab() {
  const [flipped, setFlipped] = useState([]);
  const toggle = (i) =>
    setFlipped((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  return (
    <div>
      <p className="text-sm text-[#3e4a3d] mb-6">
        Click any card to reveal the fact. These cover the most common climate misconceptions.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {MYTHS.map((m, i) => {
          const isFlipped = flipped.includes(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              aria-expanded={isFlipped}
              aria-label={isFlipped ? 'Show myth' : 'Reveal fact'}
              className={`text-left rounded-2xl p-6 shadow-sm border transition-all duration-300 min-h-[180px] flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md ${
                isFlipped ? 'bg-[#f0fdf4] border-[#b1f2be]' : 'bg-white border-[#ffdad6]'
              }`}
            >
              {!isFlipped ? (
                <>
                  <div>
                    <Badge variant="red" className="mb-3">MYTH</Badge>
                    <p className="text-sm font-semibold text-[#141b2b] italic leading-snug">
                      &ldquo;{m.myth}&rdquo;
                    </p>
                  </div>
                  <p className="text-[11px] text-[#bdcaba] mt-3 font-bold">Click to reveal the fact &rarr;</p>
                </>
              ) : (
                <>
                  <div>
                    <Badge variant="green" className="mb-3">FACT</Badge>
                    <p className="text-sm text-[#141b2b] leading-relaxed">{m.fact}</p>
                  </div>
                  <p className="text-[10px] text-[#6e7b6c] mt-3 font-semibold">Source: {m.source}</p>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: Tab configuration
// =============================================================================
const TABS = [
  { id: 'articles', label: 'Articles',     icon: 'article'       },
  { id: 'videos',   label: 'Videos',       icon: 'play_circle'   },
  { id: 'glossary', label: 'Glossary',     icon: 'menu_book'     },
  { id: 'myths',    label: 'Myth vs Fact', icon: 'question_mark' },
];

// =============================================================================
// SECTION: LearnPage — Default Export
// =============================================================================
export default function LearnPage() {
  const [tab, setTab] = useState('articles');

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#141b2b]">Learn</h1>
        <p className="text-sm text-[#3e4a3d] mt-1">
          Understand the science behind your score. Knowledge drives better choices.
        </p>
      </div>

      {/* Tab bar */}
      <div
        className="flex flex-wrap gap-1 bg-[#f1f3ff] p-1 rounded-2xl mb-6 w-full sm:w-fit"
        role="tablist"
        aria-label="Learn sections"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={tab === t.id}
            aria-controls="learn-tabpanel"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all ${
              tab === t.id
                ? 'bg-white text-[#006b2c] shadow-sm'
                : 'text-[#3e4a3d] hover:bg-[#e1e8fd]'
            }`}
          >
            <MaterialIcon name={t.icon} fill={tab === t.id ? 1 : 0} className="text-lg" aria-hidden="true" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        id="learn-tabpanel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
      >
        {tab === 'articles' && <ArticlesTab />}
        {tab === 'videos'   && <VideosTab />}
        {tab === 'glossary' && <GlossaryTab />}
        {tab === 'myths'    && <MythVsFactTab />}
      </div>
    </DashboardShell>
  );
}
