
import React, { useState, useEffect } from 'react';
import { Trophy, Heart, Bookmark, Activity, ArrowRight } from 'lucide-react';
import type { JobApplication } from '../types';
import { SOLID_MINDSET_QUOTES } from '../data';

interface PerspectiveEngineProps {
  applications: JobApplication[];
  onQuickLogAction?: (actionType: 'apply' | 'followup' | 'networking') => void;
}

export const Quotes_Perspectives: React.FC<PerspectiveEngineProps> = ({
  applications,
}) => {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(() => 
    Math.floor(Math.random() * SOLID_MINDSET_QUOTES.length)
  );

  // Auto-progress Perspective Anchor every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuoteIndex((prevIndex) => {
        let nextIndex = prevIndex;
        while (nextIndex === prevIndex && SOLID_MINDSET_QUOTES.length > 1) {
          nextIndex = Math.floor(Math.random() * SOLID_MINDSET_QUOTES.length);
        }
        return nextIndex;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate inputs in the last 7 days 
  const nowTime = Date.now();
  const sevenDaysAgoTime = nowTime - 7 * 24 * 60 * 60 * 1000;

  const appsThisWeek = applications.filter((app) => {
        if (!app.applied_at) return false; 
    return new Date(app.applied_at).getTime() >= sevenDaysAgoTime;
  });

const followUpsThisWeek = applications.filter((app) => {
      if (!app.applied_at) return false; 
    const appliedTime = new Date(app.applied_at).getTime();
    const updatedTime = new Date(app.updated_at).getTime();

    // Check if the application was modified during this trailing week
    const isUpdatedThisWeek = updatedTime >= sevenDaysAgoTime;
    
    // Captures all manual entries, edits, logs, or status changes after initial creation
    const isActualSubsequentActivity = (updatedTime - appliedTime) > 2000;

    return isUpdatedThisWeek && isActualSubsequentActivity;
  });
  // Calculate an input-based progress score
  // Target: say, 5 inputs per week representing standard effort
  const inputActivitiesCount = appsThisWeek.length + followUpsThisWeek.length;
  const targetInputs = 50;
  const momentumPercent = Math.min(100, Math.round((inputActivitiesCount / targetInputs) * 100));

  const changeQuote = () => {
    let nextIndex = activeQuoteIndex;
    while (nextIndex === activeQuoteIndex && SOLID_MINDSET_QUOTES.length > 1) {
      nextIndex = Math.floor(Math.random() * SOLID_MINDSET_QUOTES.length);
    }
    setActiveQuoteIndex(nextIndex);
  };
return (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
    
    {/* Momentum Bar - Efforts Only */}
    <div className="bg-slate-950 rounded-3xl border border-slate-700/60 p-6 md:col-span-12 lg:col-span-8 flex flex-col justify-between">
      <div className="space-y-2">
    
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Effort & Input Momentum
          </span>
          <span className="inline-flex items-center text-xs sm:text-[13px] font-serif italic px-4 py-1.5 rounded-full shrink-0 shadow-sm transition-colors duration-200 bg-emerald-950/50 border border-emerald-800/40 shadow-emerald-700/5 self-start sm:self-auto">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-medium">
              Keep it up! Success is closer than you think
            </span>
          </span>
        </div>
        
        <h3 className="font-display font-bold text-lg text-slate-100 uppercase tracking-wider pt-2">
          Trust your pace and focus on your present efforts; prioritize daily progress over perfection, and the results will follow.
        </h3>
        <p className="text-xs text-slate-200 leading-relaxed max-w-2xl italic">
          Focus entirely on what is in your hands. You cannot force companies to reply or send offers quickly, but you can always control your steady submissions and persistent follow ups.
        </p>
      </div>

      {/* Progress Display */}
      <div className="space-y-3 my-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span className="text-slate-400">Applications:</span>{' '}
              <strong className="text-slate-100 text-sm">{appsThisWeek.length}</strong>
            </div>
            <div className="hidden sm:block border-r border-slate-700/80"></div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="text-slate-400">Outreach/Follow-up:</span>{' '}
              <strong className="text-slate-100 text-sm">{followUpsThisWeek.length}</strong>
            </div>
          </div>

<div className="flex items-center gap-2 self-start sm:self-auto shrink-0 font-mono">
  <span className="text-[11px] font-bold text-slate-400 bg-slate-905 border border-slate-800 px-2 py-0.5 rounded select-none">
    Weekly Target: 50 Applications/Follow-ups
  </span>
  <span className="text-sm font-black text-slate-100 bg-slate-800 px-2 py-0.5 rounded">
    {momentumPercent}% Completed
  </span>
</div>
        </div>

        <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-[2px] border border-slate-700">
          <div 
            style={{ width: `${momentumPercent}%` }}
            className="h-full bg-emerald-400 transition-all duration-500 rounded-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-[10px] font-mono text-slate-400 italic">
          <span>{inputActivitiesCount} registered action{inputActivitiesCount !== 1 ? 's' : ''} logged this week</span>
          {momentumPercent >= 100 ? (
            <span className="text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1">
              ★ Weekly Consistency Target Unlocked!
            </span>
          ) : (
            <span className="uppercase tracking-wider text-[9px] sm:text-[10px]">Keep your momentum going at a pace that feels right for you</span>
          )}
        </div>
      </div>

      <div className="text-[11px] bg-slate-950 border border-slate-700/60 p-3 rounded-2xl flex items-center gap-2.5 text-slate-300">
        <Heart className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
        <span>Every entry shows your true dedication. Let's track each milestone together</span>
      </div>
    </div>

    {/* Resilience Quote */}
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:col-span-12 lg:col-span-4 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-400 pointer-events-none">
        <Bookmark className="w-24 h-24" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
            Great Perspectives
          </span>
          <Activity className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
        </div>
        
        <blockquote className="space-y-2">
          <p className="text-sm italic font-serif leading-relaxed text-slate-200 pt-1">
            "{SOLID_MINDSET_QUOTES[activeQuoteIndex].text}"
          </p>
          <cite className="block text-xs font-mono text-slate-400 not-italic">
            — {SOLID_MINDSET_QUOTES[activeQuoteIndex].author}
          </cite>
        </blockquote>
      </div>

      <div className="pt-6 flex items-center justify-between z-10">
        <span className="text-[10px] font-mono text-slate-400">Grounding reminders</span>
        <button
          onClick={changeQuote}
          className="text-[11px] font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-full border border-slate-700 transition flex items-center gap-1 uppercase cursor-pointer"
        >
          <span>Next</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
    
  </div>
);
}