// =============================================================================
// SECTION: OnboardingPage
// 3-step wizard collecting lifestyle, concerns, and first goal.
// State is local — selections are for UX only (no backend in this build).
// On completion → calls completeOnboarding() → navigates to /dashboard.
// Includes confetti celebration on finish.
// =============================================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MaterialIcon from '../components/atoms/MaterialIcon';
import Button from '../components/atoms/Button';
import { useAuth } from '../context/AuthContext';
import {
  LIFESTYLE_OPTIONS,
  CONCERN_OPTIONS,
  ROUTES,
} from '../utils/constants';

const TOTAL_STEPS = 3;

// =============================================================================
// SECTION: ProgressBar
// Shows current step out of 3 via a filled green bar.
// =============================================================================
function ProgressBar({ step }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  return (
    <div className="w-full max-w-3xl px-6 pt-8 mx-auto mb-10">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-bold text-[#006b2c]">CarbonTrace</span>
        <span
          className="text-[11px] font-bold text-[#3e4a3d] uppercase tracking-wider"
          aria-live="polite"
          aria-atomic="true"
        >
          Step {step} of {TOTAL_STEPS}
        </span>
      </div>
      <div
        className="h-2 w-full bg-[#dce2f7] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Onboarding progress: ${pct}%`}
      >
        <div
          className="h-full bg-[#006b2c] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: Step1 — Lifestyle & Location
// Location select + 4 lifestyle transport cards.
// =============================================================================
function Step1({ selected, onSelect }) {
  return (
    <section aria-labelledby="step1-heading">
      <div className="mb-8 text-center md:text-left">
        <h1 id="step1-heading" className="text-4xl font-bold text-[#141b2b] mb-2">
          Let's build your eco-profile
        </h1>
        <p className="text-base text-[#3e4a3d] max-w-xl">
          Where do you live and how do you usually get around? We'll use this to calibrate your baseline.
        </p>
      </div>

      {/* Location */}
      <div className="mb-8 max-w-sm">
        <label
          htmlFor="location-select"
          className="block text-[11px] font-bold text-[#3e4a3d] uppercase tracking-wider mb-2"
        >
          Your Location
        </label>
        <select
          id="location-select"
          className="w-full h-12 px-4 bg-white border border-[#bdcaba] rounded-xl focus:ring-2 focus:ring-[#006b2c] focus:border-[#006b2c] outline-none transition-all appearance-none cursor-pointer text-[#141b2b]"
        >
          <option>San Francisco, CA</option>
          <option>New York City, NY</option>
          <option>London, UK</option>
          <option>Berlin, DE</option>
          <option>Other / Remote</option>
        </select>
      </div>

      {/* Lifestyle cards */}
      <div className="mb-4">
        <p className="text-[11px] font-bold text-[#3e4a3d] uppercase tracking-wider mb-4">
          Primary Transportation
        </p>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          role="group"
          aria-label="Select your primary transportation mode"
        >
          {LIFESTYLE_OPTIONS.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                aria-pressed={isSelected}
                className={`p-6 bg-white border rounded-xl text-left cursor-pointer transition-all duration-200 hover:shadow-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006b2c] ${
                  isSelected
                    ? 'border-[#006b2c] bg-[#f0fdf4] ring-2 ring-[#006b2c]'
                    : 'border-[#bdcaba] hover:border-[#006b2c]'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                    isSelected ? 'bg-[#b1f2be]' : 'bg-[#e9edff] group-hover:bg-[#b1f2be]'
                  }`}
                >
                  <MaterialIcon name={opt.icon} className="text-[#006b2c] text-2xl" />
                </div>
                <h3 className="font-semibold text-[#141b2b] mb-1">{opt.label}</h3>
                <p className="text-xs text-[#3e4a3d]">{opt.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Step2 — Carbon Concerns
// Multi-select concern cards (Transport, Food, Energy, Shopping, Waste).
// =============================================================================
function Step2({ selected, onToggle }) {
  return (
    <section aria-labelledby="step2-heading">
      <div className="mb-8 text-center md:text-left">
        <h1 id="step2-heading" className="text-4xl font-bold text-[#141b2b] mb-2">
          What drives your impact?
        </h1>
        <p className="text-base text-[#3e4a3d] max-w-xl">
          Choose the areas where you'd like to focus your reduction efforts first.
        </p>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10"
        role="group"
        aria-label="Select your carbon concern areas"
      >
        {CONCERN_OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => onToggle(opt.id)}
              aria-pressed={isSelected}
              className={`p-6 bg-white border rounded-xl cursor-pointer transition-all flex flex-col items-center text-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006b2c] ${
                isSelected
                  ? 'border-[#006b2c] bg-[#f0fdf4] ring-2 ring-[#006b2c]'
                  : 'border-[#bdcaba] hover:bg-[#f1f3ff]'
              }`}
            >
              <MaterialIcon
                name={opt.icon}
                className="text-[#006b2c] text-4xl mb-4 group-hover:scale-110 transition-transform"
              />
              <h3 className="font-semibold text-[#141b2b]">{opt.label}</h3>
              {/* Checkmark circle */}
              <div
                className={`w-6 h-6 rounded-full border-2 mt-4 flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-[#006b2c] border-[#006b2c]' : 'border-[#bdcaba]'
                }`}
                aria-hidden="true"
              >
                {isSelected && <MaterialIcon name="check" className="text-white text-xs" />}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Step3 — Suggested First Goal
// Displays a pre-computed AI goal suggestion with difficulty indicators.
// =============================================================================
function Step3() {
  const difficultyDots = [true, true, false, false, false];

  return (
    <section aria-labelledby="step3-heading">
      <div className="mb-8 text-center md:text-left">
        <h1 id="step3-heading" className="text-4xl font-bold text-[#141b2b] mb-2">
          Your suggested first goal
        </h1>
        <p className="text-base text-[#3e4a3d] max-w-xl">
          Based on your input, CarbonTrace AI suggests a realistic first milestone.
        </p>
      </div>

      {/* Goal card */}
      <div className="bg-white rounded-3xl p-8 border border-[#bdcaba] shadow-lg flex flex-col md:flex-row gap-8 items-center relative overflow-hidden mb-8">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#006b2c]/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />

        {/* Circular reduction indicator */}
        <div className="flex-shrink-0 w-40 h-40 rounded-full border-8 border-[#b1f2be] flex flex-col items-center justify-center bg-[#f9f9ff]">
          <span className="font-mono text-5xl font-bold text-[#006b2c]">-20%</span>
          <span className="text-[11px] font-bold text-[#3e4a3d] uppercase">Reduction</span>
        </div>

        {/* Goal details */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <MaterialIcon name="auto_awesome" fill={1} className="text-[#006b2c]" />
            <span className="text-[11px] font-bold text-[#006b2c] uppercase tracking-wider">AI Optimised</span>
          </div>
          <h2 className="text-2xl font-bold text-[#141b2b] mb-3">The "Fresh Start" Protocol</h2>
          <p className="text-base text-[#3e4a3d] mb-6 leading-relaxed">
            Focus on optimising home heating and switching to meat-free Mondays. This path is
            calculated to be highly achievable given your lifestyle.
          </p>
          <div className="flex items-center gap-10">
            <div>
              <span className="text-[11px] font-bold text-[#3e4a3d] uppercase block mb-1">Difficulty</span>
              <div className="flex gap-1" aria-label="Difficulty: 2 out of 5" role="img">
                {difficultyDots.map((filled, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full ${filled ? 'bg-[#006b2c]' : 'bg-[#bdcaba]'}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#3e4a3d] uppercase block mb-1">Timeframe</span>
              <span className="text-lg font-semibold text-[#141b2b]">30 Days</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: CelebrationScreen
// Shown after user confirms the goal. Triggers confetti and auto-navigates.
// =============================================================================
function CelebrationScreen({ name }) {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  useEffect(() => {
    completeOnboarding();
    const timer = setTimeout(() => navigate(ROUTES.DASHBOARD), 3500);
    return () => clearTimeout(timer);
  }, [completeOnboarding, navigate]);

  return (
    <div className="flex flex-col items-center text-center py-16 animate-pulse-slow" aria-live="polite">
      <div className="w-24 h-24 bg-[#b1f2be] rounded-full flex items-center justify-center mb-6">
        <MaterialIcon name="check_circle" fill={1} className="text-[#006b2c] text-6xl" />
      </div>
      <h2 className="text-4xl font-bold text-[#006b2c] mb-3">You're all set, {name}! 🌱</h2>
      <p className="text-base text-[#3e4a3d]">
        Your journey to a sustainable future begins now. Taking you to your dashboard…
      </p>
    </div>
  );
}

// =============================================================================
// SECTION: OnboardingPage — Default Export
// Manages step state and renders correct step + navigation footer.
// =============================================================================
export default function OnboardingPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  // Step 1 selections
  const [lifestyle, setLifestyle] = useState(null);
  // Step 2 selections
  const [concerns, setConcerns] = useState([]);

  // Toggle a concern on/off
  const toggleConcern = (id) =>
    setConcerns((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      setDone(true);
    }
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  // Map step number to label for aria
  const stepLabels = ['Tell us about yourself', 'What drives your impact', 'Your first goal'];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#f9f9ff] flex flex-col items-center overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="CarbonTrace onboarding"
    >
      {!done && <ProgressBar step={step} />}

      {/* Content area */}
      <main className="w-full max-w-4xl px-6 flex-grow" aria-label={stepLabels[step - 1]}>
        {done ? (
          <CelebrationScreen name={user?.name || 'there'} />
        ) : (
          <>
            {step === 1 && <Step1 selected={lifestyle} onSelect={setLifestyle} />}
            {step === 2 && <Step2 selected={concerns} onToggle={toggleConcern} />}
            {step === 3 && <Step3 />}
          </>
        )}
      </main>

      {/* Navigation footer */}
      {!done && (
        <footer className="w-full max-w-3xl px-6 py-8 flex justify-between items-center mt-auto">
          <button
            onClick={handleBack}
            className={`flex items-center gap-1 text-[12px] font-bold text-[#3e4a3d] uppercase tracking-wider hover:text-[#006b2c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006b2c] rounded px-1 ${
              step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            aria-hidden={step === 1}
          >
            <MaterialIcon name="arrow_back" className="text-lg" />
            Back
          </button>

          <Button onClick={handleNext} className="px-10 rounded-full">
            {step === TOTAL_STEPS ? (
              <>
                Begin Journey
                <MaterialIcon name="celebration" fill={1} className="text-lg" />
              </>
            ) : (
              <>
                Next
                <MaterialIcon name="arrow_forward" className="text-lg" />
              </>
            )}
          </Button>
        </footer>
      )}
    </div>
  );
}
