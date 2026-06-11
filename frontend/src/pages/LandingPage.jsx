// =============================================================================
// SECTION: LandingPage
// Public marketing page. Sections (in order):
//   Navbar → Hero → Social Proof → How It Works → Features Grid
//   → Visualization → Testimonials → CTA Banner → Footer
// All section components are defined in this file to keep the page self-
// contained and easy to review in one scroll.
// =============================================================================

import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/atoms/Button';
import MaterialIcon from '../components/atoms/MaterialIcon';
import { ROUTES } from '../utils/constants';

// =============================================================================
// SECTION: HeroSection
// Large above-the-fold section with headline, CTAs, and floating mock cards.
// =============================================================================
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="pt-24 pb-20 bg-[#f0fdf4] min-h-[90vh] flex items-center"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* --- Left copy column --- */}
        <div className="space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-[#b1f2be] text-[#347047] px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest">
            <MaterialIcon name="verified" fill={1} className="text-sm" />
            Science-Based Tracking
          </div>

          <h1
            id="hero-heading"
            className="text-5xl md:text-[56px] font-bold text-[#141b2b] leading-tight tracking-tight"
          >
            See your carbon footprint.{' '}
            <span className="text-[#006b2c]">Shrink it</span> one habit at a time.
          </h1>

          <p className="text-base text-[#3e4a3d] max-w-xl leading-relaxed">
            The data-driven platform that turns climate anxiety into climate action.
            Track emissions, discover personalised reductions, and join a community
            committed to a net-zero future.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button onClick={() => navigate(ROUTES.LOGIN)}>
              Start Your Profile
            </Button>
            <Button variant="secondary">
              <MaterialIcon name="play_circle" className="text-lg" />
              Watch Demo
            </Button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center gap-6 pt-2 opacity-70 text-sm text-[#3e4a3d]">
            <span className="flex items-center gap-1">
              <MaterialIcon name="shield" fill={1} className="text-[#006b2c] text-base" />
              No credit card
            </span>
            <span className="flex items-center gap-1">
              <MaterialIcon name="check_circle" fill={1} className="text-[#006b2c] text-base" />
              Free forever plan
            </span>
            <span className="flex items-center gap-1">
              <MaterialIcon name="star" fill={1} className="text-[#8d4b00] text-base" />
              4.9 / 5 from 2,400 reviews
            </span>
          </div>
        </div>

        {/* --- Right mockup column --- */}
        <div className="relative hidden md:flex items-center justify-center">
          {/* Decorative blob */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 rounded-full bg-[#006b2c]/10 blur-3xl" />
          </div>

          {/* Phone mockup card */}
          <div className="animate-float relative z-10 bg-white p-4 rounded-3xl shadow-2xl border border-[#bdcaba] max-w-xs w-full">
            <div className="bg-[#f0fdf4] rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#3e4a3d] uppercase tracking-widest">Today's Score</span>
                <span className="text-[10px] bg-[#ffdcc3] text-[#8d4b00] px-2 py-0.5 rounded-full font-bold">Moderate</span>
              </div>
              <p className="font-mono text-4xl font-bold text-[#006b2c]">8.4</p>
              <p className="text-xs text-[#3e4a3d]">kg CO₂e today</p>
              {/* Mini sparkline */}
              <svg viewBox="0 0 200 60" className="w-full h-10">
                <defs>
                  <linearGradient id="heroGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#006b2c" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#006b2c" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,45 Q40,30 80,38 T160,22 T200,15" fill="none" stroke="#006b2c" strokeWidth="2.5" />
                <path d="M0,45 Q40,30 80,38 T160,22 T200,15 V60 H0 Z" fill="url(#heroGrad)" />
              </svg>
            </div>
          </div>

          {/* Floating stat card — top left */}
          <div
            className="animate-float-delayed absolute -left-8 top-12 z-20 bg-white p-3 rounded-xl shadow-xl border border-[#bdcaba]"
            aria-hidden="true"
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#b1f2be] rounded-full flex items-center justify-center">
                <MaterialIcon name="trending_down" className="text-[#006b2c] text-lg" />
              </div>
              <div>
                <p className="text-[10px] text-[#3e4a3d] uppercase font-bold">Monthly</p>
                <p className="font-mono text-[#006b2c] font-bold text-sm">-12.4% CO₂e</p>
              </div>
            </div>
          </div>

          {/* Floating stat card — bottom right */}
          <div
            className="animate-float absolute -right-4 bottom-16 z-20 bg-white p-3 rounded-xl shadow-xl border border-[#bdcaba]"
            aria-hidden="true"
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#ffdcc3] rounded-full flex items-center justify-center">
                <MaterialIcon name="eco" fill={1} className="text-[#8d4b00] text-lg" />
              </div>
              <div>
                <p className="text-[10px] text-[#3e4a3d] uppercase font-bold">Trees Saved</p>
                <p className="font-mono text-[#8d4b00] font-bold text-sm">14 Total</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// =============================================================================
// SECTION: SocialProofBar
// Greyscale company name logos strip below hero.
// =============================================================================
function SocialProofBar() {
  const companies = ['ECO-CORP', 'GREEN-LOGIC', 'NATURE-PATH', 'SUSTAIN-X', 'VITAL-EARTH'];
  return (
    <section className="py-8 bg-white border-b border-[#bdcaba]" aria-label="Trusted by">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[11px] font-bold text-[#3e4a3d] uppercase tracking-widest mb-6">
          Empowering Sustainability Teams At
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 opacity-40 grayscale">
          {companies.map((name) => (
            <span key={name} className="text-2xl font-extrabold tracking-tighter text-[#141b2b]">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: HowItWorksSection
// 3-step explainer with large background step numbers.
// =============================================================================
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: 'edit_note',
      title: 'Log Activity',
      description:
        'Connect your accounts or quickly log habits like travel, diet, and home energy in seconds.',
    },
    {
      number: '02',
      icon: 'query_stats',
      title: 'See Impact',
      description:
        'View real-time carbon scores and understand exactly where your emissions come from with scientific precision.',
    },
    {
      number: '03',
      icon: 'bolt',
      title: 'Take Action',
      description:
        'Follow personalised AI recommendations to reduce your score and unlock exclusive sustainable rewards.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#f9f9ff]" aria-labelledby="hiw-heading">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 id="hiw-heading" className="text-4xl font-bold text-[#141b2b] mb-16">
          Shrinking your footprint is simple
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="group">
              <div className="relative mb-6">
                {/* Background number */}
                <div className="text-[120px] font-extrabold text-[#bdcaba]/30 absolute -top-16 left-1/2 -translate-x-1/2 select-none leading-none">
                  {step.number}
                </div>
                {/* Icon circle */}
                <div className="w-20 h-20 bg-[#006b2c] text-white rounded-2xl flex items-center justify-center mx-auto relative z-10 shadow-lg group-hover:scale-110 transition-transform">
                  <MaterialIcon name={step.icon} className="text-4xl" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#141b2b] mb-2">{step.title}</h3>
              <p className="text-sm text-[#3e4a3d]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: FeaturesGrid
// 6 feature cards in bento-style responsive grid.
// =============================================================================
function FeaturesGrid() {
  const features = [
    { icon: 'database', title: 'Activity Logging', desc: 'Automatic syncing with utility providers for frictionless tracking.' },
    { icon: 'auto_awesome', title: 'AI Recommendations', desc: 'Smart suggestions tailored to your lifestyle, from dietary swaps to energy tips.' },
    { icon: 'speed', title: 'Real-Time Score', desc: 'Watch your carbon footprint fluctuate in real-time as you make daily choices.' },
    { icon: 'flag', title: 'Goal Tracking', desc: 'Set ambitious reduction targets and stay on track with automated reminders.' },
    { icon: 'groups', title: 'Community Challenges', desc: 'Compete with friends or coworkers to see who can reduce their footprint most.' },
    { icon: 'menu_book', title: 'Education Hub', desc: 'Curated content from climate scientists to help you navigate sustainable living.' },
  ];

  return (
    <section id="features" className="py-20 bg-white" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h2 id="features-heading" className="text-4xl font-bold text-[#141b2b]">
            Powerful tools for change
          </h2>
          <p className="text-base text-[#3e4a3d] mt-2">
            Built for individuals who take data as seriously as the climate.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-[#f1f3ff] p-6 rounded-3xl border border-[#bdcaba] hover:border-[#006b2c] transition-colors cursor-default group"
            >
              <MaterialIcon
                name={feat.icon}
                className="text-[#006b2c] text-3xl mb-4 group-hover:scale-110 transition-transform block"
              />
              <h3 className="text-lg font-semibold text-[#141b2b] mb-2">{feat.title}</h3>
              <p className="text-sm text-[#3e4a3d]">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: VisualizationSection
// Donut chart illustration + category breakdown list.
// =============================================================================
function VisualizationSection() {
  const categories = [
    { label: 'Transport', pct: 42, color: '#006b2c' },
    { label: 'Diet', pct: 28, color: '#2e6a41' },
    { label: 'Energy', pct: 30, color: '#8d4b00' },
  ];

  return (
    <section className="py-20 bg-[#f9f9ff] overflow-hidden" aria-label="Data visualization example">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-[#bdcaba]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Copy */}
            <div>
              <h2 className="text-4xl font-bold text-[#141b2b] mb-4">
                Data visualisation that actually makes sense
              </h2>
              <p className="text-base text-[#3e4a3d] mb-8">
                Stop guessing your impact. We break down your emissions into clear, digestible
                categories with scientific accuracy.
              </p>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div
                    key={cat.label}
                    className="flex items-center justify-between p-4 bg-[#f9f9ff] rounded-xl border border-[#bdcaba]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-semibold text-[#141b2b]">{cat.label}</span>
                    </div>
                    <span className="font-mono font-bold text-[#141b2b]">{cat.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut chart SVG */}
            <div className="flex justify-center" role="img" aria-label="Donut chart showing score of 74, rated Good">
              <div className="w-64 h-64 md:w-80 md:h-80 relative flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f3ff" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#006b2c" strokeWidth="12"
                    strokeDasharray="251.2" strokeDashoffset="145" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2e6a41" strokeWidth="12"
                    strokeDasharray="251.2" strokeDashoffset="200" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-[#3e4a3d] uppercase font-bold tracking-wider mb-1">Your Score</span>
                  <span className="text-5xl font-bold text-[#006b2c] font-mono">74</span>
                  <span className="text-xs font-bold text-[#006b2c]">GOOD</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: TestimonialsSection
// 3 user testimonials with reduction badges.
// =============================================================================
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Marketing Lead',
      quote:
        '"CarbonTrace turned what felt like an impossible task into a series of small, manageable daily habits. I\'m now much more aware of my travel choices."',
      reduction: 'REDUCED BY 24%',
      initial: 'S',
    },
    {
      name: 'Marcus Thorne',
      role: 'Software Engineer',
      quote:
        '"The data visualisation is world-class. It\'s the first time I\'ve actually understood how my electricity bill translates into carbon impact."',
      reduction: 'REDUCED BY 38%',
      initial: 'M',
    },
    {
      name: 'Leila Khan',
      role: 'Education Consultant',
      quote:
        '"The community challenges kept me motivated. Competing with my friends to see who could stay Green for 30 days was actually fun!"',
      reduction: 'REDUCED BY 15%',
      initial: 'L',
    },
  ];

  return (
    <section className="py-20 bg-white" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-6">
        <h2 id="testimonials-heading" className="text-4xl font-bold text-[#141b2b] text-center mb-16">
          Real people, real reduction
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="p-6 bg-[#f1f3ff] rounded-2xl border border-[#bdcaba] flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar initial circle */}
                <div className="w-12 h-12 rounded-full bg-[#006b2c] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {t.initial}
                </div>
                <div>
                  <h4 className="font-semibold text-[#141b2b]">{t.name}</h4>
                  <p className="text-sm text-[#3e4a3d]">{t.role}</p>
                </div>
              </div>
              <blockquote className="text-base italic text-[#3e4a3d] mb-6 flex-grow">
                {t.quote}
              </blockquote>
              <div className="bg-[#b1f2be] text-[#347047] px-4 py-2 rounded-lg text-center font-mono font-bold text-sm">
                {t.reduction}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: CTABanner
// Full-width dark green CTA section before footer.
// =============================================================================
function CTABanner() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-[#00873a] relative overflow-hidden" aria-label="Call to action">
      {/* Decorative grid overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center text-[#f7fff2]">
        <h2 className="text-4xl font-bold mb-4">Ready to trace your footprint?</h2>
        <p className="text-base opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of others taking measurable action against climate change.
          Start for free today, no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="ghost"
            className="!bg-white !text-[#006b2c] hover:!bg-[#f0fdf4] shadow-xl font-bold px-10 py-4 text-base"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Get Started Free
          </Button>
          <Button
            variant="secondary"
            className="!border-white !text-white hover:!bg-white/10 px-10 py-4 text-base"
          >
            Book a Demo
          </Button>
        </div>
        <p className="mt-6 text-[11px] opacity-70 uppercase tracking-widest">
          Free for individuals • Enterprise plans available
        </p>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Footer
// Dark charcoal footer with 4-column link grid.
// =============================================================================
function Footer() {
  const columns = [
    { heading: 'Product', links: ['How It Works', 'Features', 'Pricing', 'Case Studies'] },
    { heading: 'Community', links: ['Challenges', 'Leaderboard', 'Forums', 'Events'] },
    { heading: 'Resources', links: ['Blog', 'Glossary', 'Science Sources', 'API Docs'] },
    { heading: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
  ];

  return (
    <footer className="bg-[#293040] text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <MaterialIcon name="eco" fill={1} className="text-[#62df7d] text-3xl" />
              <span className="font-bold text-lg">CarbonTrace</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Empowering sustainable living through data. Join the movement to make every habit count.
            </p>
            <div className="flex gap-3">
              {['public', 'chat', 'share'].map((icon) => (
                <button
                  key={icon}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#006b2c] transition-colors"
                  aria-label={icon}
                >
                  <MaterialIcon name={icon} className="text-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/60 hover:text-[#62df7d] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <span>© 2026 CarbonTrace. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// SECTION: LandingPage — Default Export
// Assembles all sections in order.
// =============================================================================
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <SocialProofBar />
        <HowItWorksSection />
        <FeaturesGrid />
        <VisualizationSection />
        <TestimonialsSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
