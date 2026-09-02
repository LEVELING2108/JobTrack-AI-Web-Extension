import { useState } from 'react';
import {
  X,
  Building,
  MapPin,
  ExternalLink,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  FileText,
  HelpCircle,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { Application, ApplicationStatus, AiMatchScoreResult, AiInterviewPrepResult } from '../../types';
import { useUpdateApplicationMutation, useDeleteApplicationMutation } from '../../hooks/useApplications';
import {
  useAiMatchScoreMutation,
  useAiCoverLetterMutation,
  useAiInterviewPrepMutation,
} from '../../hooks/useAi';

interface DetailsProps {
  application: Application;
  onClose: () => void;
}

export default function ApplicationDetailsModal({ application, onClose }: DetailsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'ai'>('details');
  const [notes, setNotes] = useState(application.notes || '');
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [deadline, setDeadline] = useState(application.deadline ? application.deadline.split('T')[0] : '');
  const [followUpDate, setFollowUpDate] = useState(application.followUpDate ? application.followUpDate.split('T')[0] : '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // AI states
  const [matchResult, setMatchResult] = useState<AiMatchScoreResult | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [copiedCoverLetter, setCopiedCoverLetter] = useState<boolean>(false);
  const [coverTone, setCoverTone] = useState<string>('Professional and Confident');
  const [interviewPrep, setInterviewPrep] = useState<AiInterviewPrepResult | null>(null);

  const updateMutation = useUpdateApplicationMutation();
  const deleteMutation = useDeleteApplicationMutation();
  const matchScoreMutation = useAiMatchScoreMutation();
  const coverLetterMutation = useAiCoverLetterMutation();
  const interviewPrepMutation = useAiInterviewPrepMutation();

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      id: application.id,
      data: {
        notes,
        status,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        followUpDate: followUpDate ? new Date(followUpDate).toISOString() : undefined,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      await deleteMutation.mutateAsync(application.id);
      onClose();
    }
  };

  const handleRunMatchScore = async () => {
    const res = await matchScoreMutation.mutateAsync({
      applicationId: application.id,
      jobTitle: application.job.title,
      company: application.job.company,
      jobDescription: application.job.description || application.job.title,
    });
    setMatchResult(res);
  };

  const handleGenerateCoverLetter = async () => {
    const res = await coverLetterMutation.mutateAsync({
      applicationId: application.id,
      jobTitle: application.job.title,
      company: application.job.company,
      jobDescription: application.job.description,
      customTone: coverTone,
    });
    setCoverLetter(res.coverLetter);
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2500);
  };

  const handleGenerateInterviewPrep = async () => {
    const res = await interviewPrepMutation.mutateAsync({
      applicationId: application.id,
      jobTitle: application.job.title,
      company: application.job.company,
      jobDescription: application.job.description,
    });
    setInterviewPrep(res);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex-1 pr-4">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 mb-1">
              {application.job.source}
            </span>
            <h2 className="text-base font-bold text-slate-900">{application.job.title}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {application.job.company}
              </span>
              {application.job.location && (
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {application.job.location}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mt-2 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2 px-1 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Application Details
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-2 px-1 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" /> AI Assistant (Gemini)
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          {activeTab === 'details' ? (
            <>
              {/* Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Status</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                    className="mt-1 w-full bg-white border border-slate-300 rounded p-1 text-xs font-semibold focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="SAVED">Saved</option>
                    <option value="APPLIED">Applied</option>
                    <option value="SCREENING">Screening</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Salary</span>
                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {application.job.salaryMin || application.job.salaryMax ? (
                      `$${application.job.salaryMin?.toLocaleString() || ''} - $${application.job.salaryMax?.toLocaleString() || ''}`
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Deadline</span>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="mt-1 w-full bg-white border border-slate-300 rounded p-1 text-xs outline-none"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Follow-Up Date</span>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="mt-1 w-full bg-white border border-slate-300 rounded p-1 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <a
                  href={application.job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  View original job posting on {application.job.source} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Personal Notes & Research</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add key talking points, recruiter name, compensation target..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
                />
              </div>

              {application.job.description && (
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Job Description</label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {application.job.description}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* AI Copilot Tab */
            <div className="space-y-6">
              {/* Feature 1: Resume-to-Job Match Score */}
              <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <h3 className="font-bold text-xs text-slate-900">Resume & Skill Match Analysis</h3>
                  </div>
                  <button
                    onClick={handleRunMatchScore}
                    disabled={matchScoreMutation.isPending}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs transition disabled:opacity-50 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {matchScoreMutation.isPending ? 'Analyzing...' : 'Calculate Score'}
                  </button>
                </div>

                {matchResult ? (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-black text-purple-700 bg-white border border-purple-200 px-3 py-1 rounded-xl">
                        {matchResult.matchScore}%
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{matchResult.summary}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Matching Skills</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {matchResult.matchingSkills.map((s) => (
                          <span
                            key={s}
                            className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Missing / Recommended Skills</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {matchResult.missingSkills.map((s) => (
                          <span
                            key={s}
                            className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded"
                          >
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Click "Calculate Score" to analyze how well your engineering background aligns with this job description.
                  </p>
                )}
              </div>

              {/* Feature 2: Tailored Cover Letter Generator */}
              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-bold text-xs text-slate-900">Tailored Cover Letter Generator</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={coverTone}
                      onChange={(e) => setCoverTone(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs outline-none"
                    >
                      <option value="Professional and Confident">Professional</option>
                      <option value="Enthusiastic and Passionate">Enthusiastic</option>
                      <option value="Concise and Direct">Concise</option>
                    </select>
                    <button
                      onClick={handleGenerateCoverLetter}
                      disabled={coverLetterMutation.isPending}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition disabled:opacity-50 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      {coverLetterMutation.isPending ? 'Drafting...' : 'Generate Letter'}
                    </button>
                  </div>
                </div>

                {coverLetter ? (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-end">
                      <button
                        onClick={handleCopyCoverLetter}
                        className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        {copiedCoverLetter ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Letter
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                      {coverLetter}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Draft a customized cover letter highlighting relevant technical accomplishments for this role.
                  </p>
                )}
              </div>

              {/* Feature 3: Interview Question Prep */}
              <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-700" />
                    <h3 className="font-bold text-xs text-slate-900">Role Interview Question Prep</h3>
                  </div>
                  <button
                    onClick={handleGenerateInterviewPrep}
                    disabled={interviewPrepMutation.isPending}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold text-xs transition disabled:opacity-50 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {interviewPrepMutation.isPending ? 'Generating...' : 'Generate Questions'}
                  </button>
                </div>

                {interviewPrep ? (
                  <div className="space-y-2.5 pt-2">
                    {interviewPrep.questions.map((q, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {q.category}
                          </span>
                          <span className="text-slate-400">Question #{idx + 1}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900">{q.question}</p>
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="font-semibold text-indigo-700">Strategy:</span> {q.suggestedAnswerStrategy}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Generate role-tailored technical, behavioral, and architecture questions with answering strategies.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-medium text-xs transition"
          >
            <Trash2 className="w-4 h-4" /> Delete Application
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Changes Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
