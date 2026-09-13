import { useState } from 'react';
import { Download, Copy, Check, Puzzle, Sparkles, FolderArchive, ToggleRight, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../components/common/BrandLogo';

export default function ExtensionPage() {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyChromeUrl = () => {
    navigator.clipboard.writeText('chrome://extensions');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo size={36} />
            <span className="font-bold text-lg text-slate-900 tracking-tight">JobTrack AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/login"
              className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free & Open Source Extension
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Clip Any Job with One Click
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            The official JobTrack companion extension for Chrome, Microsoft Edge, Brave, and Opera. Save jobs from LinkedIn, Indeed, and Glassdoor straight to your Kanban pipeline.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/downloads/jobtrack-extension.zip"
              download="jobtrack-extension.zip"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 transition"
            >
              <Download className="w-4 h-4" />
              Download Extension ZIP (v1.0.0)
            </a>
            <a
              href="https://github.com/LEVELING2108/JobTrack-AI-Web-Extension/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub Releases
            </a>
          </div>
        </div>

        {/* Installation Instructions Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-indigo-600" />
            3-Step Installation Guide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                  1
                </div>
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800 mb-2">
                  <FolderArchive className="w-4 h-4 text-indigo-600" />
                  Extract the ZIP
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Download <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[11px]">jobtrack-extension.zip</code> and unzip it into a folder on your computer.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                  2
                </div>
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800 mb-2">
                  <ToggleRight className="w-4 h-4 text-indigo-600" />
                  Enable Developer Mode
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                  Open your browser and navigate to:
                </p>
                <div className="flex items-center gap-1.5 mb-2">
                  <code className="text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-700 truncate">
                    chrome://extensions
                  </code>
                  <button
                    onClick={handleCopyChromeUrl}
                    className="p-1 text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 rounded transition shrink-0"
                    title="Copy URL"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Toggle on <strong>Developer mode</strong> in the top-right corner.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                  3
                </div>
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800 mb-2">
                  <Puzzle className="w-4 h-4 text-indigo-600" />
                  Load Unpacked
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Click <strong>Load unpacked</strong> (top-left) and select the extracted folder. The extension is now active in your toolbar!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">AI Compatibility Scoring</h3>
              <p className="text-xs text-slate-500 mt-1">Instant analysis of job descriptions against your profile to evaluate qualification match.</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Zero Tracking or Ads</h3>
              <p className="text-xs text-slate-500 mt-1">100% private. Operates strictly when you click capture on a job post. Your data is never monetized.</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
