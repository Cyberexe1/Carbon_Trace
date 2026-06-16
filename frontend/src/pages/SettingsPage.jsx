// =============================================================================
// SECTION: SettingsPage — FR-080, FR-081, FR-082, FR-083
// Profile management page:
//   - FR-080: Update display name, country, lifestyle, notification prefs
//   - FR-081: Export personal data as JSON (GDPR)
//   - FR-082: Delete account with confirmation
//   - FR-083: Dark mode toggle (localStorage)
// All profile updates call PATCH /api/users/profile.
// =============================================================================

import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import DashboardShell          from '../components/layout/DashboardShell';
import MaterialIcon            from '../components/atoms/MaterialIcon';
import Button                  from '../components/atoms/Button';
import { useAuth }             from '../context/AuthContext';
import { usersAPI }            from '../services/api';
import { ROUTES, LIFESTYLE_OPTIONS } from '../utils/constants';

// =============================================================================
// SECTION: SettingsPage — Default Export
// =============================================================================
export default function SettingsPage() {
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [toast,   setToast]     = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput]             = useState('');

  // FR-083: Dark mode — persist preference in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('ct_dark_mode') === 'true';
  });

  const toggleDarkMode = (enabled) => {
    setDarkMode(enabled);
    localStorage.setItem('ct_dark_mode', String(enabled));
    document.documentElement.classList.toggle('dark', enabled);
  };

  // Apply saved dark mode on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  const [form, setForm] = useState({
    firstName: '', lastName: '', country: 'United States', lifestyle: 'transit',
  });

  // Load profile on mount
  useEffect(() => {
    usersAPI.profile().then(({ data, error }) => {
      if (!error && data) {
        setProfile(data);
        setForm({
          firstName: data.firstName || '',
          lastName:  data.lastName  || '',
          country:   data.country   || 'United States',
          lifestyle: data.lifestyle || 'transit',
        });
      }
      setLoading(false);
    });
  }, []);

  const up = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const showToast = (msg, error = false) => {
    setToast({ msg, error });
    setTimeout(() => setToast(''), 3000);
  };

  // FR-080: Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await usersAPI.updateProfile(form);
    setSaving(false);
    if (error) { showToast(error, true); return; }
    showToast('Profile updated successfully.');
  };

  // FR-081: Export data as JSON
  const handleExport = async () => {
    const { data, error } = await usersAPI.profile();
    if (error) { showToast(error, true); return; }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `carbontrace-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported.');
  };

  // FR-082: Delete account
  const handleDelete = async () => {
    if (deleteInput !== 'DELETE') return;
    const { error } = await usersAPI.deleteAccount();
    if (error) { showToast(error, true); return; }
    await logout();
    navigate(ROUTES.HOME);
  };

  const countries = [
    'United States','United Kingdom','Germany','Norway',
    'Canada','Australia','India','France','Other',
  ];

  return (
    <DashboardShell>
      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 text-white ${
            toast.error ? 'bg-[#ba1a1a]' : 'bg-[#006b2c]'
          }`}
        >
          <MaterialIcon name={toast.error ? 'error' : 'check_circle'} fill={1} className="text-lg" aria-hidden="true" />
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#141b2b]">Settings</h1>
        <p className="text-sm text-[#3e4a3d] mt-1">Manage your profile, data, and preferences.</p>
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse" role="status" aria-busy="true" aria-label="Loading settings">
          {[1,2,3].map((i) => <div key={i} className="bg-white rounded-2xl h-40" />)}
          <span className="sr-only">Loading your settings…</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6 max-w-2xl">

          {/* =================================================================
              FR-080 — Profile card
          ================================================================= */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30"
            aria-labelledby="profile-heading">
            <h2 id="profile-heading" className="text-lg font-bold text-[#141b2b] mb-5">Profile</h2>

            <form onSubmit={handleSave} className="space-y-4" noValidate>
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="set-first" className="block text-[11px] font-bold text-[#3e4a3d] uppercase tracking-wider mb-1">
                    First Name
                  </label>
                  <input
                    id="set-first"
                    type="text"
                    value={form.firstName}
                    onChange={up('firstName')}
                    className="w-full px-4 py-3 bg-[#f1f3ff] rounded-xl border-0 focus:ring-2 focus:ring-[#006b2c] text-[#141b2b]"
                  />
                </div>
                <div>
                  <label htmlFor="set-last" className="block text-[11px] font-bold text-[#3e4a3d] uppercase tracking-wider mb-1">
                    Last Name
                  </label>
                  <input
                    id="set-last"
                    type="text"
                    value={form.lastName}
                    onChange={up('lastName')}
                    className="w-full px-4 py-3 bg-[#f1f3ff] rounded-xl border-0 focus:ring-2 focus:ring-[#006b2c] text-[#141b2b]"
                  />
                </div>
              </div>

              {/* Email — read only */}
              <div>
                <label htmlFor="set-email" className="block text-[11px] font-bold text-[#3e4a3d] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  id="set-email"
                  type="email"
                  value={profile?.email || user?.email || ''}
                  readOnly
                  className="w-full px-4 py-3 bg-[#f1f3ff] rounded-xl border-0 text-[#3e4a3d] cursor-not-allowed opacity-60"
                  aria-describedby="email-note"
                />
                <p id="email-note" className="text-[11px] text-[#6e7b6c] mt-1">
                  Email is managed by Firebase Auth and cannot be changed here.
                </p>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="set-country" className="block text-[11px] font-bold text-[#3e4a3d] uppercase tracking-wider mb-1">
                  Country
                </label>
                <select
                  id="set-country"
                  value={form.country}
                  onChange={up('country')}
                  className="w-full px-4 py-3 bg-[#f1f3ff] rounded-xl border-0 focus:ring-2 focus:ring-[#006b2c] text-[#141b2b]"
                >
                  {countries.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Lifestyle */}
              <div>
                <p className="block text-[11px] font-bold text-[#3e4a3d] uppercase tracking-wider mb-2">
                  Primary Transportation
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="Transportation mode">
                  {LIFESTYLE_OPTIONS.map((opt) => {
                    const active = form.lifestyle === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, lifestyle: opt.id }))}
                        aria-pressed={active}
                        className={`p-3 rounded-xl border-2 text-center transition-all text-sm font-semibold ${
                          active
                            ? 'border-[#006b2c] bg-[#f0fdf4] text-[#006b2c]'
                            : 'border-[#bdcaba] text-[#3e4a3d] hover:border-[#006b2c]'
                        }`}
                      >
                        <MaterialIcon name={opt.icon} className="text-xl block mx-auto mb-1" aria-hidden="true" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />Saving…</>
                ) : (
                  <><MaterialIcon name="save" fill={1} className="text-lg" aria-hidden="true" />Save Changes</>
                )}
              </Button>
            </form>
          </section>

          {/* =================================================================
              FR-081 — Data export
          ================================================================= */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30"
            aria-labelledby="export-heading">
            <h2 id="export-heading" className="text-lg font-bold text-[#141b2b] mb-2">Export Your Data</h2>
            <p className="text-sm text-[#3e4a3d] mb-4">
              Download a JSON file containing your profile data. Activities and goals are
              available via the API.
            </p>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2.5 border border-[#bdcaba] rounded-xl text-sm font-semibold text-[#3e4a3d] hover:bg-[#f1f3ff] transition-colors"
            >
              <MaterialIcon name="download" fill={1} className="text-lg" aria-hidden="true" />
              Download JSON
            </button>
          </section>

          {/* =================================================================
              FR-083 — Dark mode toggle
          ================================================================= */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#bdcaba]/30"
            aria-labelledby="appearance-heading">
            <h2 id="appearance-heading" className="text-lg font-bold text-[#141b2b] mb-2">Appearance</h2>
            <p className="text-sm text-[#3e4a3d] mb-4">
              Switch between light and dark mode. Your preference is saved locally.
            </p>
            <div className="flex items-center justify-between p-4 bg-[#f1f3ff] rounded-xl">
              <div className="flex items-center gap-3">
                <MaterialIcon
                  name={darkMode ? 'dark_mode' : 'light_mode'}
                  fill={1}
                  className={darkMode ? 'text-[#9B72CF] text-xl' : 'text-[#d97706] text-xl'}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-[#141b2b]">
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <button
                role="switch"
                aria-checked={darkMode}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={() => toggleDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006b2c] ${
                  darkMode ? 'bg-[#006b2c]' : 'bg-[#bdcaba]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </section>

          {/* =================================================================
              FR-082 — Delete account
          ================================================================= */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#ffdad6]"
            aria-labelledby="delete-heading">
            <h2 id="delete-heading" className="text-lg font-bold text-[#ba1a1a] mb-2">Danger Zone</h2>
            <p className="text-sm text-[#3e4a3d] mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#ffdad6] bg-[#fff1f0] rounded-xl text-sm font-bold text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
              >
                <MaterialIcon name="delete_forever" fill={1} className="text-lg" aria-hidden="true" />
                Delete Account
              </button>
            ) : (
              <div className="bg-[#fff1f0] border border-[#ffdad6] rounded-xl p-4 space-y-3">
                <p className="text-sm font-bold text-[#ba1a1a]">
                  Type <code className="bg-[#ffdad6] px-1 rounded">DELETE</code> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-2.5 bg-white rounded-xl border border-[#ffdad6] focus:ring-2 focus:ring-[#ba1a1a] text-[#141b2b] font-mono"
                  aria-label="Type DELETE to confirm account deletion"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={deleteInput !== 'DELETE'}
                    className="px-4 py-2 bg-[#ba1a1a] text-white rounded-xl text-sm font-bold hover:bg-[#93000a] transition-colors disabled:opacity-40"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}
                    className="px-4 py-2 border border-[#bdcaba] rounded-xl text-sm font-bold text-[#3e4a3d] hover:bg-[#f1f3ff] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

        </div>
      )}
    </DashboardShell>
  );
}
