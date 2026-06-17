export interface ScriptNode {
  id: string;
  type: 'bot_msg' | 'text' | 'textarea' | 'choice' | 'file' | 'section' | 'complete';
  text?: string;
  key?: string;
  label?: string;
  placeholder?: string;
  options?: string[];
  accept?: string;
  multiple?: boolean;
  optional?: boolean;
  condition?: (answers: Record<string, unknown>) => boolean;
  delay: number;
}

export const INTAKE_SCRIPT: ScriptNode[] = [
  {
    id: 'welcome',
    type: 'bot_msg',
    text: 'AMTECH intake sequence initialized.<br><br>I\'m going to walk you through a quick set of questions so the team can dial in your website. Takes about five minutes — let\'s go.',
    delay: 900,
  },
  {
    id: 'name',
    type: 'text',
    text: 'First — what\'s your name?',
    key: 'clientName',
    placeholder: 'First and last name',
    delay: 500,
  },
  {
    id: 'business',
    type: 'text',
    text: 'And the business name?',
    key: 'businessName',
    placeholder: 'Business name',
    delay: 400,
  },
  { id: 's_colors', type: 'section', label: 'COLORS & DESIGN', delay: 300 },
  {
    id: 'colors_feel',
    type: 'choice',
    text: 'How are you feeling about the current color scheme on your website?',
    key: 'colorsFeeling',
    options: ['Keep it as-is', 'Minor tweaks', 'Full overhaul'],
    delay: 600,
  },
  {
    id: 'colors_detail',
    type: 'textarea',
    condition: (a) => a.colorsFeeling !== 'Keep it as-is',
    text: 'Got it. Describe what you\'re going for — specific colors, mood, brands whose look you like, anything.',
    key: 'colorsDetail',
    placeholder: 'e.g. "Darker tones, brighter green on the CTAs, something that feels more premium and established"',
    delay: 400,
  },
  { id: 's_logo', type: 'section', label: 'LOGO', delay: 300 },
  {
    id: 'has_logo',
    type: 'choice',
    text: 'Do you have an existing logo?',
    key: 'hasLogo',
    options: ['Yes, I have one', 'No — need one'],
    delay: 600,
  },
  {
    id: 'logo_upload',
    type: 'file',
    condition: (a) => a.hasLogo === 'Yes, I have one',
    text: 'Upload your logo file. PNG, SVG, PDF, AI — any format is fine.',
    key: 'logoFiles',
    accept: 'image/*,.svg,.pdf,.ai,.eps',
    multiple: false,
    optional: false,
    delay: 400,
  },
  {
    id: 'logo_changes',
    type: 'textarea',
    text: 'Any changes needed to the logo? Or notes on what you love / hate about it?',
    key: 'logoChanges',
    placeholder: 'e.g. "The font feels outdated — want something bolder" or "Logo is perfect, no changes"',
    optional: true,
    delay: 400,
  },
  { id: 's_content', type: 'section', label: 'CONTENT & COPY', delay: 300 },
  {
    id: 'content_phrasing',
    type: 'textarea',
    text: 'How does the website copy feel right now? Anything that sounds off, generic, or just wrong?',
    key: 'contentPhrasing',
    placeholder: 'e.g. "The homepage headline is weak, the about page is too stiff"',
    optional: true,
    delay: 600,
  },
  {
    id: 'services_listed',
    type: 'textarea',
    text: 'Are the services listed accurate and complete? What needs to be added, removed, or reworded?',
    key: 'servicesListed',
    placeholder: 'List services to add, drop, or clarify',
    optional: false,
    delay: 400,
  },
  {
    id: 'service_areas',
    type: 'textarea',
    text: 'What are your service areas? List cities, counties, or regions you want to show up for.',
    key: 'serviceAreas',
    placeholder: 'e.g. "Portland, Beaverton, Hillsboro, Gresham — the whole metro plus Salem"',
    optional: false,
    delay: 400,
  },
  {
    id: 'contact_info',
    type: 'textarea',
    text: 'Is your contact info current? Phone, email, address, hours — drop any corrections here.',
    key: 'contactInfo',
    placeholder: 'List anything that needs updating',
    optional: true,
    delay: 400,
  },
  { id: 's_photos', type: 'section', label: 'PHOTOS & VISUALS', delay: 300 },
  {
    id: 'photos_remove',
    type: 'textarea',
    text: 'Are there photos on the site now that you want pulled or replaced?',
    key: 'photosRemove',
    placeholder: 'Describe what to swap out',
    optional: true,
    delay: 600,
  },
  {
    id: 'photos_upload',
    type: 'file',
    text: 'Upload any new photos you\'d like on the site. Attach as many as you want.',
    key: 'photoFiles',
    accept: 'image/*',
    multiple: true,
    optional: true,
    delay: 400,
  },
  {
    id: 'photos_context',
    type: 'textarea',
    condition: (a) => {
      const files = a.photoFiles;
      return Array.isArray(files) && files.length > 0;
    },
    text: 'Context on those photos — where do they go, what do they show?',
    key: 'photosContext',
    placeholder: 'e.g. "Crew photo for the About page, project shots for the gallery section"',
    optional: true,
    delay: 400,
  },
  { id: 's_goals', type: 'section', label: 'BUSINESS GOALS', delay: 300 },
  {
    id: 'marketing_goals',
    type: 'textarea',
    text: 'What are your online marketing goals over the next couple months? More leads, specific services to push, rankings you want to own?',
    key: 'marketingGoals',
    placeholder: 'e.g. "More roofing leads, dominate Portland searches, push storm damage response services"',
    optional: false,
    delay: 600,
  },
  {
    id: 'business_goals',
    type: 'textarea',
    text: 'In the real world — what does growth look like for you this season? Crew size, bigger jobs, new services, new markets?',
    key: 'businessGoals',
    placeholder: 'e.g. "Hiring two more guys, moving into commercial, targeting larger HOA contracts"',
    optional: false,
    delay: 400,
  },
  {
    id: 'complete',
    type: 'complete',
    text: 'That\'s everything we need. Your intake has been logged and routed to the AMTECH team.<br><br>We\'ll review your answers and follow up within 24 hours to get moving.',
    delay: 700,
  },
];

export const KEY_LABELS: Record<string, string> = {
  clientName: 'Client Name',
  businessName: 'Business',
  colorsFeeling: 'Color Direction',
  colorsDetail: 'Color Notes',
  hasLogo: 'Has Logo',
  logoFiles: 'Logo Upload',
  logoChanges: 'Logo Notes',
  contentPhrasing: 'Copy Notes',
  servicesListed: 'Services',
  serviceAreas: 'Service Areas',
  contactInfo: 'Contact Updates',
  photosRemove: 'Photos to Remove',
  photoFiles: 'New Photos',
  photosContext: 'Photo Notes',
  marketingGoals: 'Marketing Goals',
  businessGoals: 'Business Goals',
};

export const ANSWERABLE_TYPES = ['text', 'textarea', 'choice', 'file'];

export function countAnswerableSteps(): number {
  return INTAKE_SCRIPT.filter((s) => ANSWERABLE_TYPES.includes(s.type)).length;
}
