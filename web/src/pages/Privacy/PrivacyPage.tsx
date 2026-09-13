import { Shield, ArrowLeft, Lock, Database, Eye, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">JobTrack Privacy Policy</h1>
              <p className="text-xs text-slate-500">Effective Date: September 14, 2026</p>
            </div>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/70 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to App
          </Link>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              1. Overview & Single Purpose
            </h2>
            <p>
              JobTrack is designed with a single purpose: to help individuals organize, track, and optimize their job application workflow. 
              Our Chrome Web Extension enables users to capture job postings directly from online job platforms (such as LinkedIn, Indeed, and Glassdoor) 
              and synchronize them with their private JobTrack dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              2. Information We Collect
            </h2>
            <p className="mb-2">We only collect data strictly necessary to provide the service:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong className="text-slate-800">Account Credentials:</strong> Name and email address used for secure account creation, JWT authentication, or Google Sign-In.
              </li>
              <li>
                <strong className="text-slate-800">User-Initiated Job Postings:</strong> When you explicitly click "Save Application" or "Capture Job", the extension extracts job title, company name, location, job description, salary range, and posting URL from the active tab.
              </li>
              <li>
                <strong className="text-slate-800">Application Progress:</strong> Interview dates, application status stages (Applied, Interviewing, Offer, Rejected), and user notes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              3. Extension Permissions & Usage
            </h2>
            <p className="mb-2">The JobTrack Chrome Extension requests the following browser permissions:</p>
            <div className="space-y-2 border border-slate-100 rounded-xl p-4 bg-slate-50/50">
              <div>
                <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-200/70 px-1.5 py-0.5 rounded">storage</span>
                <span className="text-xs text-slate-600 ml-2">Securely stores your authentication token and cached job preferences locally.</span>
              </div>
              <div>
                <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-200/70 px-1.5 py-0.5 rounded">activeTab / scripting</span>
                <span className="text-xs text-slate-600 ml-2">Extracts relevant job posting data only when you activate the extension on a supported career page.</span>
              </div>
              <div>
                <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-200/70 px-1.5 py-0.5 rounded">host_permissions</span>
                <span className="text-xs text-slate-600 ml-2">Enables secure API synchronization with your JobTrack backend and web dashboard.</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              4. Chrome Web Store Policy Compliance
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>No Data Selling:</strong> We do not sell, rent, trade, or monetize your personal or job data to any third party or data broker.</li>
              <li><strong>No Advertising or Tracking:</strong> We do not inject ads, perform third-party tracking, or monetize user browsing history.</li>
              <li><strong>No Unrelated Use:</strong> Data is never used for credit evaluation, lending, background checks, or automated profiling.</li>
              <li><strong>End-to-End Encryption:</strong> All data transmitted between the extension, browser, and our servers is protected using TLS/HTTPS encryption.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-2">5. Data Retention & Deletion</h2>
            <p>
              You maintain complete ownership and control of your data. You can edit, archive, or delete your applications and interview records at any time from your JobTrack dashboard.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              For privacy inquiries, contact support at <a href="mailto:support@jobtrack.example" className="text-indigo-600 hover:underline">support@jobtrack.example</a> or via the GitHub repository.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
