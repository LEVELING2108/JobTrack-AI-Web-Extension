import { useState } from 'react';
import { X, Download, Copy, Check, ExternalLink, Puzzle, FolderArchive, ToggleRight, Sparkles } from 'lucide-react';

interface DownloadExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadExtensionModal({ isOpen, onClose }: DownloadExtensionModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const handleCopyChromeUrl = () => {
    navigator.clipboard.writeText('chrome://extensions');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Puzzle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">JobTrack Browser Extension</h3>
                <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">v1.0.0</span>
              </div>
              <p className="text-xs text-indigo-100 mt-0.5">
                Compatible with Chrome, Edge, Brave, Opera & Vivaldi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Primary Download Banner */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Direct ZIP Package ( Free)
              </h4>
              <p className="text-xs text-indigo-700/80 mt-0.5">
                No store login required. Ready to install in under a minute.
              </p>
            </div>
            <a
              href="/downloads/jobtrack-extension.zip"
              download="jobtrack-extension.zip"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition shrink-0"
            >
              <Download className="w-4 h-4" />
              Download Extension ZIP
            </a>
          </div>

          {/* 3-Step Install Guide */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              3-Step Installation Guide
            </h4>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                    <FolderArchive className="w-3.5 h-3.5 text-indigo-600" />
                    Extract the ZIP file
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Download and extract <code className="bg-slate-200/80 px-1 py-0.5 rounded text-[10px] font-mono text-slate-800">jobtrack-extension.zip</code> to a permanent folder on your computer.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                    <ToggleRight className="w-3.5 h-3.5 text-indigo-600" />
                    Open Extensions & Enable Developer Mode
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    In your browser address bar, navigate to:
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="text-xs font-mono bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 select-all">
                      chrome://extensions
                    </code>
                    <button
                      onClick={handleCopyChromeUrl}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-indigo-600 px-2 py-1 bg-white border border-slate-200 rounded-md hover:border-indigo-200 transition"
                      title="Copy URL"
                    >
                      {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Toggle the <strong>Developer mode</strong> switch in the top-right corner.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                    <Puzzle className="w-3.5 h-3.5 text-indigo-600" />
                    Click "Load Unpacked"
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click <strong>Load unpacked</strong> (top-left) and select the extracted folder. The JobTrack icon will now appear in your browser toolbar!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <a
            href="https://github.com/LEVELING2108/JobTrack-AI-Web-Extension/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            GitHub Releases
          </a>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
