import { X, Info, ShieldAlert, Paperclip, Trash2, FileText } from 'lucide-react';
import {File as FileIcon} from 'lucide-react'
import type { JobApplication, JobStatus, JobTimeType } from '../types';
import {useState, useEffect} from 'react';
interface AddJobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (application: Omit<JobApplication,'id' | 'user_id' | 'created_at' | 'updated_at' | 'applied_at' | 'timeline' | 'last_follow_up_at'>) => void;
  existingApps: JobApplication[];
  onViewExistingApp: (id: string) => void;
}


export function AddJobForm ({ 
    isOpen,
  onClose,
  onAdd,
  existingApps,
  onViewExistingApp
}: AddJobFormProps){
     const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [salaryRequested, setSalaryRequested] = useState('');
  const [salaryOffered, setSalaryOffered] = useState('');
  const [source, setSource] = useState('LinkedIn');
  const [method, setAppMethod] = useState('Company Site');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [status, setStatus] = useState<JobStatus>('Applied');
  const [cvVersion, setCvVersion] = useState('');
  const [customSource, setCustomSource] = useState('');
const [customMethod, setCustomMethod] = useState('');
const [jobType, setJobType] = useState<JobTimeType>('Full-Time');
const [hoursCap, setHoursCap] = useState<string>('40');
const [autoRemind, setAutoRemind] = useState<boolean>(true);
const [reminderDays, setReminderDays] = useState<number>(5);

  // Duplicate check results
  const [duplicateApp, setDuplicateApp] = useState<JobApplication | null>(null);
  const [overrideDuplicate, setOverrideDuplicate] = useState(false);


  // File snapshot upload states
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string; size: number; data: string; } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
      const [isDragging, setIsDragging] = useState(false);

    // Follow-up customization states
  const [followUpIntervalDays, setFollowUpIntervalDays] = useState<number>(7);
  const [customFollowUpDays, setCustomFollowUpDays] = useState<string>('');
const [followUpType, setFollowUpType] = useState<'preset' | 'custom'>('preset');



  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

 const handleDragLeave = () => {
    setIsDragging(false);
  };

    const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
    const processFile = (file: File) => {
    setFileError(null);
    // Limited to 1.5MB for localStorage safety
    if (file.size > 1.5 * 1024 * 1024) {
      setFileError('File exceeds 1.5MB limit. localStorage has a tight storage ceiling. Please choose a smaller file or paste plain text instead.');
      return;
    }

        // Automatically extracts plain text files into descriptions
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const textReader = new FileReader();
      textReader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setDescription(event.target.result);
        }
      };
      textReader.readAsText(file);
    }else{
    const readOtherFiles = new FileReader();
    readOtherFiles.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setUploadedFile({
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          data: event.target.result,
        });
      }
    };
      readOtherFiles.readAsDataURL(file);
    }


  
  
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
    setFileError(null);
  };

//Duplicate logic
    useEffect(() => {
    if (!companyName.trim() || !role.trim()) {
      setDuplicateApp(null);
      return;
    }

    const match = existingApps.find(
      (app) =>
        app.company_name.trim().toLowerCase() === companyName.trim().toLowerCase() &&
        app.role.trim().toLowerCase() === role.trim().toLowerCase()
    );

    setDuplicateApp(match || null);
    if (!match) {
      setOverrideDuplicate(false);
    }
  }, [companyName, role, existingApps]);


  if (!isOpen) return null;


 const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (duplicateApp && !overrideDuplicate) {
      return; // Block submission until overridden
    }
    const reminderDate = new Date();
  reminderDate.setDate(reminderDate.getDate() + reminderDays);

    const finalSource = source === 'Other' ? customSource.trim() : source;
    const finalMethod = method === 'Other' ? customMethod.trim() : method;

onAdd({
  company_name: companyName.trim(),
  role: role.trim(),
  location: (location || '').trim(),
  salary_requested: (salaryRequested || '').trim(),
  salary_offered: (salaryOffered || '').trim(),
  source: finalSource || 'Other Spontaneous Source',
  method: finalMethod || 'Other Spontaneous Method',
  url: (url || '').trim(),

  job_time: jobType
    ? {
        type: jobType,
        expectedHours:
          hoursCap && !isNaN(parseInt(hoursCap, 10))
            ? parseInt(hoursCap, 10)
            : undefined,
      }
    : undefined,

  wishlist_reminder: {
    enabled: status === 'Wishlist' ? autoRemind : false,
    remindAt: reminderDate.toISOString(),
    daysOffset: reminderDays,
  },

  description: (description || '').trim(),
  cv_version: (cvVersion || '').trim(),
  personal_notes: (personalNotes || '').trim(),
  status,
  uploaded_file: uploadedFile,
  follow_up_interval_days: followUpIntervalDays,
});


    // Reset clean states
    setCompanyName('');
    setRole('');
    setLocation('');
    setSalaryRequested('');
    setSalaryOffered('');
    setSource('LinkedIn');
    setAppMethod('Company Site');
    setUrl('');
    setDescription('');
    setPersonalNotes('');
    setStatus('Applied');
    setDuplicateApp(null);
    setOverrideDuplicate(false);
    setUploadedFile(null);
    setFileError(null);
    setFollowUpIntervalDays(7);
    setCustomFollowUpDays('');
    setFollowUpType('preset');
    onClose();
    setCvVersion('');
    setCustomSource('');
    setCustomMethod('');
  };


return (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-slate-950 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700 animate-scale-in">
      
      {/* Header */}
      <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-display font-bold text-sm">JAJ</div>
          <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">Log your next opportunity</h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-300 hover:text-white rounded-full p-1.5 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Real-time Duplicate Blocker Banner */}
        {duplicateApp && (
          <div className="bg-rose-950 border border-rose-700 rounded-xl p-4 flex gap-3 animate-pulse">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-semibold text-rose-200">
                Duplicate Warning: Already Applied!
              </h4>
              <p className="text-xs text-rose-300">
                Looks like you already applied to <strong>{duplicateApp.role}</strong> at <strong>{duplicateApp.company_name}</strong> on {new Date(duplicateApp.applied_at).toLocaleDateString()}.
              </p>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onViewExistingApp(duplicateApp.id);
                    onClose();
                  }}
                  className="text-xs font-mono font-medium text-rose-200 underline hover:text-white"
                >
                  View existing entry
                </button>
                <label className="flex items-center gap-1.5 text-xs text-rose-200 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overrideDuplicate}
                    onChange={(e) => setOverrideDuplicate(e.target.checked)}
                    className="rounded border-rose-600 text-rose-400 focus:ring-rose-500"
                  />
                  I want to add a secondary application anyway (override)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Section 1 */}
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Google, Stripe"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Role / Position *</label>
              <input
                type="text"
                required
                placeholder="e.g. Frontend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location / Office (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Remote, hybrid"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Source Finder</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-slate-700 rounded-lg text-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 appearance-none"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Company Website">Company Site</option>
                <option value="Referral / Networking">Referral / Networking</option>
                <option value="Otta">Otta</option>
                <option value="GitHub Jobs">GitHub Jobs</option>
                <option value="Other">Other (Specify below)</option>
              </select>
              {source === 'Other' && (
                <input
                  type="text"
                  required
                  placeholder="Where did you find it? (e.g. Slack)"
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-700 bg-slate-900 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500 animate-scale-in"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Application Method</label>
              <select
                value={method}
                onChange={(e) => setAppMethod(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-slate-700 rounded-lg text-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 appearance-none"
              >
                <option value="Company Site">Company Site Form</option>
                <option value="Easy Apply">Easy Apply / One-Click</option>
                <option value="Email">Email Direct</option>
                <option value="Recruiter Outreach">Recruiter Outreach</option>
                <option value="Hard Copy">Hard Copy</option>
                <option value="Other">Other (Specify below)</option>
              </select>
              {method === 'Other' && (
                <input
                  type="text"
                  required
                  placeholder="How did you apply? (e.g. Cold DM)"
                  value={customMethod}
                  onChange={(e) => setCustomMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-700 bg-slate-900 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500 animate-scale-in"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Salary Requested / Target (Optional)</label>
              <input
                type="text"
                placeholder="e.g. $85k / yr"
                value={salaryRequested}
                onChange={(e) => setSalaryRequested(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Salary Offered by Company (Optional)</label>
              <input
                type="text"
                placeholder="e.g. $75k - $90k"
                value={salaryOffered}
                onChange={(e) => setSalaryOffered(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Listing URL (Optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full px-3 py-2 pr-10 border border-slate-700 rounded-lg text-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="Applied">Applied (Just Submitted)</option>
                <option value="In Review">In Review (Awaiting contact)</option>
                <option value="Interviewing">Interviewing (Active calls)</option>
                <option value="Wishlist">Wishlist</option>
                <option value="Accepted">🎉 Accepted / Got the Job!</option>
                <option value="Offered">Offered (Under review)</option>
                <option value="Rejected">Rejected</option>
                <option value="Unresponsive">Unresponsive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2 */}

        {/* Job Timeline Type Custom Select Grid */}
<div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-4">
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Job Type(optional)</label>
    <select
      value={jobType}
      onChange={(e) => setJobType(e.target.value as JobTimeType)}
      className="text-xs border border-slate-800 rounded-xl bg-slate-950 p-3 pr-10 text-slate-200 outline-none focus:border-slate-700 font-mono transition-all appearance-none"
    >
      <option value="Full-Time">Full-Time</option>
      <option value="Part-Time">Part-Time</option>
      <option value="Contract">Contract (B2B)</option>
      <option value="Internship">Internship</option>
    </select>
  </div>

  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Weekly Hours(optional)</label>
    <input
      type="number"
      value={hoursCap}
      onChange={(e) => setHoursCap(e.target.value)}
      placeholder="e.g. 40"
      className="text-xs border border-slate-800 rounded-xl bg-slate-950 p-3 text-slate-200 outline-none focus:border-slate-700 font-mono transition-all"
    />
  </div>
</div>

{/* Conditional Wishlist Automation Parameters Block */}
{status === 'Wishlist' && (
  <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-3 font-mono text-xs text-left animate-fade-in mt-4">
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="text-slate-300 font-bold uppercase text-[10px] tracking-wider">Automate Apply Sequence</div>
        <p className="text-[11px] text-slate-500">Generate local background alert loop notification.</p>
      </div>
      <input 
        type="checkbox" 
        checked={autoRemind} 
        onChange={(e) => setAutoRemind(e.target.checked)}
        className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-indigo-500 cursor-pointer"
      />
    </div>

    {autoRemind && (
      <div className="flex items-center gap-3 pt-2 border-t border-slate-900/60 transition-all">
        <span className="text-slate-400 text-[11px]">Dispatch execution trigger in:</span>
        <input 
          type="number" 
          value={reminderDays} 
          onChange={(e) => setReminderDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
          className="w-16 text-center border border-slate-800 rounded bg-slate-900 p-1 text-xs text-slate-200 outline-none focus:border-slate-700 font-bold"
        />
        <span className="text-slate-500 text-[11px]">Days from today</span>
      </div>
    )}
  </div>
)}
        <div className="space-y-4 pt-2">
          
          <p className="text-xs text-slate-400 leading-relaxed">
            Paste the job description text below or upload a snapshot file (PDF, DOCX, TXT) to preserve  it.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Text Description</label>
              <textarea
                placeholder="Paste the job details and requirements here..."
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-[150px] px-3 py-2.5 border border-slate-700 rounded-2xl bg-slate-900 text-slate-100 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-slate-500 resize-none animate-fade-in"
              />
            </div>

            {/* Drag and Drop File Upload */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">File attachment (PDF, DOCX, TXT)</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`h-[150px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-all ${
                  isDragging 
                    ? 'border-slate-500 bg-slate-950' 
                    : uploadedFile 
                      ? 'border-emerald-500 bg-emerald-950/20' 
                      : 'border-slate-700 hover:border-slate-500 bg-slate-950/80'
                }`}
              >
                <input
                  type="file"
                  id="file-upload-input"
                  accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {uploadedFile ? (
                  <div className="text-center space-y-2">
                    <div className="p-2 bg-emerald-950 text-emerald-200 rounded-xl inline-block">
                      <FileIcon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono font-bold text-slate-100 truncate max-w-[250px]">{uploadedFile.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono font-medium">({(uploadedFile.size / 1024).toFixed(1)} KB)</p>
                    </div>
                    <button
                      type="button"
                      onClick={clearUploadedFile}
                      className="text-[10px] text-rose-500 hover:text-rose-700 font-mono hover:underline flex items-center gap-1 mx-auto"
                    >
                      <Trash2 className="w-3 h-3" /> [Remove File]
                    </button>
                  </div>
                ) : (
                  <label htmlFor="file-upload-input" className="text-center cursor-pointer space-y-2.5 block w-full">
                    <div className="p-2 bg-slate-900 border border-slate-700 text-slate-400 rounded-xl inline-block transition-transform">
                      <Paperclip className="w-6 h-6 text-slate-200" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-100 font-bold">
                        Drag & drop or <span className="text-indigo-300 underline">browse</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">PDF, DOCX, or TXT up to 1.5MB</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>

          {fileError && (
            <div className="p-3 bg-rose-950 border border-rose-700 text-rose-200 rounded-xl text-xs font-mono flex items-start gap-1.5 animate-fade-in">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{fileError}</span>
            </div>
          )}
        </div>

        {/* Section 3 */}
        <div className="space-y-4 pt-2">
        

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                CV Version Used (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. React Frontend CV v1 - tailored"
                value={cvVersion}
                onChange={(e) => setCvVersion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Personal App Notes & Outreach Logs (Optional)
            </label>
            <textarea
              placeholder="Write down notes about the phrasing used, outstanding details, or recruiter conversation details..."
              rows={5}
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Section 4 */}
        <div className="space-y-3 pt-2 bg-slate-950 border border-slate-700/60 p-5 rounded-2xl">
         
          <p className="text-xs text-slate-400 -mt-1 leading-relaxed">
            When would you like to receive an outreach prompt to follow up with the recruiter?
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[5, 7, 10, 14].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => {
                  setFollowUpType('preset');
                  setFollowUpIntervalDays(days);
                }}
                className={`text-xs px-4 py-2 rounded-full transition-all font-mono border ${
                  followUpType === 'preset' && followUpIntervalDays === days
                    ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-sm'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white shadow-xs'
                }`}
              >
                {days} Days
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFollowUpType('custom')}
              className={`text-xs px-4 py-2 rounded-full transition-all font-mono border ${
                followUpType === 'custom'
                  ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-sm'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white shadow-xs'
              }`}
            >
              Custom Interval
            </button>
            {followUpType === 'custom' && (
              <div className="flex items-center gap-1.5 animate-fade-in pl-1">
                <input
                  type="number"
                  min={1}
                  max={90}
                  placeholder="e.g. 8"
                  value={customFollowUpDays}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomFollowUpDays(val);
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num > 0) {
                      setFollowUpIntervalDays(num);
                    }
                  }}
                  className="w-20 px-3 py-1.5 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
                <span className="text-xs text-slate-400 font-mono">days</span>
              </div>
            )}
          </div>
          <div className="text-[10px] text-slate-400 font-mono italic">
            Currently configured to trigger after <span className="font-bold text-slate-100 underline">{followUpIntervalDays} days</span> of inactivity.
          </div>
        </div>

        {/* Form Actions */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 py-4 flex justify-end gap-3 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={duplicateApp !== null && !overrideDuplicate}
            className={`px-5 py-2 text-sm font-medium rounded-lg text-white shadow transition flex items-center gap-2 ${
              duplicateApp !== null && !overrideDuplicate
                ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                : 'bg-slate-800 hover:bg-slate-900 focus:ring-2 focus:ring-slate-700'
            }`}
          >
            Save Application Memory
          </button>
        </div>
      </form>
    </div>
  </div>
);















  }


  
    

    

