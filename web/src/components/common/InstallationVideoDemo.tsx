import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Folder, ToggleRight, Puzzle, Sparkles, Check, ArrowRight } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function InstallationVideoDemo() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, or 3
  const [progress, setProgress] = useState(0); // 0 to 100
  const [hasCustomVideo, setHasCustomVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if a real MP4 video file exists at /videos/chrome-install-guide.mp4
  useEffect(() => {
    fetch('/videos/chrome-install-guide.mp4', { method: 'HEAD' })
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('video')) {
          setHasCustomVideo(true);
        }
      })
      .catch(() => setHasCustomVideo(false));
  }, []);

  // Animated video simulation loop (15 seconds total: 5s per step)
  useEffect(() => {
    if (hasCustomVideo || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.67; // ~15 seconds to reach 100%
        if (next >= 100) {
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, hasCustomVideo]);

  // Sync step with progress percentage
  useEffect(() => {
    if (hasCustomVideo) return;
    if (progress < 33.3) {
      setCurrentStep(1);
    } else if (progress < 66.6) {
      setCurrentStep(2);
    } else {
      setCurrentStep(3);
    }
  }, [progress, hasCustomVideo]);

  const handleSeek = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    if (stepNumber === 1) setProgress(0);
    if (stepNumber === 2) setProgress(35);
    if (stepNumber === 3) setProgress(70);
  };

  const handleReset = () => {
    setProgress(0);
    setCurrentStep(1);
    setIsPlaying(true);
  };

  // If a real video file was placed in /public/videos/chrome-install-guide.mp4, render native video player
  if (hasCustomVideo) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-lg">
        <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-slate-400 ml-2">How to install JobTrack Chrome Extension</span>
        </div>
        <video
          ref={videoRef}
          src="/videos/chrome-install-guide.mp4"
          controls
          autoPlay
          muted
          loop
          className="w-full h-auto max-h-[460px] object-cover"
        />
      </div>
    );
  }

  // Interactive Animated Simulation Player
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xl flex flex-col">
      {/* Browser Chrome Header Mockup */}
      <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-700/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
        </div>
        <div className="flex items-center gap-2 px-4 py-1 rounded-md bg-slate-900/90 text-slate-300 text-xs font-mono border border-slate-700/60 max-w-sm w-full justify-center">
          <span className="text-slate-500">https://</span>
          <span>{currentStep === 1 ? 'jobtrack.antideploy.com/downloads' : 'chrome://extensions'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulated Demo</span>
        </div>
      </div>

      {/* Screen Canvas / Visual Display */}
      <div className="relative w-full h-[280px] sm:h-[340px] bg-slate-950 flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {/* STEP 1: Download & Extract ZIP */}
        {currentStep === 1 && (
          <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Folder className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    Step 1: Download & Extract ZIP
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">105 KB</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Unzip jobtrack-extension.zip into a permanent folder</p>
                </div>
              </div>

              {/* Folder Extraction Animation */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-indigo-300 flex items-center gap-1.5">
                    📦 jobtrack-extension.zip
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Downloaded
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-300 w-full animate-pulse" />
                </div>
                <div className="text-[11px] text-slate-400 font-mono pt-1 flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 text-indigo-400" />
                  Extracted to: <span className="text-slate-200">~/Downloads/jobtrack-extension</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Enable Developer Mode */}
        {currentStep === 2 && (
          <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    ⚙️
                  </div>
                  <span className="text-sm font-bold text-white">chrome://extensions</span>
                </div>
                {/* Developer Mode Toggle Button with Animation */}
                <div className="flex items-center gap-2 bg-slate-800 border border-indigo-500/40 px-3 py-1.5 rounded-lg shadow-inner">
                  <span className="text-xs font-semibold text-indigo-300">Developer mode</span>
                  <div className="w-9 h-5 bg-indigo-600 rounded-full flex items-center justify-end px-0.5 shadow-md shadow-indigo-600/50">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="bg-indigo-600 text-white p-2.5 rounded-xl text-center text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1 border border-indigo-400/30 animate-pulse">
                  <Puzzle className="w-3.5 h-3.5" />
                  Load unpacked
                </div>
                <div className="bg-slate-800/60 text-slate-500 p-2.5 rounded-xl text-center text-xs font-medium border border-slate-800">
                  Pack extension
                </div>
                <div className="bg-slate-800/60 text-slate-500 p-2.5 rounded-xl text-center text-xs font-medium border border-slate-800">
                  Update
                </div>
              </div>

              <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1.5">
                <ToggleRight className="w-4 h-4 text-indigo-400" />
                Switch Developer mode <strong>ON</strong> to reveal the <strong>Load unpacked</strong> button.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Load Unpacked & Extension Active */}
        {currentStep === 3 && (
          <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl backdrop-blur-md ring-1 ring-emerald-500/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <BrandLogo size={40} />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      JobTrack AI
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">1.0.0</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Capture, organize & track jobs</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Active
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>ID:</span>
                  <span className="font-mono text-[10px] text-slate-500 truncate max-w-[180px]">jobtrack-ai-companion</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Cloud API:</span>
                  <span className="font-mono text-[10px] text-emerald-400">jobtrack-api.antideploy.com</span>
                </div>
              </div>

              <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Ready! Pin the icon to your Chrome toolbar to clip jobs.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Scrubber & Playback Controls */}
      <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex flex-col gap-2.5">
        {/* Progress Bar */}
        <div 
          className="w-full bg-slate-800 h-1.5 rounded-full cursor-pointer relative overflow-hidden group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newProgress = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
            setProgress(newProgress);
          }}
        >
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition text-xs flex items-center gap-1.5 px-2.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-indigo-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Replay Demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-slate-400 ml-2">
              {Math.floor((progress / 100) * 15)}s / 15s
            </span>
          </div>

          {/* Step Selector Pills */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSeek(1)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                currentStep === 1
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Extract
            </button>
            <button
              onClick={() => handleSeek(2)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                currentStep === 2
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Developer Mode
            </button>
            <button
              onClick={() => handleSeek(3)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                currentStep === 3
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Load Unpacked
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
