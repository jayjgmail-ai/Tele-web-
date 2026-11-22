export interface WhyUsCard {
  badge?: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export interface NavItemConfig {
  id: string;
  label: string;
  badge?: string;
  url?: string;
  visible?: boolean;
}

export interface FooterLinkConfig {
  label: string;
  tabId?: string;
  url?: string;
}

export interface FooterColumnConfig {
  id: string;
  title: string;
  links: FooterLinkConfig[];
}

export interface SocialLinkConfig {
  id: string;
  platform: string;
  url: string;
}

export interface LegalLinkConfig {
  id: string;
  label: string;
  content: string;
  url?: string;
}

export interface HomeStatItem {
  value: string;
  label: string;
}

export interface QuickNavTileConfig {
  id: string;
  label: string;
  badge?: string;
  targetTab: string;
  url?: string;
  visible?: boolean;
}

export interface ExtraContactItem {
  label: string;
  value: string;
}

export interface FontOption {
  id: string;
  label: string;
  cssFamily: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'default', label: 'Default Sans', cssFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  { id: 'poppins', label: 'Poppins (Modern)', cssFamily: "'Poppins', system-ui, sans-serif" },
  { id: 'montserrat', label: 'Montserrat (Athletic)', cssFamily: "'Montserrat', system-ui, sans-serif" },
  { id: 'oswald', label: 'Oswald (Bold Display)', cssFamily: "'Oswald', 'Arial Narrow', sans-serif" },
  { id: 'playfair', label: 'Playfair Display (Serif)', cssFamily: "'Playfair Display', Georgia, serif" },
  { id: 'merriweather', label: 'Merriweather (Editorial)', cssFamily: "'Merriweather', Georgia, serif" },
  { id: 'mono', label: 'Roboto Mono (Tech)', cssFamily: "'Roboto Mono', monospace" },
];

export function getFontCss(fontId?: string): string | undefined {
  if (!fontId || fontId === 'default') return undefined;
  return FONT_OPTIONS.find((f) => f.id === fontId)?.cssFamily;
}

export const COLOR_SWATCHES: { label: string; hex: string }[] = [
  { label: 'Deep Slate', hex: '#0f172a' },
  { label: 'Slate Gray', hex: '#475569' },
  { label: 'Academy Pink', hex: '#db2777' },
  { label: 'Royal Purple', hex: '#7e22ce' },
  { label: 'Indigo', hex: '#4338ca' },
  { label: 'Academy Gold', hex: '#ca8a04' },
  { label: 'Cobalt Blue', hex: '#2563eb' },
  { label: 'Crimson', hex: '#dc2626' },
  { label: 'Pure White', hex: '#ffffff' },
  { label: 'Soft Pink', hex: '#fdf2f8' },
  { label: 'Warm Cream', hex: '#fefce8' },
  { label: 'Soft Slate', hex: '#f8fafc' },
];

export interface PageStyleConfig {
  fontFamily?: string;
  headingColor?: string;
  textColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

export type CustomBlockType =
  | 'topic'
  | 'image'
  | 'list'
  | 'callout'
  | 'cards'
  | 'cta'
  | 'divider';

export interface CustomBlockCardItem {
  id: string;
  badge?: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface CustomPageBlock {
  id: string;
  type: CustomBlockType;
  position?: 'top' | 'bottom';
  badge?: string;
  title?: string;
  body?: string;
  imageUrl?: string;
  imagePosition?: 'top' | 'left' | 'right' | 'full';
  imageCaption?: string;
  items?: string[];
  listStyle?: 'bullets' | 'numbers' | 'checks';
  cards?: CustomBlockCardItem[];
  buttonLabel?: string;
  buttonAction?: string;
  buttonUrl?: string;
  fontFamily?: string;
  textSize?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center' | 'right';
  textColor?: string;
  headingColor?: string;
  backgroundColor?: string;
  accentColor?: string;
  visible?: boolean;
}

export interface SiteContent {
  global: {
    brandPrefix: string;
    brandSuffix: string;
    tagline: string;
    bookTrialBtn: string;
    footerDescription: string;
    copyrightText: string;
    hqAddress: string;
    hqPhone: string;
    hqEmail: string;
    hqColumnTitle: string;
    logoUrl: string;
    navItems: NavItemConfig[];
    footerColumns: FooterColumnConfig[];
    socialLinks: SocialLinkConfig[];
    legalLinks: LegalLinkConfig[];
    sportsList: string[];
  };
  home: {
    heroImage: string;
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    heroPrimaryCta: string;
    heroSecondaryCta: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    stats: HomeStatItem[];
    quickNavTiles: QuickNavTileConfig[];
    labBadge: string;
    labTitle: string;
    labStatus: string;
    programsBadge: string;
    programsHeading: string;
    programsLinkText: string;
    whyBadge: string;
    whyHeading: string;
    whySubheading: string;
    whyCards: WhyUsCard[];
    testimonialsBadge: string;
    testimonialsHeading: string;
    testimonials: TestimonialItem[];
    ctaBadge: string;
    ctaHeading: string;
    ctaSubheading: string;
    ctaPrimaryBtn: string;
    ctaSecondaryBtn: string;
  };
  programs: {
    badge: string;
    heading: string;
    subheading: string;
    searchPlaceholder: string;
    viewDetailsText: string;
    enrollBtnPrefix: string;
    highlightsHeading: string;
    categories: string[];
  };
  partners: {
    badge: string;
    heading: string;
    subheading: string;
    searchPlaceholder: string;
    viewBtnText: string;
    categories: string[];
    statuses: string[];
  };
  coaches: {
    badge: string;
    heading: string;
    subheading: string;
    bookBtnText: string;
    bookingModalTitle: string;
    bookingSuccessTitle: string;
    bookingSuccessMessage: string;
  };
  coachJobs: {
    badge: string;
    heading: string;
    subheading: string;
    applyBtnText: string;
    modalTitle: string;
    modalSubmitText: string;
    successTitle: string;
    successMessage: string;
    extraQuestions: string[];
    listHeading: string;
    listSubheading: string;
  };
  parentRequests: {
    badge: string;
    heading: string;
    subheading: string;
    requestBtnText: string;
    modalTitle: string;
    modalSubmitText: string;
    successTitle: string;
    successMessage: string;
    skillLevels: string[];
    extraQuestions: string[];
    listHeading: string;
    listSubheading: string;
  };
  merchandise: {
    badge: string;
    heading: string;
    subheading: string;
    addToCartText: string;
    cartLabel: string;
    checkoutBtnText: string;
    orderSuccessTitle: string;
    orderSuccessMessage: string;
    categories: string[];
  };
  announcements: {
    badge: string;
    heading: string;
    subheading: string;
    searchPlaceholder: string;
    readMoreText: string;
    categories: string[];
  };
  aiCoach: {
    badge: string;
    heading: string;
    subheading: string;
    welcomeMessage: string;
    contextLabel: string;
    generalOptionLabel: string;
    resetBtnText: string;
    presetsLabel: string;
    consoleTitle: string;
    inputPlaceholder: string;
    sendBtnText: string;
    presetPrompts: string[];
  };
  news: {
    badge: string;
    heading: string;
    subheading: string;
    readMoreText: string;
    closeBtnText: string;
    categories: string[];
  };
  contact: {
    badge: string;
    heading: string;
    subheading: string;
    hqCardTitle: string;
    locationLabel: string;
    phoneLabel: string;
    emailLabel: string;
    extraContacts: ExtraContactItem[];
    trialScheduleTitle: string;
    trialScheduleText: string;
    formTitle: string;
    submitBtnText: string;
    successTitle: string;
    successMessage: string;
    programOptions: string[];
  };
  pageStyles?: Record<string, PageStyleConfig>;
  pageBlocks?: Record<string, CustomPageBlock[]>;
}

export const initialSiteContent: SiteContent = {
  global: {
    brandPrefix: 'TELESPORTS',
    brandSuffix: '',
    tagline: 'Adding Value Through Sports',
    bookTrialBtn: 'Book Trial Session',
    footerDescription:
      'The premier institution for professional sports management, elite athlete development, biomechanical training science, and international tournament pathways.',
    copyrightText: 'Telesports Academy & Sports Management. All rights reserved.',
    hqAddress: '100 Olympic Way, Sports City Complex, Sector 4',
    hqPhone: '+1 (800) 555-TELESPORTS',
    hqEmail: 'admissions@telesportsacademy.com',
    hqColumnTitle: 'HQ Campus',
    logoUrl: '/assets/aistudio/file_000000007aec821083703bd6c537a40b_2f531d18.png',
    navItems: [
      { id: 'home', label: 'Home', visible: true },
      { id: 'programs', label: 'Programs', visible: true },
      { id: 'partners', label: 'Our Partners', visible: true },
      { id: 'coaches', label: 'Coaches', visible: true },
      { id: 'coach-jobs', label: 'Coach Careers', badge: 'Hiring', visible: true },
      { id: 'parent-requests', label: 'Parent Requests', visible: true },
      { id: 'merchandise', label: 'Store & Merch', visible: true },
      { id: 'announcements', label: 'Announcements', visible: true },
      { id: 'aicoach', label: 'AI Coach', badge: 'AI', visible: true },
      { id: 'news', label: 'News', visible: true },
      { id: 'contact', label: 'Admissions', visible: true },
    ],
    footerColumns: [
      {
        id: 'academies',
        title: 'Academies',
        links: [
          { label: 'Football Pro Pathway', tabId: 'programs' },
          { label: 'Grand Slam Tennis', tabId: 'programs' },
          { label: 'Hoops Elite Basketball', tabId: 'programs' },
          { label: 'Hydro-Dynamics Swimming', tabId: 'programs' },
          { label: 'Esports & Sim Racing', tabId: 'programs' },
        ],
      },
      {
        id: 'management',
        title: 'Management',
        links: [
          { label: 'Our Partners', tabId: 'partners' },
          { label: 'Coaching Directory', tabId: 'coaches' },
          { label: 'Announcements', tabId: 'announcements' },
          { label: 'AI Sports Assistant', tabId: 'aicoach' },
          { label: 'Scout Inquiries', tabId: 'contact' },
        ],
      },
    ],
    socialLinks: [
      { id: 'soc-ig', platform: 'Instagram', url: '#instagram' },
      { id: 'soc-tw', platform: 'Twitter', url: '#twitter' },
      { id: 'soc-yt', platform: 'YouTube', url: '#youtube' },
      { id: 'soc-fb', platform: 'Facebook', url: '#facebook' },
    ],
    legalLinks: [
      {
        id: 'leg-privacy',
        label: 'Privacy Policy',
        content: 'Telesports Academy respects athlete and parent privacy. All admissions, training requests, and partnership records are handled securely and confidentially.',
      },
      {
        id: 'leg-terms',
        label: 'Terms of Academy',
        content: 'Participation in Telesports Academy training programs, camps, and partner events adheres to academy sportsmanship, attendance, and registration guidelines.',
      },
      {
        id: 'leg-safe',
        label: 'Athlete Safeguarding',
        content: 'Telesports Academy maintains strict youth and athlete safeguarding standards with certified coaches, medical readiness, and supervised training environments.',
      },
    ],
    sportsList: ['Football', 'Tennis', 'Basketball', 'Swimming', 'Cricket', 'Esports'],
  },
  home: {
    heroImage: 'https://images.unsplash.com/photo-1517649763962-0c6232660102?auto=format&fit=crop&q=80&w=800',
    heroBadge: 'Next-Gen Elite Sports Management & Academy',
    heroTitle: 'Forge Your Legacy In Professional Sports',
    heroSubtitle:
      'Empowering world-class athletes and managing elite sports careers through biomechanical science, expert coaching, and direct global club scouting pipelines.',
    heroPrimaryCta: 'Book Trial Session',
    heroSecondaryCta: 'Explore Academies',
    stat1Value: '1,200+',
    stat1Label: 'Elite Athletes Trained',
    stat2Value: '45+',
    stat2Label: 'Pro Club Signings',
    stat3Value: '98.4%',
    stat3Label: 'Scholarship Success',
    stats: [
      { value: '1,200+', label: 'Elite Athletes Trained' },
      { value: '45+', label: 'Pro Club Signings' },
      { value: '98.4%', label: 'Scholarship Success' },
    ],
    quickNavTiles: [
      { id: 'home', label: 'Home', targetTab: 'home', visible: true },
      { id: 'programs', label: 'Programs', targetTab: 'programs', visible: true },
      { id: 'partners', label: 'Our Partners', targetTab: 'partners', visible: true },
      { id: 'coaches', label: 'Coaches', targetTab: 'coaches', visible: true },
      { id: 'coach-jobs', label: 'Coach Careers', badge: 'Hiring', targetTab: 'coach-jobs', visible: true },
      { id: 'parent-requests', label: 'Parent Requests', targetTab: 'parent-requests', visible: true },
      { id: 'merchandise', label: 'Store & Merch', targetTab: 'merchandise', visible: true },
      { id: 'announcements', label: 'Announcements', targetTab: 'announcements', visible: true },
      { id: 'news', label: 'News', targetTab: 'news', visible: true },
      { id: 'contact', label: 'Admissions', targetTab: 'contact', visible: true },
    ],
    labBadge: 'Live Biomechanics Lab',
    labTitle: 'Real-time Kinetix & Analytics',
    labStatus: 'ACTIVE',
    programsBadge: 'Elite Academies',
    programsHeading: 'World-Class Sports Programs',
    programsLinkText: 'View All Programs & Pricing',
    whyBadge: 'The Telesports Standard',
    whyHeading: 'Why Elite Athletes Choose Us',
    whySubheading:
      'We combine elite sports coaching with cutting-edge sports science, AI analytics, and professional management.',
    whyCards: [
      {
        title: 'Expert Coaches',
        description:
          'Train under legendary mentors and professional coaches with proven championship track records.',
      },
      {
        title: 'Biomechanics & AI Labs',
        description:
          'Real-time tracking of speed, endurance, and kinematics to maximize performance and prevent injury.',
      },
      {
        title: 'Global Scouting Network',
        description:
          'Direct pathways and showcase tournaments attended by international club scouts and collegiate recruiters.',
      },
      {
        title: 'Total Career Management',
        description:
          'Comprehensive contract advisory, brand management, sports psychology, and nutritional science.',
      },
    ],
    testimonialsBadge: 'Success Stories',
    testimonialsHeading: 'Voices from Our Athletes',
    testimonials: [
      {
        quote:
          '"Telesports Academy changed my career trajectory entirely. The coaching staff and AI performance analytics gave me the exact edge I needed to sign my first professional contract."',
        name: 'Marcus Vance',
        role: 'Pro Football Striker',
        avatar:
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      },
      {
        quote:
          '"The tennis facilities and 1-on-1 sparring sessions are world-class. The mental conditioning workshops helped me reach the Junior ITF finals."',
        name: 'Elena Rostova',
        role: 'Academy Tennis Star',
        avatar:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      },
      {
        quote:
          '"As a parent, seeing the level of care, education, and professional guidance at Telesports gives me absolute peace of mind. Truly an elite institution."',
        name: 'Robert Kalu',
        role: 'Elite Basketball Parent',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      },
    ],
    ctaBadge: 'Admissions Open for 2026/2027',
    ctaHeading: 'Ready to Take Your Athletic Career to the Pro Level?',
    ctaSubheading:
      'Book a trial training session or request a professional scouting evaluation with our academy directors today.',
    ctaPrimaryBtn: 'Book Trial Session Now',
    ctaSecondaryBtn: 'Ask AI Sports Coach',
  },
  programs: {
    badge: 'Elite Academies & Curricula',
    heading: 'Professional Training Programs',
    subheading:
      'Explore our comprehensive athletic training pathways designed to take players from junior development to professional club contracts.',
    searchPlaceholder: 'Search programs...',
    viewDetailsText: 'View Full Curriculum & Apply',
    enrollBtnPrefix: 'Enroll / Book Trial for',
    highlightsHeading: 'Program Highlights & Training Modules',
    categories: ['Junior Development', 'Elite High-Performance', 'Pro Pathway', 'Summer Intensive'],
  },
  partners: {
    badge: 'Schools & Organizations We Work With',
    heading: 'Our Partners',
    subheading:
      'Schools, colleges, corporate organizations, and institutions partnering with Telesports Academy for sports development, team building, soft skills, and wellness programs.',
    searchPlaceholder: 'Search schools, organizations, programs...',
    viewBtnText: 'View Partnership',
    categories: ['School', 'College / University', 'Corporate Organization', 'Ministry / Community'],
    statuses: ['Active Partner', 'Featured Client', 'Ongoing Program'],
  },
  coaches: {
    badge: 'World-Class Mentorship',
    heading: 'Expert Coaching Staff',
    subheading:
      'Train under elite license managers, Olympic biomechanists, and Grand Slam champions.',
    bookBtnText: 'Book 1-on-1 Session',
    bookingModalTitle: 'Book 1-on-1 Mentorship',
    bookingSuccessTitle: 'Session Requested Successfully!',
    bookingSuccessMessage: "The coach's office will contact you within 24 hours to confirm the schedule.",
  },
  coachJobs: {
    badge: 'Careers & Staff Recruitment',
    heading: 'Join Our World-Class Coaching Staff',
    subheading:
      'Are you an elite tactical coach, sports scientist, or instructor? Apply for a coaching position at Telesports Academy and mentor the next generation of professional athletes.',
    applyBtnText: 'Apply For Coaching Job',
    modalTitle: 'Coach Job Application Portal',
    modalSubmitText: 'Submit Coach Application',
    successTitle: 'Application Submitted Successfully!',
    successMessage: 'Our HR & Technical Board will review your credentials and reach out via email.',
    extraQuestions: [],
    listHeading: 'Recent Coaching Applications',
    listSubheading: 'Applications reviewed weekly by Academy Technical Director',
  },
  parentRequests: {
    badge: 'Parent Portal & Custom Sport Request',
    heading: 'Request Sport Training For Your Child',
    subheading:
      'Parents can submit specific sport training requests, select age-group pathways, and schedule initial diagnostic trial assessments for their kids.',
    requestBtnText: 'Request Sport Training',
    modalTitle: 'Parent Sport Training Request',
    modalSubmitText: 'Submit Sport Request',
    successTitle: 'Sport Request Sent Successfully!',
    successMessage: 'Our academy coordinator will review your request and contact you with trial session details.',
    skillLevels: ['Beginner', 'Intermediate', 'Advanced / Competitive'],
    extraQuestions: [],
    listHeading: 'Active Training Requests',
    listSubheading: 'Assigned to Academy Sports Coordinators',
  },
  merchandise: {
    badge: 'Official Store & Gear',
    heading: 'Telesports Academy Merchandise',
    subheading:
      'Equip yourself with official pro jerseys, training gear, and equipment built for champions.',
    addToCartText: 'Add To Cart',
    cartLabel: 'Cart',
    checkoutBtnText: 'Proceed to Secure Checkout',
    orderSuccessTitle: 'Order Placed Successfully!',
    orderSuccessMessage: 'Thank you for supporting Telesports Academy. Your order confirmation has been recorded.',
    categories: ['Apparel', 'Footwear', 'Equipment', 'Accessories'],
  },
  announcements: {
    badge: 'Official Academy Notice Board',
    heading: 'Announcements & Photo Highlights',
    subheading:
      'Stay updated with official notices, upcoming training camps, partner school events, and campus photo updates.',
    searchPlaceholder: 'Search announcements...',
    readMoreText: 'Read Full Announcement →',
    categories: ['General Notice', 'Training Camp', 'School & Org Event', 'Trials & Admissions', 'Urgent Update'],
  },
  aiCoach: {
    badge: 'Gemini Powered Sports Intelligence',
    heading: 'AI Sports Coach & Scouting Assistant',
    subheading:
      'Generate custom training plans, biomechanical diagnostics, and match scouting reports instantly.',
    welcomeMessage:
      'Greetings, Coach! I am your AI Head Sports Scientist & Tactical Assistant at Telesports Academy. Select a partner school or organization, or ask me to draft training regimens, team building programs, match scouting reports, or nutritional plans.',
    contextLabel: 'Context Partner:',
    generalOptionLabel: '-- General Academy Inquiry --',
    resetBtnText: 'Reset Chat',
    presetsLabel: 'Quick Prompts & Presets:',
    consoleTitle: 'Telesports AI Sports Intelligence Console',
    inputPlaceholder: 'Ask AI Coach for training regimens, scouting analysis, nutrition...',
    sendBtnText: 'Send',
    presetPrompts: [
      'Design a 7-day high-intensity stamina & agility regimen for an U18 striker.',
      'Analyze post-match recovery and hydration protocols for tennis tournaments.',
      'Draft a professional scout evaluation report assessing technical speed and mental toughness.',
      'What are the best injury prevention warm-ups for basketball players?',
    ],
  },
  news: {
    badge: 'Media & Press Releases',
    heading: 'Academy News & Updates',
    subheading:
      'Stay informed on championship victories, strategic scouting partnerships, and campus facility upgrades.',
    readMoreText: 'Read Full Article',
    closeBtnText: 'Close Article',
    categories: ['Academy News', 'Partnership', 'Facility Update', 'Championships', 'Sports Science'],
  },
  contact: {
    badge: 'Admissions & Trial Bookings',
    heading: 'Join Telesports Academy',
    subheading:
      'Submit your application for academy enrollment, trial training sessions, or scout assessments.',
    hqCardTitle: 'Campus Headquarters',
    locationLabel: 'Location & Complex',
    phoneLabel: 'Admissions Hotline',
    emailLabel: 'Email Admissions',
    extraContacts: [],
    trialScheduleTitle: 'Trial Assessment Schedule',
    trialScheduleText:
      'Trials are conducted every Saturday at 09:00 AM UTC. Please arrive 30 minutes prior with full athletic gear.',
    formTitle: 'Trial & Enrollment Application',
    submitBtnText: 'Submit Application & Trial Request',
    successTitle: 'Application Received Successfully!',
    successMessage:
      'Our admissions committee and sports directors will review your profile and contact you within 24 hours.',
    programOptions: [
      'Junior Development (U14)',
      'Elite High-Performance (U18)',
      'Pro Pathway / Showcase',
      'Summer Intensive Camp',
    ],
  },
  pageStyles: {},
  pageBlocks: {},
};
