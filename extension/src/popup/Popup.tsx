import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ExternalLink,
  BookmarkCheck,
  Edit3,
  MapPin,
  DollarSign,
  Building,
  PlusCircle,
  CloudOff,
  User as UserIcon,
  LogOut,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Radio,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { ExtractedJobData, ApplicationStatus, User } from '../types';
import { storageService } from '../services/storageService';
import { apiService } from '../services/apiService';
import { syncService } from '../services/syncService';
import BrandLogo from '../components/BrandLogo';
import PlatformBadge from '../components/PlatformBadge';
import StageBadge, { STAGE_CONFIG, StageIcon } from '../components/StageBadge';

export default function Popup() {
  const [loading, setLoading] = useState<boolean>(true);
  const [jobData, setJobData] = useState<ExtractedJobData | null>(null);
  const [status, setStatus] = useState<ApplicationStatus>('SAVED');
  const [notes, setNotes] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isManualEntry, setIsManualEntry] = useState<boolean>(false);
  const [showAllStages, setShowAllStages] = useState<boolean>(false);

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
    runExtraction();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleExtractionResponse = (response: any) => {
    if (response && response.success && response.data) {
      const data = response.data as ExtractedJobData;
      setJobData(data);
      setEditTitle(data.title);
      setEditCompany(data.company);
      setEditLocation(data.location || '');
      if (data.salaryMin) setEditSalaryMin(data.salaryMin.toString());
      if (data.salaryMax) setEditSalaryMax(data.salaryMax.toString());
    }
  };

  const runExtraction = () => {
    setLoading(true);
    setErrorMessage('');
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.id) {
          chrome.tabs.sendMessage(activeTab.id, { type: 'EXTRACT_JOB' }, (response) => {
            if (chrome.runtime.lastError || !response || !response.success) {
              if (chrome.scripting && chrome.scripting.executeScript) {
                chrome.scripting
                  .executeScript({
                    target: { tabId: activeTab.id! },
                    files: ['assets/content.js'],
                  })
                  .then(() => {
                    setTimeout(() => {
                      chrome.tabs.sendMessage(activeTab.id!, { type: 'EXTRACT_JOB' }, (retryRes) => {
                        setLoading(false);
                        handleExtractionResponse(retryRes);
                      });
                    }, 200);
                  })
                  .catch(() => {
                    setLoading(false);
                  });
              } else {
                setLoading(false);
              }
            } else {
              setLoading(false);
              handleExtractionResponse(response);
            }
          });
        } else {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  };

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

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError('');

    try {
      const mockSub = Math.random().toString(36).substring(2, 15);
      const googleEmail = prompt('Enter your Google account email:', 'user@gmail.com');
      if (!googleEmail) {
        setAuthLoading(false);
        return;
      }

      const res = await apiService.loginWithGoogle(`mock_google_id_token_${mockSub}`, googleEmail, googleEmail.split('@')[0]);
      if (res.success && res.data) {
        setCurrentUser(res.data.user);
        setShowAuthModal(false);
        await handleSync();
      } else {
        setAuthError(res.error?.message || 'Google authentication failed.');
      }
    } catch {
      setAuthError('Error connecting to backend API.');
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
        setTimeout(() => setSaveSuccess(false), 4000);
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
      setTimeout(() => setSaveSuccess(false), 4000);
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

  const handleOpenDashboard = async (path: string = '/kanban') => {
    const token = await storageService.getAuthToken();
    const baseUrl = import.meta.env.VITE_WEB_BASE_URL || (
      import.meta.env.PROD
        ? 'https://jobtrack.antideploy.com'
        : 'http://localhost:5173'
    );
    const targetUrl = token
      ? `${baseUrl}${path}?sync_token=${encodeURIComponent(token)}`
      : `${baseUrl}${path}`;

    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url: targetUrl });
    } else {
      window.open(targetUrl, '_blank');
    }
  };

  const companyInitial = (editCompany || jobData?.company || 'J').charAt(0).toUpperCase();

  return (
    <div className="w-[400px] min-h-[520px] bg-slate-50 text-slate-800 flex flex-col font-sans select-none">
      {/* Top Navigation Bar with Gradient Accent */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <BrandLogo size={32} />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-sm tracking-tight text-slate-900 leading-none">JobTrack</h1>
              <span className="text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/60">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Smart Job Application Copilot</p>
          </div>
        </div>

        {/* User / Navigation Actions */}
        <div className="flex items-center gap-1.5">
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/80 rounded-full pl-1.5 pr-2.5 py-1 text-[11px] shadow-2xs">
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] ring-2 ring-white">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-slate-700 max-w-[70px] truncate" title={currentUser.email}>
                {currentUser.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-600 ml-0.5 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-full text-[11px] font-semibold shadow-xs shadow-indigo-500/20 transition-all active:scale-95"
            >
              <UserIcon className="w-3 h-3" /> Sign In
            </button>
          )}

          <button
            type="button"
            onClick={() => handleOpenDashboard('/kanban')}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer"
            title="Open Kanban Board"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Body Container */}
      <main className="p-4 flex-1 flex flex-col gap-3.5">
        {/* Offline & Queue Alerts */}
        {pendingCount > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 text-amber-900 px-3 py-2 rounded-xl flex items-center justify-between text-[11px] shadow-2xs">
            <span className="flex items-center gap-2 font-medium">
              <CloudOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{pendingCount} application(s) pending sync</span>
            </span>
            {currentUser && (
              <button
                onClick={handleSync}
                disabled={syncing}
                className="text-[10px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} /> Sync
              </button>
            )}
          </div>
        )}

        {/* Auth Modal Overlay */}
        {showAuthModal ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col gap-3 my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h2 className="font-bold text-sm text-slate-900">
                  {authMode === 'login' ? 'Welcome Back to JobTrack' : 'Create JobTrack Account'}
                </h2>
                <p className="text-[10px] text-slate-500">Sync captured jobs across all devices</p>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center font-bold text-sm transition"
              >
                ×
              </button>
            </div>

            {authError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-[11px] flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                <span>{authError}</span>
              </div>
            )}

            {/* 1-Click Google Authentication */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-slate-300/80 rounded-xl shadow-2xs bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative my-0.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-white px-2.5 text-slate-400 font-medium">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-2.5">
              {authMode === 'register' && (
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                    placeholder="Jane Doe"
                  />
                </div>
              )}
              <div>
                <label className="text-[10px] font-semibold text-slate-600 mb-1 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-600 mb-1 block">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="mt-1 w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs shadow-sm shadow-indigo-500/25 transition disabled:opacity-50"
              >
                {authLoading ? 'Authenticating...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="text-center mt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                    setAuthError('');
                  }}
                  className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 transition"
                >
                  {authMode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </button>
              </div>
            </form>
          </div>
        ) : loading ? (
          /* Loading State with Sleek Pulse */
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
              <div className="absolute w-4 h-4 rounded-full bg-indigo-600/10 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-700">Scanning Current Page</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Detecting job title, company, and compensation...</p>
            </div>
          </div>
        ) : jobData || isManualEntry ? (
          /* Job Captured / Manual Entry View */
          <div className="flex flex-col gap-3">
            {/* HERO JOB PREVIEW CARD */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-start gap-3">
                {/* Company Logo / Initial Avatar */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-lg shadow-2xs shrink-0">
                  {companyInitial}
                </div>

                {/* Job Title & Company */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 tracking-tight">
                    {editTitle || jobData?.title || 'Enter Job Title'}
                  </h2>
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{editCompany || jobData?.company || 'Enter Company'}</span>
                  </div>
                </div>

                {/* Edit details icon */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition shrink-0"
                  title="Edit details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Metadata Badges (Location, Salary, Platform) */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                {(editLocation || jobData?.location) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[130px]">{editLocation || jobData?.location}</span>
                  </span>
                )}

                {(editSalaryMin || jobData?.salaryMin) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <DollarSign className="w-3 h-3 shrink-0 text-emerald-600" />
                    <span>
                      {jobData?.currency || '$'}
                      {editSalaryMin || jobData?.salaryMin}
                      {(editSalaryMax || jobData?.salaryMax) && ` - ${editSalaryMax || jobData?.salaryMax}`}
                    </span>
                  </span>
                )}

                <div className="ml-auto">
                  <PlatformBadge source={jobData?.source} size="xs" />
                </div>
              </div>
            </div>

            {/* AI RESUME MATCH HERO CARD */}
            <div className="bg-gradient-to-br from-purple-50/90 via-indigo-50/50 to-slate-50 border border-purple-200/80 rounded-2xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-purple-950 tracking-tight">AI Resume Match</span>
                    <span className="text-[10px] text-purple-600 font-medium ml-1.5">Gemini 2.5</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckAiMatch}
                  disabled={calculatingMatch}
                  className="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[10px] font-bold rounded-lg shadow-xs shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 shrink-0"
                >
                  {calculatingMatch ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                  {aiMatchScore !== null ? 'Re-Analyze' : 'Analyze Fit'}
                </button>
              </div>

              {aiMatchScore !== null ? (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-purple-200/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-black ${
                        aiMatchScore >= 80 ? 'text-emerald-700' : aiMatchScore >= 60 ? 'text-purple-700' : 'text-amber-700'
                      }`}>
                        {aiMatchScore}% Fit
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {aiMatchScore >= 80 ? 'High Match' : aiMatchScore >= 60 ? 'Good Match' : 'Potential Match'}
                      </span>
                    </div>
                  </div>
                  {/* Progress Score Bar */}
                  <div className="w-full bg-purple-200/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        aiMatchScore >= 80 ? 'bg-emerald-500' : aiMatchScore >= 60 ? 'bg-purple-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${aiMatchScore}%` }}
                    />
                  </div>
                  {aiMatchSummary && (
                    <p className="text-[11px] text-purple-950 font-medium leading-relaxed bg-white/70 p-2 rounded-xl border border-purple-100">
                      {aiMatchSummary}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-purple-800/80 font-medium mt-0.5">
                  Analyze your skill fit against this job description before applying.
                </p>
              )}
            </div>

            {/* COLLAPSIBLE EDIT DETAILS DRAWER */}
            {isEditing && (
              <div className="p-3.5 bg-indigo-50/40 border border-indigo-100 rounded-2xl flex flex-col gap-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-indigo-100/80 pb-1.5">
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600" /> Edit Job Details
                  </span>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Done
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Job Title *</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    placeholder="e.g. Senior Backend Engineer"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Company *</label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    placeholder="e.g. Google"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    placeholder="e.g. Remote, San Francisco, CA"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Min Salary ($)</label>
                    <input
                      type="number"
                      value={editSalaryMin}
                      onChange={(e) => setEditSalaryMin(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Max Salary ($)</label>
                    <input
                      type="number"
                      value={editSalaryMax}
                      onChange={(e) => setEditSalaryMax(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      placeholder="150000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STAGE SELECTOR (INTERACTIVE SEGMENTED PILLS) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700">Application Stage</label>
                <button
                  onClick={() => setShowAllStages(!showAllStages)}
                  className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  {showAllStages ? 'Fewer' : 'More stages...'}
                </button>
              </div>

              {/* Quick Primary Stage Pills */}
              <div className="grid grid-cols-4 gap-1.5">
                {(['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER'] as ApplicationStatus[]).map((st) => {
                  const cfg = STAGE_CONFIG[st];
                  const isActive = status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1 text-center shadow-2xs ${
                        isActive
                          ? cfg.solidBg
                          : `${cfg.bg} ${cfg.text} ${cfg.border} hover:opacity-90`
                      }`}
                    >
                      <StageIcon status={st} className="w-3 h-3 shrink-0" />
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Extended Stages Dropdown */}
              {showAllStages && (
                <div className="grid grid-cols-2 gap-1.5 mt-1 animate-in fade-in">
                  {(['SCREENING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'] as ApplicationStatus[]).map((st) => {
                    const cfg = STAGE_CONFIG[st];
                    const isActive = status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatus(st)}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all flex items-center justify-center gap-1.5 text-center shadow-2xs ${
                          isActive
                            ? cfg.solidBg
                            : `${cfg.bg} ${cfg.text} ${cfg.border} hover:opacity-90`
                        }`}
                      >
                        <StageIcon status={st} className="w-3 h-3 shrink-0" />
                        <span>{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* NOTES FIELD */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Referral by Alex, applied on company portal"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
              />
            </div>

            {/* SUCCESS FEEDBACK BANNER */}
            {saveSuccess && (
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs flex flex-col gap-1.5 shadow-sm animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-black text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Saved to Your Pipeline Successfully!</span>
                </div>
                <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
                  <span>Saved to PostgreSQL under</span>
                  <StageBadge status={status} size="xs" />
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenDashboard('/kanban')}
                  className="mt-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] shadow-xs transition cursor-pointer"
                >
                  Open Kanban Board <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* DUPLICATE WARNING BANNER */}
            {isDuplicate && (
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-amber-900 rounded-2xl text-xs flex flex-col gap-1.5 shadow-sm animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-black text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Already in Your Pipeline!</span>
                </div>
                <p className="text-[11px] text-amber-800 font-medium">
                  This job posting has already been captured and saved in your database.
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenDashboard('/kanban')}
                  className="mt-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-[11px] shadow-xs transition cursor-pointer"
                >
                  View in Kanban Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-[11px] flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* PRIMARY SAVE ACTION BUTTON */}
            <button
              onClick={handleSave}
              disabled={saving || saveSuccess || (!editTitle && !jobData?.title)}
              className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                saveSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : isDuplicate
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/40 disabled:opacity-50'
              }`}
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving Application...
                </>
              ) : saveSuccess ? (
                <>
                  <BookmarkCheck className="w-4 h-4" /> Application Saved!
                </>
              ) : isDuplicate ? (
                'Already in Pipeline'
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4" /> Save to JobTrack
                </>
              )}
            </button>
          </div>
        ) : (
          /* EMPTY STATE (READY FOR CAPTURE) */
          <div className="py-10 text-center flex flex-col items-center justify-center gap-4 my-auto">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100/80 text-indigo-600 shadow-sm">
              <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 animate-ping" />
              <Radio className="w-8 h-8 relative z-10 text-indigo-600" />
            </div>

            <div className="max-w-[280px]">
              <h3 className="font-extrabold text-slate-800 text-sm">Ready to Capture Jobs</h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">
                Open any job posting on LinkedIn, Indeed, Glassdoor, or career sites. JobTrack will automatically extract the details.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={runExtraction}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs border border-slate-200/90 shadow-2xs transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-scan Tab
              </button>
              <button
                onClick={handleStartManualEntry}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-xs shadow-sm shadow-indigo-500/20 transition active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Manual Entry
              </button>
            </div>

            {/* Supported Platforms Pills */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 w-full flex flex-col items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Supported Platforms</span>
              <div className="flex flex-wrap justify-center gap-1">
                {['LinkedIn', 'Indeed', 'Glassdoor', 'Greenhouse', 'Lever', 'Workday'].map((site) => (
                  <span key={site} className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 shadow-2xs">
                    {site}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
