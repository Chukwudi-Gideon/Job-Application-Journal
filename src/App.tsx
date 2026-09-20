
import { supabase } from './lib/supabase'
import{ useState, useEffect} from 'react';
import { PlusCircle, Search, HelpCircle, Archive, Briefcase, FolderLock } from 'lucide-react';
import type { JobApplication } from './types';
import { AddJobForm } from './components/AddJobs';
import { INITIAL_TIMELINE_STEPS } from './data';
import {QuickStartGuide} from './components/QuickStartGuide'
import { Quotes_Perspectives } from './components/Quotes_Perspectives';
import {JobCard} from './components/JobCard'
import { getAnonymousUser } from './lib/auth';
import { Analytics } from "@vercel/analytics/next"
type ToastType = 'success' | 'archive' | 'system';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

function App() {
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'system' })
  const [applications, setApplications] = useState<JobApplication[]>([])

  const [showGuide, setShowGuide] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'archive' | 'all'>('active');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [focusedAppId, setFocusedAppId] = useState<string | null>(null);

  useEffect(()=>{
    const loadApplications = async () => {
      const { data, error } = await supabase.from('job_applications').select("*").order('created_at', {ascending: false})
    
      if(error){
        console.error('Failed to load applications', error);
        return;
      }
        setApplications(data)
    };
  loadApplications();

  }, [])

    // Add new application
  const handleAddApplication = async (newFields: Omit<JobApplication, 'id'|'user_id' | 'created_at' | 'updated_at' | 'applied_at' | 'timeline' | 'last_follow_up_at'>) => {
    const user = await getAnonymousUser();
    if (!user) {
      console.error('User not authenticated');
      return;
    }
  
    const nowISO = new Date().toISOString();

const { data, error} = await supabase.from('job_applications').insert({
  ...newFields,   user_id: user.id, created_at: nowISO, applied_at: nowISO, updated_at: nowISO, timeline: INITIAL_TIMELINE_STEPS(nowISO)

}).select().single();
if(error){
  console.error('Create Application Error',error);
   console.log('Create Application Error',error);
  return
}
setApplications(prev => [data, ...prev]);
    triggerNotification(
    `Application for ${data.role} at ${data.company_name} successfully saved.`, 
    'success'
  );
  };

    // Update application
const handleUpdateApplication = async (updated: JobApplication) => {
  const user = await getAnonymousUser();
  if (!user) {
    console.error('User not authenticated');
    return;
  }
  const oldApp = applications.find((app) => app.id === updated.id);
  const { data, error} = await supabase.from('job_applications').update({...updated, 
    updated_at: new Date().toISOString()
  }).eq('id', updated.id).eq('user_id', user.id).select().single();

  if(error){
    console.error('Database update function error', error);
    return;
  }
  setApplications(prev => prev.map(app => app.id === updated.id? data: app));

  //  Verify the status actually changed (prevents double-triggering notifications)
  if (oldApp && oldApp.status !== updated.status) {
    
    //Check if the new status qualifies as an archive status
    const wasArchivedNow = 
      updated.status === 'Rejected' || 
      updated.status === 'Unresponsive' || 
      updated.status === 'Accepted'; 

    if (wasArchivedNow) {
      triggerNotification(
        `Record status updated and transferred to Archive history .`, 
        'archive'
      );
    }
  }
};


 const handleDeleteApplication = async (id: string) => {
  const user = await getAnonymousUser();
  if (!user) {
    console.error('User not authenticated');
    return;
  }
  const {error} = await supabase.from('job_applications').delete().eq('id', id).eq('user_id', user.id).select().single();

  if(error){
    console.error("Database delete function is throwing an error", error);
  };
  setApplications(prev => prev.filter(app => app.id !== id))
 

    if (focusedAppId === id) setFocusedAppId(null);
  };


    const handleScrollToActive = () => {
    setActiveTab('active');
    setStatusFilter('All');
    setTimeout(() => {
      const element = document.getElementById('journal-section-target');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };
  const triggerNotification = (message: string, type: ToastType) => {
  setToast({ visible: true, message, type });
  setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 5000); 
};

  // Focus a specific entry (e.g. from the duplicate blocker alert link)
  const handleFocusApplication = (id: string) => {
  setFocusedAppId(id);
  const targetApp = applications.find(a => a.id === id);
  if (targetApp) {
    const isArchived = 
      targetApp.status === 'Rejected' || 
      targetApp.status === 'Unresponsive' || 
      targetApp.status === 'Accepted';

    setActiveTab(isArchived ? 'archive' : 'active');
    setStatusFilter('All');
    setSearchQuery('');
  }
};

    // Filtering Logic
    const filteredApps = applications.filter((app) => {
      // 1. Tab check: Active vs Archive
      // Treat `Accepted` as a finalized/archived status so it appears in Archive
      const isArchived = app.status === 'Rejected' || app.status === 'Unresponsive' || app.status === 'Accepted';
      if (activeTab === 'active' && isArchived) return false;
      if (activeTab === 'archive' && !isArchived) return false;

    // 2. Status filter pill check
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;

      // 3. Robust Search Query
if (searchQuery.trim()) {
  const q = searchQuery.toLowerCase();
  const bodyText = (
    (app.company_name || '') + ' ' + 
    (app.role || '') + ' ' + 
    (app.location || '') + ' ' + 
    (app.description || '') + ' ' + 
    (app.cv_version || '') + ' ' + 
    (app.personal_notes || '')
  ).toLowerCase();
  
  return bodyText.includes(q);
}

    return true;
  });

  // Count helper statistics
  const activeCount = applications.filter((app) => app.status !== 'Rejected' && app.status !== 'Unresponsive' && app.status !== 'Accepted').length;
  const archivedCount = applications.filter((app) => app.status === 'Unresponsive' || app.status === 'Rejected' || app.status === 'Accepted').length;




  return (
   <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-slate-200 selection:text-slate-950 pb-12">
       
      {/* Header */}
     <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-700/60 pb-6">
    
    {/* Title Section - Kept completely original and visible on all screen sizes */}
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-display font-black text-2xl select-none shadow-md border border-slate-800 shrink-0">
        JAJ
      </div>
      <div>
        <h1 className="font-display font-black text-2xl text-slate-100 tracking-tight flex items-center gap-2">
          <span>Job Application Journal</span>
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-0.5">Structured job application tracker, never forget about a job again</p>
      </div>
    </div>

    {/* Action buttons with custom font parameters */}
    <div className="flex flex-wrap items-center gap-2">
      
      <button
        onClick={handleScrollToActive}
        className="text-[11px] font-mono font-bold tracking-wider text-emerald-100 hover:text-white bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/80 px-4 py-2.5 rounded-full transition-all uppercase flex items-center gap-1.5 shadow-xs"
      >
        <span>Go to Applications</span>
      </button>

      <button
        onClick={() => setShowGuide(!showGuide)}
        className="text-[11px] font-mono font-bold tracking-wider text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-4 py-2.5 rounded-full transition-all uppercase flex items-center gap-1.5"
      >
        <HelpCircle className="w-4 h-4 text-slate-400" />
        <span>{showGuide ? 'Dismiss Guide' : 'How To Use'}</span>
      </button>

      <button
        onClick={() => setIsAddFormOpen(true)}
        className="text-[11px] font-mono font-bold tracking-wider bg-slate-900 text-white hover:bg-slate-800 px-5 py-2.5 rounded-full transition-all uppercase shadow-md flex items-center gap-1.5"
      >
        <PlusCircle className="w-4 h-4 text-white" />
        <span>New application</span>
      </button>


    </div>
  </div>
</header>



            {/* Main Core View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        
   {/*  Quick Start Guide Section */}
        {showGuide && (
          <QuickStartGuide onClose={() => setShowGuide(false)} />
        )}
     {/*  Resilience and input-based tracker system */}
        <Quotes_Perspectives applications={applications} />


  {/* Navigation tabs + Quick Query search */}
<div id="journal-section-target" className="space-y-4">
  
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow-xl">
    
    {/* Tab switchers in horizontal pill layout */}
<div className="flex flex-nowrap items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl sm:rounded-full border border-slate-800/40 overflow-x-auto scrollbar-none snap-x">
      <button
        onClick={() => {
          setActiveTab('active');
          setStatusFilter('All');
        }}
        className={`text-[11px] uppercase tracking-wider px-4 py-2 rounded-full font-mono transition flex items-center gap-2 cursor-pointer ${
          activeTab === 'active' 
            ? 'bg-slate-800 text-white shadow-md border border-slate-700/50' 
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Briefcase className="w-3.5 h-3.5 shrink-0 text-slate-400" />
        <span>Active Journals</span>
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-sans font-bold ${
          activeTab === 'active' ? 'bg-slate-950 text-emerald-400' : 'bg-slate-950 text-slate-500'
        }`}>
          {activeCount}
        </span>
      </button>

      <button
        onClick={() => {
          setActiveTab('archive');
          setStatusFilter('All');
        }}
        className={`text-[11px] uppercase tracking-wider px-4 py-2 rounded-full font-mono transition flex items-center gap-2 cursor-pointer ${
          activeTab === 'archive' 
            ? 'bg-slate-800 text-white shadow-md border border-slate-700/50' 
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Archive className="w-3.5 h-3.5 shrink-0 text-slate-400" />
        <span>Archive History</span>
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-sans font-bold ${
          activeTab === 'archive' ? 'bg-slate-950 text-amber-500' : 'bg-slate-950 text-slate-500'
        }`}>
          {archivedCount}
        </span>
      </button>

      <button
        onClick={() => {
          setActiveTab('all');
          setStatusFilter('All');
        }}
        className={`text-[11px] uppercase tracking-wider px-4 py-2 rounded-full font-mono transition cursor-pointer ${
          activeTab === 'all' 
            ? 'bg-slate-800 text-white shadow-md border border-slate-700/50' 
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span>All Records ({applications.length})</span>
      </button>
    </div>

    {/* Quick Search input styled as a gorgeous pill */}
    <div className="relative flex-1 lg:max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      <input
        id="main-search-input"
        type="text"
        placeholder="Search company, skills, keywords etc ..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full text-xs bg-slate-900 border border-slate-800 rounded-full pl-11 pr-16 py-3 outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700 transition-all font-mono text-slate-100 placeholder-slate-500"
      />
  
    </div>

  </div>

  {/* Quick status pill sub-filters */}
  <div className="flex flex-wrap items-center gap-1.5 px-1">
    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mr-2 select-none">
      Filter By:
    </span>
    {['All', 'Applied', 'In Review', 'Interviewing', 'Offered', 'Wishlist', 'Accepted','Rejected', 'Unresponsive'].map((status) => {
       const isStatusArchived = (status as string) === 'Rejected' || (status as string) === 'Unresponsive' || (status as string) === 'Accepted';
  if (status !== 'All' && (
  (activeTab === 'active' && isStatusArchived) || 
  (activeTab === 'archive' && !isStatusArchived)
)) {
  return null;
}

      // Safe calculation optimization for 'All' vs explicit statuses
 
    const currentTabApps = activeTab === 'archive' 
      ? applications.filter(a => a.status === 'Rejected' || a.status === 'Unresponsive' || a.status === 'Accepted')
      : applications.filter(a => a.status !== 'Rejected' && a.status !== 'Unresponsive' && a.status !== 'Accepted');

    const count = status === 'All' 
      ? currentTabApps.length 
      : applications.filter((app) => app.status === status).length;
      
    const isSelected = statusFilter === status;

      return (
        <button
          key={status}
          onClick={() => setStatusFilter(status)}
          className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${
            isSelected 
              ? 'bg-slate-800 text-white border-slate-600 shadow-md font-medium'
              : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <span>{status}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-sans ${
            isSelected ? 'bg-slate-950 text-slate-200 font-bold' : 'bg-slate-900 text-slate-500'
          }`}>
            {count}
          </span>
        </button>
      );
    })}
  </div>

</div>
   {/* 4. Main Journal Row Layout */}
<div className="space-y-5">
          
          {filteredApps.length > 0 ? (
            <div className="space-y-4">
              {filteredApps.map((app) => (
                <JobCard
                  key={app.id}
                  app={app}
                  onUpdate={handleUpdateApplication}
                  onDelete={handleDeleteApplication}
                  startExpanded={focusedAppId === app.id}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800/80 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-5 animate-scale-in shadow-2xl">
  
  {/* Elevated background surface for the icon wrapper */}
  <div className="p-4 bg-slate-900 inline-block rounded-3xl border border-slate-800 text-slate-500">
    <FolderLock className="w-8 h-8" />
  </div>
  
  <div className="space-y-2">
    {/* Clean off-white heading */}
    <h3 className="font-display font-bold text-base text-slate-200 uppercase tracking-wider">
      No application records found
    </h3>
    {/* Soft gray body text to reduce contrast glare */}
    <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
      {searchQuery || statusFilter !== 'All' 
        ? "We couldn't find any entries matching your filters. Try clearing your search and status filters."
        : "No applications tracked yet. Let's keep your Job Application history tracked and locked down. Create your first record now."}
    </p>
  </div>
  
  <div className="pt-2 flex justify-center gap-2">
    {searchQuery || statusFilter !== 'All' ? (
      /* Secondary Button: Subtle background outline styling */
      <button
        onClick={() => {
          setSearchQuery('');
          setStatusFilter('All');
        }}
        className="text-xs font-mono bg-slate-900 text-slate-300 hover:bg-slate-800 px-4 py-2.5 rounded-full transition-all uppercase tracking-wider font-semibold border border-slate-800 cursor-pointer"
      >
        Clear Filters
      </button>
    ) : (
      /* Primary Call-to-Action Button: High contrast crisp white layout to draw focus */
      <button
        onClick={() => setIsAddFormOpen(true)}
        className="text-xs font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-950 hover:bg-slate-200 px-5 py-3 rounded-full transition shadow-lg flex items-center gap-1.5 cursor-pointer"
      >
        <PlusCircle className="w-4 h-4 shrink-0" />
        <span>Create your first Job Application record</span>
      </button>
    )}
  </div>

</div>
          )}

        </div>

 
<footer className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 font-mono tracking-[0.15em] gap-4 uppercase select-none">
  


  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
    <span className="flex items-center gap-2 text-slate-400">
      Data is 100% Local & Encrypted
    </span>

  </div>

  {/* Brand Attribution & Copyright */}
  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-right">
    <span>
      © 2026 All Rights Reserved
    </span>
    <span className="hidden sm:inline text-slate-800">|</span>
    <a 
      href="https://gideon-s-dev-hub.vercel.app/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-slate-400 hover:text-indigo-400 font-bold border-b border-dashed border-slate-800 hover:border-indigo-500 pb-0.5 transition-all tracking-[0.2em]"
    >
      Engineered by Gideon's Dev™
    </a>
  </div>

</footer>
     </main>

              {/* Add Job Modal Dialog Backdrop */}
      <AddJobForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAdd={handleAddApplication}
        existingApps={applications}
        onViewExistingApp={handleFocusApplication}
      />
  {/* Dynamic Floating Notification Banner Overlay */}
{toast.visible && (
  <div className="fixed bottom-24 right-6 z-50 animate-fade-in font-mono max-w-sm text-xs">
    <div className={`p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-center gap-3 ${
      toast.type === 'success' 
        ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' 
        : toast.type === 'archive'
        ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
        : 'bg-slate-900/90 border-slate-700/50 text-indigo-300'
    }`}>
   
      <div className="space-y-0.5">
        <p className="leading-relaxed font-medium">{toast.message}</p>
      </div>
    </div>
  </div>
)}
         {/* Custom Export Selector Modal Dialog Popup Backdrop */}
     <Analytics />
      </div>
  );
}

export default App
