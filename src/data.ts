
export interface Reminders {
  text: string;
  author: string;
}
export const INITIAL_TIMELINE_STEPS = (nowISO: string) => {
  return [
    { 
      id: 'applied', 
      label: 'Applied', 
      completed: true, 
      date: nowISO, 
      status: 'Applied' 
    },
    { 
      id: 'confirmation', 
      label: 'Confirmation Email', 
      completed: false, 
      date: '', 
      status: 'Applied' 
    },
    { 
      id: 'recruiter', 
      label: 'Recruiter Contact', 
      completed: false, 
      date: '', 
      status: 'Applied' 
    },
    { 
      id: 'assessment', 
      label: 'Assessment Sent', 
      completed: false, 
      date: '', 
      status: 'Applied' 
    },
    { 
      id: 'interview', 
      label: 'Interview Scheduled', 
      completed: false, 
      date: '', 
      status: 'Applied' 
    },
    { 
      id: 'closed', 
      label: 'Unresponsive / Closed', 
      completed: false, 
      date: '', 
      status: 'Applied' 
    }
  ] as const;
};



export const SOLID_MINDSET_QUOTES: Reminders[] =[
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Whether you think you can, or you think you can't—you're right.",
    author: "Henry Ford"
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Our greatest glory is not in never falling, but in rising every time we fall.",
    author: "Confucius"
  },
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Hardships often prepare ordinary people for an extraordinary destiny.",
    author: "C.S. Lewis"
  },
  {
    text: "You miss one hundred percent of the shots you don't take.",
    author: "Wayne Gretzky"
  },
  {
    text: "I have not failed. I've just found ten thousand ways that won't work.",
    author: "Thomas Edison"
  },
  {
    text: "The best way out is always through.",
    author: "Robert Frost"
  },
  {
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "A journey of a thousand miles begins with a single step.",
    author: "Lao Tzu"
  },
  {
    text: "Fall seven times and stand up eight.",
    author: "Japanese Proverb"
  },
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius"
  },
  {
    text: "You become what you think about all day long.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "Energy and persistence conquer all things.",
    author: "Benjamin Franklin"
  },
  {
    text: "Do not wait to strike till the iron is hot; but make it hot by striking.",
    author: "William Butler Yeats"
  },
  {
    text: "The man who moves a mountain begins by carrying away small stones.",
    author: "Confucius"
  }
]

export const SOFT_LANDING_MESSAGE = 
  "Focus on the effort, not the outcome. A rejection is just data; it clears the path for the next target. Keep moving forward.";
