
import { useState, useEffect } from 'react';
import { 
    CheckCircle2,
  MapPin, 
  AlertCircle,  
  History, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Edit, 
  ExternalLink,
  HeartHandshake,
  File,
  Trophy
} from 'lucide-react';
import type { JobApplication, JobStatus } from '../types';
import { SOFT_LANDING_MESSAGE } from '../data';

interface JobCardProps {
  app: JobApplication;
  onUpdate: (app: JobApplication) => void;
  onDelete: (id: string) => void;
  startExpanded?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  app,
  onUpdate,
  onDelete,
  startExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(startExpanded);
  const [isEditingDocs, setIsEditingDocs] = useState(false);
  const [showSoftLanding, setShowSoftLanding] = useState(false);

  // Added string fallbacks to prevent runtime crashes when invoking .trim()
  const [cvVersion, setCvVersion] = useState(app.cvVersion || '');
  const [description, setDescription] = useState(app.description || '');
  const [personalNotes, setPersonalNotes] = useState(app.personalNotes || '');

  const [salaryRequested, setSalaryRequested] = useState(app.salaryRequested || '');
  const [salaryOffered, setSalaryOffered] = useState(app.salaryOffered || '');
  const [url, setUrl] = useState(app.url || '');

  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string; size: number; data: string; } | null>(app.uploadedFile || null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Follow-up customization states
  const [followUpIntervalDays, setFollowUpIntervalDays] = useState<number>(app.followUpIntervalDays || 7);
  const [customFollowUpDays, setCustomFollowUpDays] = useState<string>((app.followUpIntervalDays && ![5, 7, 10, 14].includes(app.followUpIntervalDays)) ? String(app.followUpIntervalDays) : '');
  const [followUpType, setFollowUpType] = useState<'preset' | 'custom'>((app.followUpIntervalDays && ![5, 7, 10, 14].includes(app.followUpIntervalDays)) ? 'custom' : 'preset');

  const [showApprovedMessage, setShowApprovedMessage] = useState(false);
  const [hasFollowUpAcknowledged, setHasFollowUpAcknowledged] = useState(false);

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

  // Optimized to read the file into an ArrayBuffer once to extract both plain text and DataURLs safely
  const processFile = async (file: File) => {
    setFileError(null);
    if (file.size > 1.5 * 1024 * 1024) {
      setFileError('File exceeds 1.5MB limit. Please choose a smaller file.');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();

      // Extract plain text contents if it's a text file
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(buffer);
        setDescription(text);
      }

      // Map the array buffer to a Base64 binary string using stack-safe memory chunks
      const bytes = new Uint8Array(buffer);
      let binary = '';
      const chunkSize = 0xffff; 
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
      }
      const base64String = btoa(binary);
      const dataUrl = `data:${file.type || 'application/octet-stream'};base64,${base64String}`;

      setUploadedFile({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        data: dataUrl,
      });
    } catch (error) {
      setFileError('An error occurred while processing the file.');
    }
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
    setFileError(null);
  };

  // Sync edits if parent state updates
  useEffect(() => {
    setCvVersion(app.cvVersion || '');
    setPersonalNotes(app.personalNotes || '');
    setDescription(app.description || '');
    setSalaryRequested(app.salaryRequested || '');
    setSalaryOffered(app.salaryOffered || '');
    setUrl(app.url || '');
    setUploadedFile(app.uploadedFile || null);
    setFollowUpIntervalDays(app.followUpIntervalDays || 7);
    
    const isCustomDays = app.followUpIntervalDays && ![5, 7, 10, 14].includes(app.followUpIntervalDays);
    setFollowUpType(isCustomDays ? 'custom' : 'preset');
    setCustomFollowUpDays(isCustomDays ? String(app.followUpIntervalDays) : '');
  }, [app]);

  // Calculations for dates & feedback
  const updatedDate = new Date(app.updatedAt);
  const appliedDate = new Date(app.appliedAt);

  const daysSinceApplied = Math.floor(
    (new Date().getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysSinceUpdated = Math.floor(
    (new Date().getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Follow-up reminder logic: If status = "Applied" & >= customized reminder days
  const followUpInterval = app.followUpIntervalDays || 7;
  const needsFollowUpReminder = app.status === 'Applied' && daysSinceApplied >= followUpInterval && !hasFollowUpAcknowledged;

  // 2. Ghosting recommendation logic: If 30 days without response/update
  const showUnresponsiveSuggestion = 
    app.status !== 'Unresponsive' && 
    app.status !== 'Rejected' && 
    app.status !== 'Offered' && 
    daysSinceUpdated >= 30;

// Handle status update
const handleStatusChange = (newStatus: JobStatus) => {
  if (newStatus === 'Rejected' || newStatus === 'Unresponsive') {
    setShowSoftLanding(true);
    setShowApprovedMessage(false);
    setTimeout(() => {
      setShowSoftLanding(false);
    }, 8000);
  } else if (newStatus === 'Offered') {
    setShowApprovedMessage(true);
    setShowSoftLanding(false);
    setTimeout(() => {
      setShowApprovedMessage(false);
    }, 8000);
  } else {
    setShowSoftLanding(false);
    setShowApprovedMessage(false);
  }

  onUpdate({
    ...app,
    status: newStatus,
    updatedAt: new Date().toISOString()
  });
};


  // Save all textual inline edits
  const handleSaveEdits = () => {
    onUpdate({
      ...app,
      cvVersion: cvVersion.trim(),
      personalNotes: personalNotes.trim(),
      description: description.trim(),
      salaryRequested: salaryRequested.trim(),
      salaryOffered: salaryOffered.trim(),
      url: url.trim(),
      uploadedFile,
      followUpIntervalDays,
      updatedAt: new Date().toISOString()
    });
    setIsEditingDocs(false);
  };

 

  const getStatusStyle = (status: JobStatus) => {
    switch (status) {
      case 'Applied': return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'In Review': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Interviewing': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Offered': return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
      case 'Rejected': return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Unresponsive': return 'bg-slate-100 text-slate-600 border-slate-300';
      case 'Accepted': return 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50 font-bold'
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 hover:border-slate-700/80 shadow-md overflow-hidden transition-all duration-200 text-slate-100">
      
      {/* Top Warning suggestions / Reminders */}
      {needsFollowUpReminder && (
        <div className="bg-amber-950/40 border-b border-amber-900/50 px-5 py-2.5 flex items-center justify-between gap-3">
          <span className="text-[11px] text-amber-200 font-medium font-mono flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            No feedback received in {daysSinceApplied} days. Consider sending a calm follow-up or outreach.
          </span>
          <button
            onClick={() => setHasFollowUpAcknowledged(true)}
            className="text-[10px] bg-amber-900/30 text-amber-200 hover:bg-amber-900/50 px-3 py-1 rounded-full border border-amber-800/80 font-mono transition uppercase font-semibold"
          >
            Mark Followed Up
          </button>
        </div>
      )}

      {showUnresponsiveSuggestion && (
        <div className="bg-slate-850 border-b border-slate-800 px-5 py-2.5 flex items-center justify-between">
          <span className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-slate-500" />
            Zero interactions recorded for 30+ days. Auto-archive recommendation.
          </span>
          <button
            onClick={() => handleStatusChange('Unresponsive')}
            className="text-[10px] bg-slate-100 text-slate-900 hover:bg-slate-200 px-3 py-1 rounded-full font-mono transition uppercase font-semibold"
          >
            Mark Unresponsive
          </button>
        </div>
      )}

      {/* Main Bar Info */}
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Core details with branding icon */}
        <div className="flex-1 flex gap-4 items-start">
          
          {/* Custom elegant branding logo placeholder */}
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-100 flex items-center justify-center font-display font-bold text-xl uppercase tracking-wider shrink-0 shadow-sm border border-slate-700 select-none">
            {app.companyName.charAt(0)}
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-mono uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                {app.status}
              </span>
              <span className="text-[10px] bg-slate-800 font-mono text-slate-300 px-2 py-0.5 rounded uppercase font-bold tracking-wider border border-slate-700/50">
                {app.source}
              </span>
              <span className="text-[10px] bg-slate-850 text-slate-400 font-mono px-2 py-0.5 rounded uppercase tracking-wider border border-slate-800">
                {app.method}
              </span>
              {app.location && (
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" /> {app.location}
                </span>
              )}
            </div>
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-100 tracking-tight">
                  {app.companyName}
                </h3>
                <p className="text-sm font-medium text-slate-400">
                  {app.role}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
  
{/* Job Type Time Badge */}
{app.jobTime?.type && (
  <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-850 border border-slate-800 text-slate-400 uppercase">
    ⏰ {app.jobTime.type} {app.jobTime.expectedHours ? `(${app.jobTime.expectedHours}h)` : ''}
  </span>
)}

  {/* Active Automated Wishlist Tracking Status Flag */}
  {app.status === 'Wishlist' && app.wishlistReminder?.enabled && (
    <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 uppercase animate-pulse">
      ⚡ Auto-Remind: T-{Math.ceil((new Date(app.wishlistReminder.remindAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days
    </span>
  )}
  
</div>
              {/* Short mini stats display */}
              <div className="text-right shrink-0">
                {salaryRequested && (
                  <div className="text-[11px] text-slate-400 font-mono">
                    Requested: <span className="text-slate-200 font-bold">{salaryRequested}</span>
                  </div>
                )}
                {salaryOffered && (
                  <div className="text-[11px] text-indigo-400 font-mono">
                    Offered: <span className="text-indigo-200 font-bold">{salaryOffered}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
              <span className="uppercase tracking-wider">Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
              <span className="italic">Last updated: {daysSinceUpdated === 0 ? "today" : `${daysSinceUpdated} days ago`}</span>
            </div>
          </div>
          
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 shrink-0 justify-start md:justify-end border-t border-slate-800 md:border-t-0">
          {/* Quick status chooser */}
     <select
  value={app.status}
  onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
  /* Added max-w-[160px], truncate, and pr-8 to make room for your chevron */
  className="w-full sm:w-auto max-w-[160px] text-xs border border-slate-700 rounded-full bg-slate-850 hover:bg-slate-800 pl-3 pr-8 py-1.5 text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono  truncate cursor-pointer"
>
  {/* Explicitly adding bg-slate-900 to options makes the browser popover look cleaner */}
  <option value="Applied" className="bg-slate-900 text-slate-200">Applied</option>
  <option value="In Review" className="bg-slate-900 text-slate-200">In Review</option>
  <option value="Interviewing" className="bg-slate-900 text-slate-200">Interviewing</option>
  <option value="Wishlist" className="bg-slate-900 text-slate-200">Wishlist</option>
  <option value="Offered" className="bg-slate-900 text-slate-200">Offered</option>
  <option value="Accepted" className="bg-slate-900 text-slate-200">🎉 Accepted</option>
  <option value="Rejected" className="bg-slate-900 text-slate-200">Rejected</option>
  <option value="Unresponsive" className="bg-slate-900 text-slate-200">Unresponsive</option>
</select>

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-slate-700 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-800 transition-colors"
              title="Visit original listing"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-mono font-medium px-4 py-1.5 border border-slate-700 rounded-full text-slate-300 hover:bg-slate-800 flex items-center gap-1 transition-all uppercase tracking-wider"
          >
            <span>{isExpanded ? "Hide Details" : "View more details"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              if (window.confirm(`Delete application for ${app.role} at ${app.companyName}?`)) {
                onDelete(app.id);
              }
            }}
            className="p-2 border border-slate-700 text-slate-500 hover:text-rose-400 rounded-full hover:bg-rose-950/30 transition-all"
            title="Delete application record"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
{app.status === 'Accepted' && (
  <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 mb-4 shadow-xl shadow-emerald-950/20 animate-fade-in">
    <div className="absolute top-2 right-4 text-emerald-400/30 text-xs animate-pulse font-mono">congrats</div>
    <div className="flex items-center gap-4 relative z-10">
         <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 rounded-xl shadow-lg shadow-yellow-500/10 transform hover:scale-110 transition duration-300 group cursor-default">
  <Trophy className="w-5 h-5" />
</div>


      <div className="space-y-0.5 text-left">
        <span className="font-mono text-[9px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Landed & Confirmed
        </span>
        <h4 className="text-sm font-mono font-bold text-slate-100 tracking-tight mt-1">
          Congratulations! Best of luck in your new job!
        </h4>
        <p className="text-[11px] text-slate-400 font-mono">
        It’s official! Offer signed and saved to your history. 🎉
        </p>
      </div>
    </div>
    
  </div>
)}
      {/* The Soft Landing Banner (Triggers on negative status change) */}
      {showSoftLanding && (
        <div className="bg-rose-950/30 border-t border-b border-rose-900/40 p-4 shrink-0 flex items-center gap-3 animate-fade-in">
          <div className="p-1.5 bg-rose-900/40 text-rose-300 rounded-lg shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <p className="text-xs text-rose-200 leading-relaxed font-sans">
            "{SOFT_LANDING_MESSAGE}"
          </p>
          <button
            onClick={() => setShowSoftLanding(false)}
            className="text-xs text-rose-400 hover:text-rose-300 font-mono ml-auto shrink-0"
          >
            [Close reassurance]
          </button>
        </div>
      )}

      {/* The Approved/Success Banner (Triggers on milestone completion or offer) */}
      {showApprovedMessage && (
        <div className="bg-emerald-950/30 border-t border-b border-emerald-900/40 p-4 shrink-0 flex items-center gap-3 animate-fade-in">
          <div className="p-1.5 bg-emerald-900/40 text-emerald-300 rounded-lg shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs text-emerald-200 leading-relaxed font-sans font-medium">
You're making great progress! Every step forward proves your hard work. Keep it up!
          </p>
          <button
            onClick={() => setShowApprovedMessage(false)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-mono ml-auto shrink-0"
          >
            [Dismiss]
          </button>
        </div>
      )}

      {/* Expanded specifications & memory vault modules */}
      {isExpanded && (
        <div className="border-t border-slate-800 bg-slate-850/40 p-5 space-y-6">
          
          {/* Action Bar for export selection and edit state */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 animate-fade-in">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                Application Details
              </span>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Manage description, original requirements, and custom files</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingDocs(!isEditingDocs)}
                className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3.5 py-2 rounded-full transition uppercase font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{isEditingDocs ? "Cancel" : "Edit Application Records"}</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* RIGHT SIDE: Description snapshot, phrasing, custom comments, edits */}
            <div className="space-y-4">
              
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                    Custom Document Mapping & Prompts
                  </span>
                  
                 
                </div>

                {isEditingDocs ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Tailored CV Version</label>
                      <input
                        type="text"
                        value={cvVersion}
                        onChange={(e) => setCvVersion(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-700 bg-slate-850 text-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Personal Notes</label>
                      <textarea
                        value={personalNotes}
                        onChange={(e) => setPersonalNotes(e.target.value)}
                        placeholder="Topics discussed, questions asked, prep thoughts..."
                        rows={5}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-700 bg-slate-850 text-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* File Attachment & Description snapshot splits */}
                    <div className="space-y-3">
                      <div className="border border-slate-700 p-3.5 rounded-xl bg-slate-850/50 space-y-2">
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Attached Snap Document (PDF, DOCX, TXT)</label>
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border border-dashed rounded-xl p-3 flex flex-col items-center justify-center transition-all ${
                            isDragging 
                              ? 'border-indigo-400 bg-slate-800' 
                              : uploadedFile 
                                ? 'border-emerald-600 bg-emerald-950/20' 
                                : 'border-slate-700 bg-slate-900/70'
                          }`}
                        >
                          <input
                            type="file"
                            id={`job-card-file-${app.id}`}
                            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          
                          {uploadedFile ? (
                            <div className="text-center space-y-1">
                              <p className="text-[11px] font-mono font-bold text-slate-200 truncate max-w-[200px]">{uploadedFile.name}</p>
                              <p className="text-[9px] text-slate-500 font-mono">({(uploadedFile.size / 1024).toFixed(1)} KB)</p>
                              <button
                                type="button"
                                onClick={clearUploadedFile}
                                className="text-[10px] text-rose-400 hover:text-rose-300 font-mono font-bold flex items-center gap-1 mx-auto"
                              >
                                <Trash2 className="w-3 h-3" /> [Remove]
                              </button>
                            </div>
                          ) : (
                            <label htmlFor={`job-card-file-${app.id}`} className="text-center cursor-pointer py-1.5 block w-full">
                              <p className="text-[11px] font-mono text-slate-300 font-bold">
                                Drag document or <span className="text-indigo-400 underline">browse</span>
                              </p>
                              <p className="text-[9px] text-slate-500 font-mono mt-0.5">PDF, DOCX, TXT up to 1.5MB</p>
                            </label>
                          )}
                        </div>
                        {fileError && (
                          <p className="text-[10px] text-rose-400 font-mono">{fileError}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Job Description Snapshot (Text)</label>
                        <textarea
                          placeholder="Paste details of the role..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={7}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-700 bg-slate-850 text-slate-100 rounded font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Salary Requested</label>
                        <input
                          type="text"
                          value={salaryRequested}
                          onChange={(e) => setSalaryRequested(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-700 bg-slate-850 text-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Salary Offered</label>
                        <input
                          type="text"
                          value={salaryOffered}
                          onChange={(e) => setSalaryOffered(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-700 bg-slate-850 text-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Follow up timing customized edit choice */}
                    <div className="border border-slate-700 p-3 rounded-lg bg-slate-850 space-y-1.5">
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Follow-up Reminder Alert (Applied Status)</label>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[5, 7, 10, 14].map((days) => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => {
                              setFollowUpType('preset');
                              setFollowUpIntervalDays(days);
                            }}
                            className={`text-[10px] px-2.5 py-1 rounded transition-all font-mono border ${
                              followUpType === 'preset' && followUpIntervalDays === days
                                ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {days}d
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setFollowUpType('custom');
                          }}
                          className={`text-[10px] px-2.5 py-1 rounded transition-all font-mono border ${
                            followUpType === 'custom'
                              ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          Custom
                        </button>
                        {followUpType === 'custom' && (
                          <div className="flex items-center gap-1 pl-1">
                            <input
                              type="number"
                              min={1}
                              max={90}
                              placeholder="Days"
                              value={customFollowUpDays}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomFollowUpDays(val);
                                const num = parseInt(val, 10);
                                if (!isNaN(num) && num > 0) {
                                  setFollowUpIntervalDays(num);
                                }
                              }}
                              className="w-14 px-1.5 py-1 border border-slate-700 bg-slate-900 text-slate-100 rounded text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <span className="text-[9px] text-slate-400 font-mono">days</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-500 font-mono italic">Prompt triggers in: <span className="font-bold text-slate-300">{followUpIntervalDays} days</span> of inactivity.</p>
                    </div>

<div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Job URL</label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-700 bg-slate-850 text-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveEdits}
                      className="w-full bg-indigo-600 text-white text-xs font-mono py-2 rounded-lg hover:bg-indigo-500 transition font-bold cursor-pointer"
                    >
                      Save All Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    
                    {/* CV Used */}
                    <div className="border-b border-slate-800 pb-3">
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase block mb-1">Tailored CV Version</span>
                      <p className="text-slate-200 font-medium font-mono bg-slate-900 p-2 rounded border border-slate-800">
                        {app.cvVersion || <span className="text-slate-500 italic">No specific CV variant noted</span>}
                      </p>
                    </div>

                    {/* Personal Notes */}
                    <div className="border-b border-slate-800 pb-3">
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase block mb-1">Personal Notes</span>
                      <p className="text-slate-300 leading-relaxed bg-slate-900 p-2 rounded whitespace-pre-wrap border border-slate-800">
                        {app.personalNotes || <span className="text-slate-500 italic">No notes written yet. Write your questions, ideas and tactics here.</span>}
                      </p>
                    </div>

                    {/* Snapshot box - Primary differentiator */}
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase block mb-1">Saved Job description snap (Memory Vault)</span>
                      {app.uploadedFile && (
                        <div className="bg-emerald-950/20 border border-emerald-900/50 p-3 rounded-xl flex items-center justify-between mb-2 animate-fade-in">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-900/40 text-emerald-300 rounded">
                              <File className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-mono font-bold text-slate-200 truncate max-w-[220px]">{app.uploadedFile.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono font-medium">({(app.uploadedFile.size / 1024).toFixed(1)} KB)</p>
                            </div>
                          </div>
                          <a
                            href={app.uploadedFile.data}
                            download={app.uploadedFile.name}
                            className="text-[10px] font-mono bg-emerald-600 hover:bg-emerald-50 text-white px-3 py-1.5 rounded-full transition font-bold"
                          >
                            Download File
                          </a>
                        </div>
                      )}
                      <div className="bg-slate-900 text-slate-300 font-mono text-[11px] p-3 rounded-lg max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800 select-text">
                        {app.description || <span className="text-slate-500 italic">No Job Description pasted yet. (Use the Edit button above to paste, ensuring you don't lose the requirements!).</span>}
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      
    
   

    </div>
  );
};


