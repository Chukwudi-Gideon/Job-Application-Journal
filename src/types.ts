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
  companyName: string;
  role: string;
  location: string;
  salaryRequested: string;
  salaryOffered: string;
  source: string; 
  method: string; 
  url: string;
  description: string;
  cvVersion: string; 
   personalNotes: string;
  status: JobStatus;
  timeline: TimelineStep[];
lastFollowUpAt?: string | null;
  followUpIntervalDays?: number; 
  createdAt: string;
  appliedAt: string; 
  updatedAt: string; 

    uploadedFile?: {
    name: string;
    type: string;
    size: number;
    data: string; // Base64 dataUrl
  } | null;

  jobTime?: {
    type?: JobTimeType;
    expectedHours?: number;
  };
  wishlistReminder?: {
    enabled: boolean;
    remindAt: string; 
    daysOffset: number; 
  };
}