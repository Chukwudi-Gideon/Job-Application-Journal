export type JobStatus = 'Applied' | 'In Review' | 'Interviewing' | 'Offered' | 'Wishlist'| 'Accepted' |  'Rejected' | 'Unresponsive';

export interface TimelineStep {
  status: JobStatus;
  date: string; 
    id: 'applied' | 'confirmation' | 'recruiter' |'accepted'|'assessment' | 'interview' | 'closed';
  label: string;
  completed: boolean;

}
export type JobTimeType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';

export interface JobApplication {
  id: string;
  user_id: string; 
  company_name: string;
  role: string;
  location: string | null; 
  salary_requested: string | null;
  salary_offered: string | null;

  source: string | null; 
  method: string | null; 
  url: string | null;
  description: string | null;
  cv_version: string | null; 
  personal_notes: string | null;
  
  status: JobStatus;
  timeline: TimelineStep[]; 

  last_follow_up_at?: string | null;
  follow_up_interval_days?: number | null; 
  
  created_at: string;
  applied_at: string; 
  updated_at: string; 

  uploaded_file?: {
    name: string;
    type: string;
    size: number;
    data: string; // Base64 dataUrl
  } | null;

  job_time?: {
    type?: JobTimeType;
    expectedHours?: number;
  } | null;

  wishlist_reminder?: {
    enabled: boolean;
    remindAt: string; 
    daysOffset: number; 
  } | null;
}
