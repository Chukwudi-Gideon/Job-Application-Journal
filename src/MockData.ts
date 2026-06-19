import type { JobApplication} from './types';



export const getInitialDemoData = (): JobApplication[] => {
  const now = new Date();
  // Date helpers
  const daysAgo = (d: number) => {
    const date = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    return date.toISOString();
  };

  return [
  {
    id: 'demo-stripe',
    companyName: 'Stripe',
    role: 'Frontend Engineer',
    location: 'London (Hybrid)',
    salaryRequested: '£90,000 / yr',
    salaryOffered: '£85k - £100k',
    source: 'LinkedIn',
    method: 'Company Site',
    personalNotes: 'I applied through a friend and I am hoping for the best',
    url: 'https://stripe.com/jobs/example',
    description: `Stripe is looking for a Frontend Engineer to join our dashboard crew.\nWe build high-performance web applications with React, TypeScript, and Tailwind.\nRequirements:\n- 3+ years experience with modern React applications.\n- Strong focus on design detail and CSS/micro-interactions.\n- Experience with GraphQL & REST APIs.`,
    cvVersion: 'Tailored Analytics Resume v3',
    status: 'Interviewing',
    timeline: [ 
      { id: 'applied', label: 'Applied', completed: true, date: daysAgo(12), status: 'Applied' }, 
      { id: 'confirmation', label: 'Confirmation Email', completed: true, date: daysAgo(12), status: 'In Review' },
      { id: 'recruiter', label: 'Recruiter Contact', completed: true, date: daysAgo(8), status: 'In Review' }, 
      { id: 'assessment', label: 'Assessment Sent', completed: false, date: '', status: 'Interviewing' },
      { id: 'interview', label: 'Interview Scheduled', completed: true, date: daysAgo(3), status: 'Interviewing' },
      { id: 'closed', label: 'Unresponsive / Closed', completed: false, date: '', status: 'Unresponsive' }
    ],
    createdAt: daysAgo(12),
    appliedAt: daysAgo(12),
    updatedAt: daysAgo(3)
  },
  {
    id: 'demo-vercel',
    companyName: 'Vercel',
    role: 'UI Designer & Developer',
    location: 'Remote',
    salaryRequested: '$120,000',
    salaryOffered: '',
    source: 'Otta',
    method: 'Easy Apply',
    personalNotes: 'Applied with Otta 1-click. Sent portfolio link highlighting 3 custom layouts. Otta description bio used instead of a cover letter.',
    url: 'https://vercel.com/careers',
    description: `Vercel is looking for a Designer/Developer hybrid to build Vercel Ship and regional assets.\nWe use React, Next.js, and Framer Motion.\nRequirements:\n- Strong portfolio of visual and motion layout details.\n- Mastery of Tailwind CSS.\n- Familiarity with Server Elements and static generators.`,
    cvVersion: 'Visual Dev & Interactive Resume v2',
    status: 'Applied',
    timeline: [
      { id: 'applied', label: 'Applied', completed: true, date: daysAgo(8), status: 'Applied' },
      { id: 'confirmation', label: 'Confirmation Email', completed: false, date: '', status: 'Applied' },
      { id: 'recruiter', label: 'Recruiter Contact', completed: false, date: '', status: 'Applied' },
      { id: 'assessment', label: 'Assessment Sent', completed: false, date: '', status: 'Applied' },
      { id: 'interview', label: 'Interview Scheduled', completed: false, date: '', status: 'Applied' },
      { id: 'closed', label: 'Timeline finalized', completed: false, date: '', status: 'Applied' }
    ],
    createdAt: daysAgo(8),
    appliedAt: daysAgo(8),
    updatedAt: daysAgo(8)
  },
  {
    id: 'demo-google',
    companyName: 'Google',
    role: 'Staff Systems Analyst',
    location: 'York Office',
    salaryRequested: '£110k',
    salaryOffered: '£120k Base',
    source: 'Referral / Networking',
    method: 'Recruiter Outreach',
    personalNotes: 'Introductory call via LinkedIn recruiter referral. Discussed enterprise transition workflows. System architecture questions centered on distributed clusters. High load optimization.',
    url: '',
    description: `Looking for experienced Systems Administrators to coordinate enterprise scale migrations to GCP cloud infrastructure.\nRequired skills:\n- Kubernetes, Docker, and shell script automation\n- Relational DB setups and migration flows.`,
    cvVersion: 'Staff Infrastructure CV v5',
    status: 'Rejected',
    timeline: [
      { id: 'applied', label: 'Applied', completed: true, date: daysAgo(45), status: 'Applied' },
      { id: 'confirmation', label: 'Confirmation Email', completed: true, date: daysAgo(42), status: 'In Review' },
      { id: 'recruiter', label: 'Recruiter Contact', completed: true, date: daysAgo(35), status: 'In Review' },
      { id: 'assessment', label: 'Assessment Sent', completed: false, date: '', status: 'In Review' },
      { id: 'interview', label: 'Interview Scheduled', completed: false, date: '', status: 'In Review' },
      { id: 'closed', label: 'Fnalised?', completed: true, date: daysAgo(30), status: 'Rejected' }
    ],
    createdAt: daysAgo(45),
    appliedAt: daysAgo(45),
    updatedAt: daysAgo(30)
  }
];

}