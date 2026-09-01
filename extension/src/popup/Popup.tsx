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
} from 'lucide-react';
import { ExtractedJobData, ApplicationStatus } from '../types';
import { storageService } from '../services/storageService';

export default function Popup() {
  const [loading, setLoading] = useState<boolean>(true);
  const [jobData, setJobData] = useState<ExtractedJobData | null>(null);
  const [status, setStatus] = useState<ApplicationStatus>('SAVED');
  const [notes, setNotes] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isManualEntry, setIsManualEntry] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Form states for manual editing
  const [editTitle, setEditTitle] = useState<string>('');
  const [editCompany, setEditCompany] = useState<string>('');
  const [editLocation, setEditLocation] = useState<string>('');
  const [editSalaryMin, setEditSalaryMin] = useState<string>('');
  const [editSalaryMax, setEditSalaryMax] = useState<string>('');

  useEffect(() => {
    // Check pending offline jobs
    storageService.getPendingJobs().then((jobs) => setPendingCount(jobs.length));

    // Listen to online/offline network status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Request extraction from the active tab's content script
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

  const handleSave = async () => {
    if (!jobData && !editTitle) return;

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

    // Store in offline/local storage queue
    await storageService.addPendingJob(finalJobData, status, notes);
    const updated = await storageService.getPendingJobs();
    setPendingCount(updated.length);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
    <div className="p-4 flex flex-col gap-3 font-sans bg-slate-50 text-slate-800 text-xs min-h-[420px] select-none">
      {/* Header */}
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
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span
              title={`${pendingCount} job(s) saved locally`}
              className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-medium"
            >
              <CloudOff className="w-3 h-3" /> {pendingCount}
            </span>
          )}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs hover:bg-slate-50 transition"
          >
            Dashboard <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 text-[11px]">
          <CloudOff className="w-3.5 h-3.5 shrink-0" />
          <span>Offline mode. Jobs will be queued locally for sync.</span>
        </div>
      )}

      {/* Main Body */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[11px]">Scanning page for job postings...</span>
        </div>
      ) : jobData || isManualEntry ? (
        <div className="flex flex-col gap-3">
          {/* Job Overview Card */}
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

          {/* Collapsible Edit Fields Drawer */}
          {isEditing && (
            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg flex flex-col gap-2">
              <div>
                <label className="text-[10px] font-medium text-slate-600">Job Title *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Senior Full Stack Engineer"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-600">Company *</label>
                <input
                  type="text"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-600">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Remote, USA"
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
                    placeholder="e.g. 90000"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600">Max Salary</label>
                  <input
                    type="number"
                    value={editSalaryMax}
                    onChange={(e) => setEditSalaryMax(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. 130000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Status & Notes Controls */}
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
                placeholder="e.g. Referred by Sarah"
                className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Save Action Button */}
          <button
            onClick={handleSave}
            disabled={saved || (!editTitle && !jobData?.title)}
            className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white disabled:opacity-50'
            }`}
          >
            {saved ? (
              <>
                <BookmarkCheck className="w-4 h-4" /> Saved to JobTrack
              </>
            ) : (
              'Save to JobTrack'
            )}
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
          <div className="p-3 bg-slate-100 rounded-full text-slate-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="max-w-[240px]">
            <p className="font-semibold text-slate-700 text-xs">No Job Detected on this Page</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Navigate to a job posting on LinkedIn, Indeed, Glassdoor, or click below to enter details manually.
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
    </div>
  );
}
