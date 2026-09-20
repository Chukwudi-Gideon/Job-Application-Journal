
import { 
  EyeOff, 
  FileText, 
  ShieldAlert, 
  CalendarClock, 
  Flame 
} from 'lucide-react';

interface QuickStartGuideProps {
  onClose: () => void;
}

export const QuickStartGuide = ({ onClose }: QuickStartGuideProps) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 animate-fade-in shadow-sm transition-colors duration-200">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase bg-slate-800/40 px-2 py-0.5 rounded-md border border-slate-700/50">
            Documentation
          </span>
          <h2 className="text-xl font-bold text-slate-100 font-display mt-1">
            Quick Start Guide
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Everything you need to manage job applications, review progress, and keep your tracking workflow clean and focused.
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 self-start sm:self-center text-[11px] font-mono text-slate-300 hover:text-white border border-slate-700 bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-full uppercase transition-colors cursor-pointer shadow-sm"
        >
          <EyeOff className="w-3.5 h-3.5" />
          Dismiss
        </button>
      </div>

      {/* Quick usage steps */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
          How to Use the Journal
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-100">Add a new application</h4>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Click <strong className="text-slate-100">+ New Application</strong> to open the form. Enter the company, role, source, method, and any notes you want to keep for this job opportunity.
            </p>
            <ul className="mt-3 space-y-2 text-[11px] text-slate-300">
              <li>Use the description field for full job details and preparation notes.</li>
              <li>Choose the right status so the app can keep active and archive views accurate.</li>
              <li>Save and return later to update interview outcomes, offer details, or follow-up reminders.</li>
            </ul>
          </div>

          <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-100">Track progress and updates</h4>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Every entry is displayed in the dashboard as a card. Use the card controls to edit notes, update status, and keep the job timeline current.
            </p>
            <ul className="mt-3 space-y-2 text-[11px] text-slate-300">
              <li>Update status when you move from Applied → Interviewing → Offered.</li>
              <li>Mark roles as Rejected, Unresponsive, or Accepted to cleanly archive completed entries.</li>
              <li>Review the latest activity count and use the search bar to find jobs by company, role, or notes.</li>
              <li>Saved records live in the connected project, not only in the current tab. In plain English: they can usually be recovered on the same browser/device setup, and may also appear elsewhere only if the same app project is connected there.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed feature highlights */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
          Useful Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-4 p-5 bg-slate-800/40 border border-slate-800/80 rounded-2xl shadow-sm">
            <div className="p-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 shrink-0 self-start">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide font-display">
                Keep full context
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Store the original job description, application notes, or interview prep content directly with each record so nothing important is lost between sessions.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-slate-800/40 border border-slate-800/80 rounded-2xl shadow-sm">
            <div className="p-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-rose-400 shrink-0 self-start">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide font-display">
                Duplicate protection
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The app checks for matching company and role combos before saving. This helps avoid duplicate tracking entries for the same application.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-slate-800/40 border border-slate-800/80 rounded-2xl shadow-sm">
            <div className="p-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-amber-400 shrink-0 self-start">
              <CalendarClock className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide font-display">
                Automatic status cleanup
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The system highlights old activity and can automatically move stale applications into archive status to keep your active list relevant.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-slate-800/40 border border-slate-800/80 rounded-2xl shadow-sm">
            <div className="p-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-emerald-400 shrink-0 self-start">
              <Flame className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide font-display">
                Progress visibility
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The card view and dashboard tabs keep your active pipeline separate from archived history so you can focus on what's next in your job search.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Practical tips */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
          Practical Tips
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-100">Use notes consistently</h4>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Add interview notes, next steps, and recruiter communications to each job. That context makes follow-up and decision-making faster later.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-100">Keep statuses updated</h4>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Move roles through the workflow as soon as something changes. Active roles stay visible, while finished applications are archived cleanly. This is not a personal account system, so recovery depends on the same project setup being available. If you switch browsers or devices, your records are not guaranteed to follow unless the same connected app/project is being used.
            </p>
          </div>
        </div>
      </div>

      {/* About the project */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
          About this project
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-100">Purpose</h4>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Job Application Journal is a personal workflow tool for managing the recruiting process, keeping notes in one place, and maintaining a clean record of active and completed opportunities.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-100">Data protection & transparency</h4>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              The app stores job-search records in Supabase using anonymous session-based authentication. It is intended for personal tracking only and is not designed to hold sensitive identity data, credentials, or formal HR records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
