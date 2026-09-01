import { useEffect, useState } from 'react';
import { Briefcase, Check, AlertCircle, ExternalLink, BookmarkCheck } from 'lucide-react';
import { ExtractedJobData, ApplicationStatus } from '../types';

export default function Popup() {
  const [loading, setLoading] = useState<boolean>(true);
  const [jobData, setJobData] = useState<ExtractedJobData | null>(null);
  const [status, setStatus] = useState<ApplicationStatus>('SAVED');
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (chrome?.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.id) {
          chrome.tabs.sendMessage(activeTab.id, { type: 'EXTRACT_JOB' }, (response) => {
            setLoading(false);
            if (response && response.success && response.data) {
              setJobData(response.data);
            }
          });
        } else {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <div className="p-4 flex flex-col gap-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-md">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900">JobTrack</h1>
            <p className="text-[10px] text-slate-500">Extension v1.0.0</p>
          </div>
        </div>
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
        >
          Dashboard <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-500">Detecting job details...</div>
      ) : jobData ? (
        <div className="flex flex-col gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 line-clamp-2">{jobData.title}</h2>
            <p className="text-xs font-medium text-slate-600 mt-0.5">{jobData.company}</p>
            {jobData.location && (
              <p className="text-[11px] text-slate-400 mt-1">{jobData.location}</p>
            )}
            <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <Check className="w-3 h-3" /> Detected via {jobData.source}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Application Stage</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
              className="text-xs bg-white border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              <option value="SAVED">Saved</option>
              <option value="APPLIED">Applied</option>
              <option value="SCREENING">Screening</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saved}
            className={`w-full py-2 px-4 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {saved ? (
              <>
                <BookmarkCheck className="w-4 h-4" /> Job Saved
              </>
            ) : (
              'Save Job'
            )}
          </button>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
          <AlertCircle className="w-6 h-6 text-slate-400" />
          <span>No job detected on this page.</span>
        </div>
      )}
    </div>
  );
}
