// =============================================================================
// SECTION: CommunityPage
// Social engagement page featuring:
//   - User's active challenge status hero card
//   - Featured challenges grid (join / already joined state)
//   - Leaderboard with podium (top 3) + ranked list
//   - Activity feed (friends' recent actions)
//   - Badges & achievements horizontal scroll
// =============================================================================

import { useState } from 'react';
import DashboardShell from '../components/layout/DashboardShell';
import MaterialIcon from '../components/atoms/MaterialIcon';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';

// =============================================================================
// SECTION: Mock Data
// =============================================================================
const CHALLENGES = [
  {
    id: 1, title: 'June Carbon Challenge', emoji: '🌍',
    desc: 'Log every activity this month and hit your daily goal 25+ days.',
    participants: 847, daysLeft: 8, avgSaved: 23, joined: true,
    bg: 'from-[#006b2c] to-[#2e6a41]',
  },
  {
    id: 2, title: 'Meatless June', emoji: '🥗',
    desc: 'Replace meat with plant-based options for at least 15 days.',
    participants: 412, daysLeft: 12, avgSaved: 38, joined: false,
    bg: 'from-[#f97316] to-[#ea580c]',
  },
  {
    id: 3, title: 'Cycle to Work Week', emoji: '🚲',
    desc: 'Commute by bike or walk every day for 5 consecutive days.',
    participants: 1240, daysLeft: 3, avgSaved: 15, joined: false,
    bg: 'from-[#0891b2] to-[#0e7490]',
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'Priya S.',   avatar: 'P', score: 312, trend: '+12' },
  { rank: 2, name: 'Marcus T.', avatar: 'M', score: 289, trend: '+8'  },
  { rank: 3, name: 'Leila K.',  avatar: 'L', score: 271, trend: '+21' },
  { rank: 4, name: 'James O.',  avatar: 'J', score: 248, trend: '+5'  },
  { rank: 5, name: 'Sara H.',   avatar: 'S', score: 221, trend: '+14' },
  { rank: 6, name: 'Arun P.',   avatar: 'A', score: 198, trend: '+3'  },
  { rank: 7, name: 'Nadia B.',  avatar: 'N', score: 187, trend: '+9'  },
  { rank: 8, name: 'Chen W.',   avatar: 'C', score: 174, trend: '+6'  },
  { rank: 9, name: 'Elena M.',  avatar: 'E', score: 163, trend: '+11' },
  { rank: 10, name: 'Omar F.',  avatar: 'O', score: 156, trend: '+7'  },
  { rank: 12, name: 'You 🌱',   avatar: '★', score: 156, trend: '+15', isUser: true },
];

const FEED = [
  { id: 1, avatar: 'M', name: 'Marcus T.',  action: 'logged a 15 km bike ride',        icon: 'pedal_bike',   time: '2h ago',  points: 'Saved 0 kg' },
  { id: 2, avatar: 'P', name: 'Priya S.',   action: 'completed goal: Meatless Week',    icon: 'check_circle', time: '5h ago',  points: 'Badge earned 🏆' },
  { id: 3, avatar: 'L', name: 'Leila K.',   action: 'joined the June Carbon Challenge', icon: 'group',        time: '1d ago',  points: 'Welcome!' },
  { id: 4, avatar: 'J', name: 'James O.',   action: 'reduced energy by 18% this week',  icon: 'bolt',         time: '1d ago',  points: 'Saved 8.4 kg' },
  { id: 5, avatar: 'S', name: 'Sara H.',    action: 'set a new 30-day goal',            icon: 'flag',         time: '2d ago',  points: 'Good luck!' },
];

const BADGES = [
  { icon: 'local_fire_department', label: '14-Day Streak',   fill: 1, earned: true,  color: '#f97316' },
  { icon: 'eco',                   label: 'First Log',        fill: 1, earned: true,  color: '#006b2c' },
  { icon: 'emoji_events',          label: 'Goal Crusher',     fill: 1, earned: true,  color: '#d97706' },
  { icon: 'restaurant',            label: 'Meat-Free Week',   fill: 1, earned: true,  color: '#f97316' },
  { icon: 'public',                label: 'Carbon Neutral Mo',fill: 0, earned: false, color: '#bdcaba', hint: 'Log 0 net emissions for a month' },
  { icon: 'directions_run',        label: 'Marathon Saver',   fill: 0, earned: false, color: '#bdcaba', hint: 'Save 100 kg in one month' },
  { icon: 'recycling',             label: 'Full Circle',      fill: 0, earned: false, color: '#bdcaba', hint: 'Log all 5 categories in one day' },
];

const AVATAR_COLORS = ['#006b2c', '#2e6a41', '#0891b2', '#9333ea', '#f97316', '#dc2626', '#d97706', '#14b8a6', '#0ea5e9', '#8b5cf6'];
const avatarColor = (letter) => AVATAR_COLORS[letter.charCodeAt(0) % AVATAR_COLORS.length];

// =============================================================================
// SECTION: UserChallengeHero
// =============================================================================
function UserChallengeHero() {
  return (
    <div className="bg-gradient-to-r from-[#006b2c] to-[#00873a] rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏆</span>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">June Carbon Challenge</p>
          </div>
          <h2 className="text-3xl font-bold mb-1">You're ranked #12</h2>
          <p className="text-white/80 text-sm">of 847 participants — top 15% this month</p>
          {/* 7-day sparkline */}
          <div className="mt-3 flex items-end gap-1" aria-hidden="true">
            {[40, 60, 35, 70, 50, 80, 45].map((h, i) => (
              <div key={i} className="w-3 rounded-t bg-white/30 hover:bg-white/60 transition-colors"
                style={{ height: `${h * 0.4}px` }} />
            ))}
            <span className="text-[10px] ml-2 opacity-70">7-day activity</span>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
          <p className="text-[11px] font-bold uppercase opacity-60">Your Score</p>
          <p className="font-mono text-4xl font-bold">156 <span className="text-lg font-normal opacity-70">kg saved</span></p>
          <p className="text-sm text-white/70">8 days left in challenge</p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: ChallengeCard
// =============================================================================
function ChallengeCard({ challenge, onJoin }) {
  return (
    <div className={`bg-gradient-to-br ${challenge.bg} text-white rounded-2xl p-6 shadow-lg relative overflow-hidden`}>
      <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 select-none">{challenge.emoji}</div>
      {challenge.joined && (
        <Badge variant="green" className="!bg-white/20 !text-white mb-3 text-[10px]">
          <MaterialIcon name="check" className="text-xs" /> Joined ✓
        </Badge>
      )}
      <h3 className="text-lg font-bold mb-2">{challenge.title}</h3>
      <p className="text-sm text-white/80 mb-4 leading-snug">{challenge.desc}</p>
      <div className="flex items-center gap-4 text-[11px] font-bold mb-4 opacity-80 flex-wrap">
        <span>👥 {challenge.participants.toLocaleString()}</span>
        <span>⏱ {challenge.daysLeft}d left</span>
        <span>🌱 Avg {challenge.avgSaved} kg saved</span>
      </div>
      {!challenge.joined && (
        <button
          onClick={() => onJoin(challenge.id)}
          className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold py-2 rounded-xl text-sm transition-colors"
        >
          Join Challenge →
        </button>
      )}
    </div>
  );
}

// =============================================================================
// SECTION: Leaderboard with Podium
// =============================================================================
function Leaderboard() {
  const [tab, setTab] = useState('Global');
  const podium = LEADERBOARD.slice(0, 3);
  const rest    = LEADERBOARD.slice(3);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#bdcaba]/30 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-[#141b2b]">Leaderboard</h3>
        <div className="flex gap-1 bg-[#f1f3ff] p-1 rounded-xl">
          {['Global', 'Country', 'Friends'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                tab === t ? 'bg-white text-[#006b2c] shadow-sm' : 'text-[#3e4a3d] hover:bg-[#e1e8fd]'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-4 mb-6">
        {/* 2nd */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md mb-2"
            style={{ background: avatarColor(podium[1].avatar) }}>{podium[1].avatar}</div>
          <div className="bg-[#dce2f7] rounded-t-xl w-16 h-16 flex flex-col items-center justify-center">
            <span className="text-xl">🥈</span>
            <p className="text-[10px] font-bold text-[#141b2b]">{podium[1].score}</p>
          </div>
          <p className="text-[11px] font-semibold text-[#3e4a3d] mt-1 max-w-[64px] text-center leading-tight">{podium[1].name}</p>
        </div>
        {/* 1st */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-[#d97706] mb-2"
            style={{ background: avatarColor(podium[0].avatar) }}>{podium[0].avatar}</div>
          <div className="bg-[#fef3c7] rounded-t-xl w-20 h-24 flex flex-col items-center justify-center">
            <span className="text-2xl">🥇</span>
            <p className="font-mono font-bold text-[#141b2b]">{podium[0].score}</p>
          </div>
          <p className="text-[11px] font-semibold text-[#3e4a3d] mt-1 max-w-[80px] text-center leading-tight">{podium[0].name}</p>
        </div>
        {/* 3rd */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md mb-2"
            style={{ background: avatarColor(podium[2].avatar) }}>{podium[2].avatar}</div>
          <div className="bg-[#ffdcc3] rounded-t-xl w-16 h-12 flex flex-col items-center justify-center">
            <span className="text-xl">🥉</span>
            <p className="text-[10px] font-bold text-[#141b2b]">{podium[2].score}</p>
          </div>
          <p className="text-[11px] font-semibold text-[#3e4a3d] mt-1 max-w-[64px] text-center leading-tight">{podium[2].name}</p>
        </div>
      </div>

      {/* Rest of list */}
      <div className="space-y-1">
        {rest.map((entry) => (
          <div key={entry.rank}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
              entry.isUser ? 'bg-[#f0fdf4] border border-[#b1f2be]' : 'hover:bg-[#f9f9ff]'}`}>
            <span className="w-6 text-center font-mono text-sm font-bold text-[#3e4a3d]">#{entry.rank}</span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: avatarColor(entry.avatar) }}>{entry.avatar}</div>
            <span className={`flex-1 text-sm font-semibold ${entry.isUser ? 'text-[#006b2c]' : 'text-[#141b2b]'}`}>{entry.name}</span>
            <span className="font-mono text-sm font-bold text-[#141b2b]">{entry.score} kg</span>
            <span className="text-[11px] font-bold text-[#006b2c]">{entry.trend}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: ActivityFeed
// =============================================================================
function ActivityFeed() {
  const [liked, setLiked] = useState([]);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#bdcaba]/30 p-6">
      <h3 className="text-lg font-bold text-[#141b2b] mb-5">Friends' Activity</h3>
      <ul className="space-y-4" role="list">
        {FEED.map((item) => (
          <li key={item.id} className="flex items-start gap-3" role="listitem">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: avatarColor(item.avatar) }}>{item.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#141b2b]">
                <span className="font-bold">{item.name}</span>{' '}
                <span className="text-[#3e4a3d]">{item.action}</span>
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-[#6e7b6c]">{item.time}</span>
                <span className="text-[11px] font-semibold text-[#006b2c]">{item.points}</span>
              </div>
            </div>
            <button
              onClick={() => setLiked((prev) => prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id])}
              className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition-colors ${
                liked.includes(item.id) ? 'bg-[#f0fdf4] text-[#006b2c]' : 'text-[#6e7b6c] hover:bg-[#f1f3ff]'}`}
              aria-label={liked.includes(item.id) ? 'Unlike' : 'Like this activity'}
              aria-pressed={liked.includes(item.id)}
            >
              <MaterialIcon name="thumb_up" fill={liked.includes(item.id) ? 1 : 0} className="text-sm" />
              Nice!
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// =============================================================================
// SECTION: BadgesRow
// =============================================================================
function BadgesRow() {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#bdcaba]/30 p-6">
      <h3 className="text-lg font-bold text-[#141b2b] mb-4">Your Badges</h3>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2" role="list">
        {BADGES.map((b) => (
          <div key={b.label} className="flex-shrink-0 flex flex-col items-center relative" role="listitem">
            <button
              onMouseEnter={() => setHovered(b.label)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(b.label)}
              onBlur={() => setHovered(null)}
              aria-label={b.earned ? `Badge: ${b.label}` : `Locked badge: ${b.label}. ${b.hint}`}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                b.earned
                  ? 'bg-[#f0fdf4] hover:scale-110 shadow-md'
                  : 'bg-[#f1f3ff] opacity-40 cursor-not-allowed'
              }`}
            >
              <MaterialIcon name={b.icon} fill={b.fill} className="text-3xl" style={{ color: b.color }} />
            </button>
            {!b.earned && hovered === b.label && (
              <div className="absolute bottom-full mb-2 w-36 bg-[#293040] text-white text-[10px] p-2 rounded-lg z-10 text-center shadow-xl pointer-events-none">
                {b.hint}
              </div>
            )}
            <p className="text-[10px] font-semibold text-[#3e4a3d] mt-2 text-center leading-tight max-w-[64px]">{b.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: CommunityPage — Default Export
// =============================================================================
export default function CommunityPage() {
  const [challenges, setChallenges] = useState(CHALLENGES);
  const handleJoin = (id) => setChallenges((prev) => prev.map((c) => c.id === id ? { ...c, joined: true } : c));

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#141b2b]">Community</h1>
          <p className="text-sm text-[#3e4a3d] mt-1">Climate action is better together.</p>
        </div>
        <Button variant="secondary">
          <MaterialIcon name="share" className="text-lg" />
          Invite Friends
        </Button>
      </div>

      <UserChallengeHero />

      {/* Challenges grid */}
      <h2 className="text-lg font-bold text-[#141b2b] mb-4">Active Challenges</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {challenges.map((c) => (
          <ChallengeCard key={c.id} challenge={c} onJoin={handleJoin} />
        ))}
      </div>

      {/* Leaderboard + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-7"><Leaderboard /></div>
        <div className="lg:col-span-5"><ActivityFeed /></div>
      </div>

      {/* Badges */}
      <BadgesRow />
    </DashboardShell>
  );
}
