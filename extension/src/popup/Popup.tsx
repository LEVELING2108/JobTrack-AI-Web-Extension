import { useEffect, useState } from 'react';
import {
  Briefcase,
  Check,
  AlertCircle,
  ExternalLink,
  BookmarkCheck,
  Edit3,
  MapPin,
  DollarSign,
  Building,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  CloudOff,
  User as UserIcon,
  LogOut,
  RefreshCw,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { ExtractedJobData, ApplicationStatus, User } from '../types';
import { storageService } from '../services/storageService';
import { apiService } from '../services/apiService';
import { syncService } from '../services/syncService';

export default function Popup() {
  const [loading, setLoading] = useState<boolean>(true);
  const [jobData, setJobData] = useState<ExtractedJobData | null>(null);
  const [status, setStatus] = useState<ApplicationStatus>('SAVED');
  const [notes, setNotes] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isManualEntry, setIsManualEntry] = useState<boolean>(false);

  // Auth states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Save states
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [syncing, setSyncing] = useState<boolean>(false);

  // AI Match states
  const [calculatingMatch, setCalculatingMatch] = useState<boolean>(false);
  const [aiMatchScore, setAiMatchScore] = useState<number | null>(null);
  const [aiMatchSummary, setAiMatchSummary] = useState<string>('');

  // Edit fields
  const [editTitle, setEditTitle] = useState<string>('');
  const [editCompany, setEditCompany] = useState<string>('');
  const [editLocation, setEditLocation] = useState<string>('');
  const [editSalaryMin, setEditSalaryMin] = useState<string>('');
  const [editSalaryMax, setEditSalaryMax] = useState<string>('');

  useEffect(() => {
    // 1. Check auth user
    apiService.getCurrentUser().then((user) => {
      setCurrentUser(user);
      if (user) {
        syncService.syncPendingJobs().then((res) => {
          if (res.syncedCount > 0) {
            storageService.getPendingJobs().then((jobs) => setPendingCount(jobs.length));
          }
        });
      }
    });

    // 2. Check pending offline queue count
    storageService.getPendingJobs().then((jobs) => setPendingCount(jobs.length));

    // 3. Online/offline listener
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 4. Request extraction from active tab
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.id) {
          chrome.tabs.sendMessage(activeTab.id, { type: 'EXTRACT_JOB' }, (response) => {
            setLoading(false);
            if (response && response.success && response.data) {
              const data = response.data as ExtractedJobData;
              setJobData(data);
              setEditTitle(data.title);
              setEditCompany(data.company);
              setEditLocation(data.location || '');
              if (data.salaryMin) setEditSalaryMin(data.salaryMin.toString());
              if (data.salaryMax) setEditSalaryMax(data.salaryMax.toString());
            }
          });
        } else {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'login') {
        const res = await apiService.login(authEmail, authPassword);
        if (res.success && res.data) {
          setCurrentUser(res.data.user);
          setShowAuthModal(false);
          await handleSync();
        } else {
          setAuthError(res.error?.message || 'Invalid email or password.');
        }
      } else {
        const res = await apiService.register(authName, authEmail, authPassword);
        if (res.success && res.data) {
          setCurrentUser(res.data.user);
          setShowAuthModal(false);
          await handleSync();
        } else {
          setAuthError(res.error?.message || 'Registration failed.');
        }
      }
    } catch {
      setAuthError('Connection error. Is backend API running on port 8080?');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await storageService.clearAuthToken();
    setCurrentUser(null);
  };

  const handleSync = async () => {
    setSyncing(true);
    await syncService.syncPendingJobs();
    const updated = await storageService.getPendingJobs();
    setPendingCount(updated.length);
    setSyncing(false);
  };

  const handleCheckAiMatch = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setCalculatingMatch(true);
    const title = editTitle || jobData?.title || '';
    const comp = editCompany || jobData?.company || '';
    const desc = jobData?.description || title;

    const res = await apiService.calculateMatchScore(title, comp, desc);
    setCalculatingMatch(false);
    if (res) {
      setAiMatchScore(res.matchScore);
      setAiMatchSummary(res.summary);
    }
  };

  const handleSave = async () => {
    if (!jobData && !editTitle) return;

    setSaving(true);
    setIsDuplicate(false);
    setErrorMessage('');

    const finalJobData: ExtractedJobData = {
      title: editTitle || jobData?.title || 'Untitled Role',
      company: editCompany || jobData?.company || 'Unknown Company',
      location: editLocation || jobData?.location,
      url: jobData?.url || (typeof window !== 'undefined' ? window.location.href : ''),
      description: jobData?.description,
      salaryMin: editSalaryMin ? parseFloat(editSalaryMin) : jobData?.salaryMin,
      salaryMax: editSalaryMax ? parseFloat(editSalaryMax) : jobData?.salaryMax,
      currency: jobData?.currency || 'USD',
      employmentType: jobData?.employmentType,
      experienceLevel: jobData?.experienceLevel,
      source: jobData?.source || 'MANUAL_ENTRY',
      extractedAt: new Date().toISOString(),
    };

    if (currentUser && !isOffline) {
      const result = await apiService.saveApplication(finalJobData, status, notes);
      setSaving(false);

      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else if (result.isDuplicate) {
        setIsDuplicate(true);
      } else {
        await storageService.addPendingJob(finalJobData, status, notes);
        const updated = await storageService.getPendingJobs();
        setPendingCount(updated.length);
        setErrorMessage(result.error || 'Saved to offline queue.');
      }
    } else {
      await storageService.addPendingJob(finalJobData, status, notes);
      const updated = await storageService.getPendingJobs();
      setPendingCount(updated.length);
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  const handleStartManualEntry = () => {
    setIsManualEntry(true);
    setEditTitle('');
    setEditCompany('');
    setEditLocation('');
    setEditSalaryMin('');
    setEditSalaryMax('');
  };

  return (
    <div className="p-4 flex flex-col gap-3 font-sans bg-slate-50 text-slate-800 text-xs min-h-[440px] select-none">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 leading-tight">JobTrack</h1>
            <p className="text-[10px] text-slate-400">AI Application Assistant</p>
          </div>
        </div>

        {/* User / Auth Controls */}
        <div className="flex items-center gap-1.5">
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-2 py-0.5 shadow-2xs">
              <span className="text-[10px] font-medium text-slate-700 max-w-[80px] truncate" title={currentUser.email}>
                {currentUser.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-600 transition"
                title="Sign out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-[11px] font-medium border border-indigo-200 transition"
            >
              <UserIcon className="w-3 h-3" /> Sign In
            </button>
          )}

          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:text-indigo-600 p-1 rounded hover:bg-slate-100 transition"
            title="Open Web Dashboard"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Offline & Queue Alerts */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1.5 rounded-md flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5">
            <CloudOff className="w-3.5 h-3.5 shrink-0" />
            {pendingCount} job(s) pending sync
          </span>
          {currentUser && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="text-[10px] font-semibold text-amber-900 underline flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} /> Sync Now
            </button>
          )}
        </div>
      )}

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-lg flex flex-col gap-3 my-1 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-xs text-slate-800">
              {authMode === 'login' ? 'Sign In to JobTrack' : 'Create JobTrack Account'}
            </h2>
            <button
              onClick={() => setShowAuthModal(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ×
            </button>
          </div>

          {authError && (
            <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-2">
            {authMode === 'register' && (
              <div>
                <label className="text-[10px] font-medium text-slate-600">Full Name</label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="Jane Doe"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] font-medium text-slate-600">Email Address</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-slate-600">Password</label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="mt-1 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded text-xs transition disabled:opacity-50"
            >
              {authLoading ? 'Signing in...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div className="text-center mt-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setAuthError('');
                }}
                className="text-[10px] text-indigo-600 hover:underline"
              >
                {authMode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Body */}
      {!showAuthModal && (
        <>
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-[11px]">Scanning page for job postings...</span>
            </div>
          ) : jobData || isManualEntry ? (
            <div className="flex flex-col gap-3">
              {/* Job Preview Card */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-slate-900 line-clamp-2">
                      {editTitle || jobData?.title || 'Enter Job Title'}
                    </h2>
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium mt-1 text-[11px]">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{editCompany || jobData?.company || 'Enter Company'}</span>
                    </div>
                    {(editLocation || jobData?.location) && (
                      <div className="flex items-center gap-1.5 text-slate-500 mt-0.5 text-[10px]">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{editLocation || jobData?.location}</span>
                      </div>
                    )}
                    {(editSalaryMin || jobData?.salaryMin) && (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-medium mt-0.5 text-[10px]">
                        <DollarSign className="w-3 h-3 shrink-0" />
                        <span>
                          {jobData?.currency || '$'}
                          {editSalaryMin || jobData?.salaryMin}
                          {(editSalaryMax || jobData?.salaryMax) && ` - ${editSalaryMax || jobData?.salaryMax}`}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition"
                    title="Edit extracted details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Check className="w-3 h-3" /> Detected via {jobData?.source || 'Manual Entry'}
                  </span>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-[10px] text-indigo-600 hover:underline flex items-center gap-0.5"
                  >
                    {isEditing ? 'Hide Edit' : 'Edit Details'}{' '}
                    {isEditing ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* AI Match Score Card */}
              <div className="p-2.5 bg-purple-50/80 border border-purple-200 rounded-lg flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-600 text-white p-1 rounded">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    {aiMatchScore !== null ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-purple-900 text-xs">{aiMatchScore}% Match</span>
                        <span className="text-[10px] text-purple-700 line-clamp-1 max-w-[170px]">{aiMatchSummary}</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-purple-900 text-[11px]">AI Resume Match Score</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleCheckAiMatch}
                  disabled={calculatingMatch}
                  className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-semibold rounded shadow-2xs transition disabled:opacity-50 flex items-center gap-1 shrink-0"
                >
                  {calculatingMatch ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {aiMatchScore !== null ? 'Re-calculate' : 'Analyze Fit'}
                </button>
              </div>

              {/* Collapsible Edit Drawer */}
              {isEditing && (
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg flex flex-col gap-2">
                  <div>
                    <label className="text-[10px] font-medium text-slate-600">Job Title *</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. Senior Backend Engineer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-600">Company *</label>
                    <input
                      type="text"
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. Google"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-600">Location</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. Remote, Worldwide"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-slate-600">Min Salary</label>
                      <input
                        type="number"
                        value={editSalaryMin}
                        onChange={(e) => setEditSalaryMin(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                        placeholder="e.g. 100000"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-slate-600">Max Salary</label>
                      <input
                        type="number"
                        value={editSalaryMax}
                        onChange={(e) => setEditSalaryMax(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                        placeholder="e.g. 150000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Status & Notes */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Stage</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="SAVED">Saved</option>
                    <option value="APPLIED">Applied</option>
                    <option value="SCREENING">Screening</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Found via referral"
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Feedback Alerts */}
              {isDuplicate && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>This job is already in your application pipeline!</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded text-[10px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Save Button */}
              <button
                onClick={handleSave}
                disabled={saving || saveSuccess || (!editTitle && !jobData?.title)}
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  saveSuccess
                    ? 'bg-emerald-600 text-white'
                    : isDuplicate
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white disabled:opacity-50'
                }`}
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving to JobTrack...
                  </>
                ) : saveSuccess ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" /> Saved Successfully!
                  </>
                ) : isDuplicate ? (
                  'Already Tracked'
                ) : (
                  'Save to JobTrack'
                )}
              </button>
            </div>
          ) : (
            <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-slate-100 rounded-full text-slate-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="max-w-[240px]">
                <p className="font-semibold text-slate-700 text-xs">No Job Detected on this Page</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Navigate to a job posting on LinkedIn, Indeed, Glassdoor, or enter details manually below.
                </p>
              </div>
              <button
                onClick={handleStartManualEntry}
                className="mt-1 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md font-medium text-xs border border-indigo-200 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Manual Job Entry
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
