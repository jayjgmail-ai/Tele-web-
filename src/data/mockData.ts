import { Partner, Coach, Program, Announcement, NewsArticle, CoachApplication, ParentSportRequest, MerchandiseItem } from '../types';

export const initialPartners: Partner[] = [
  {
    id: 'part-1',
    name: 'Britam',
    category: 'Corporate Organization',
    focusArea: 'Corporate Wellness Programs & Team Building',
    programsProvided: ['Health & Fitness', 'Emotional Intelligence', 'Experimental Learning', 'Team Work'],
    description:
      'Strategic corporate wellness and experiential team-building partner focused on leadership synergy, emotional wellness, and staff cohesion.',
    logoOrImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600',
    location: 'Nairobi, Kenya',
    partnerSince: '2023',
    status: 'Featured Client',
  },
  {
    id: 'part-2',
    name: 'Lizzie Wanyoike Preparatory',
    category: 'School',
    focusArea: 'Junior Sports Development & Boot Camps',
    programsProvided: ['Swimming', 'Football', 'Experimental Learning', 'Youth Leadership'],
    description:
      'Partnering to deliver structured physical education, swimming coaching, holiday boot camps, and youth character development through sports.',
    logoOrImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600',
    location: 'Nairobi, Kenya',
    partnerSince: '2022',
    status: 'Featured Client',
  },
  {
    id: 'part-3',
    name: 'Braeburn Group Of Schools',
    category: 'School',
    focusArea: 'Inter-School Athletics & Elite Coaching',
    programsProvided: ['Football', 'Tennis', 'Basketball', 'Swimming'],
    description:
      'Comprehensive athletic academy collaboration supporting competitive school teams, tactical mentorship, and regional tournament preparation.',
    logoOrImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600',
    location: 'Kenya & East Africa',
    partnerSince: '2022',
    status: 'Active Partner',
  },
  {
    id: 'part-4',
    name: 'Hillcrest Group Of Schools',
    category: 'School',
    focusArea: 'Elite Youth Sports & Biomechanical Conditioning',
    programsProvided: ['Swimming', 'Tennis', 'Football', 'Bonding Trips & Hiking'],
    description:
      'Delivering high-performance sports clinics, swimming hydrodynamics coaching, and outdoor leadership bonding excursions for students.',
    logoOrImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600',
    location: 'Karen, Nairobi',
    partnerSince: '2023',
    status: 'Active Partner',
  },
  {
    id: 'part-5',
    name: 'NIBS College',
    category: 'College / University',
    focusArea: 'Soft Skills Training & Collegiate Sports',
    programsProvided: ['Leadership', 'Communication', 'Customer Service', 'Football'],
    description:
      'Empowering college students and staff with practical soft skills training, career goal setting, and competitive campus sports programs.',
    logoOrImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600',
    location: 'Nairobi & Thika',
    partnerSince: '2023',
    status: 'Active Partner',
  },
  {
    id: 'part-6',
    name: 'KIPS College',
    category: 'College / University',
    focusArea: 'Student Mentorship, Wellness & Sports',
    programsProvided: ['Goal Setting', 'Time Management', 'Mental Health Wellness', 'Boot Camps'],
    description:
      'Collaborating on student wellness initiatives, personal development workshops, and structured sports leadership boot camps.',
    logoOrImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600',
    location: 'Nairobi, Kenya',
    partnerSince: '2024',
    status: 'Ongoing Program',
  },
  {
    id: 'part-7',
    name: 'Dhahabu Lands Ltd',
    category: 'Corporate Organization',
    focusArea: 'Sales Negotiation & Corporate Team Bonding',
    programsProvided: ['Sales & Negotiation', 'Bonding Trips & Hiking', 'Team Work'],
    description:
      'High-energy outdoor team building and sales alignment training designed to boost team resilience and collaborative execution.',
    logoOrImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
    location: 'Nairobi, Kenya',
    partnerSince: '2024',
    status: 'Active Partner',
  },
  {
    id: 'part-8',
    name: 'Uwezo Lands Ltd',
    category: 'Corporate Organization',
    focusArea: 'Experiential Team Building & Customer Service',
    programsProvided: ['Experimental Learning', 'Customer Service', 'Phone Etiquette'],
    description:
      'Tailored staff bonding retreats and soft skills workshops bridging departmental goals and strengthening client communication.',
    logoOrImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600',
    location: 'Kenya',
    partnerSince: '2024',
    status: 'Active Partner',
  },
  {
    id: 'part-9',
    name: 'Ckay Housing Corporation',
    category: 'Corporate Organization',
    focusArea: 'Occupational Wellness & Leadership Alignment',
    programsProvided: ['Occupational Wellness', 'Creating a Wellness Culture', 'Leadership'],
    description:
      'Building a sustainable workplace wellness culture through structured fitness days, team dynamics coaching, and leadership training.',
    logoOrImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600',
    location: 'Nairobi, Kenya',
    partnerSince: '2024',
    status: 'Ongoing Program',
  },
  {
    id: 'part-10',
    name: 'Farmhold Ventures',
    category: 'Corporate Organization',
    focusArea: 'Team Dynamics, Financial Planning & Bonding',
    programsProvided: ['Critical Thinking', 'Financial Planning', 'Boot Camps'],
    description:
      'Partnering on experiential outdoor boot camps and strategic soft skills workshops for high-performing organizational teams.',
    logoOrImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
    location: 'Kenya',
    partnerSince: '2025',
    status: 'Active Partner',
  },
  {
    id: 'part-11',
    name: 'Overcomers Hope Ministries',
    category: 'Ministry / Community',
    focusArea: 'Youth Sports Outreach & Spiritual Wellness',
    programsProvided: ['Spiritual Wellness', 'Emotional Wellness', 'Youth Sports Clinics'],
    description:
      'Community outreach and youth empowerment through organized sports, holistic wellness workshops, and character mentorship.',
    logoOrImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600',
    location: 'Nairobi, Kenya',
    partnerSince: '2023',
    status: 'Active Partner',
  },
];

export const initialCoaches: Coach[] = [
  {
    id: 'co-1',
    name: 'Sir David Sterling',
    sport: 'Football',
    role: 'Technical Director & Head Coach',
    experienceYears: 22,
    bio: 'Former UEFA Champions League finalist manager with over two decades of experience nurturing world-class professional footballers.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    certifications: ['UEFA Pro Licence', 'FIFA High Performance Diploma'],
    rating: 4.9
  },
  {
    id: 'co-2',
    name: 'Victoria Vance-Cole',
    sport: 'Tennis',
    role: 'Elite Tennis Head Coach',
    experienceYears: 16,
    bio: 'Former WTA top 20 player who has coached multiple Grand Slam junior champions and professional tour players.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    certifications: ['USPTA Elite Professional', 'ITF Level 3 Coach'],
    rating: 4.8
  },
  {
    id: 'co-3',
    name: 'Coach Malik Thornton',
    sport: 'Basketball',
    role: 'Head Basketball Development',
    experienceYears: 14,
    bio: 'Specializes in biomechanical shooting efficiency, court vision development, and collegiate placement pathways.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    certifications: ['USA Basketball Gold License', 'NBA Coaches Association Member'],
    rating: 4.9
  },
  {
    id: 'co-4',
    name: 'Dr. Samantha Brooks',
    sport: 'Swimming',
    role: 'Director of Aquatic Sports & Sports Science',
    experienceYears: 18,
    bio: 'Olympic swim team biomechanist and sports nutritionist dedicated to hydrodynamic optimization and peak recovery.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    certifications: ['Ph.D. Biomechanics', 'ASCA Level 5 Coach'],
    rating: 5.0
  }
];

export const initialPrograms: Program[] = [
  {
    id: 'prog-1',
    title: 'Elite Football Pro Pathway',
    sport: 'Football',
    category: 'Pro Pathway',
    duration: 'Full Academic Year / Intensive',
    schedule: 'Mon - Fri (08:00 - 16:00)',
    price: 'Ksh 150,000 / year',
    description: 'A rigorous professional immersion program combining elite tactical training, match analysis, sports science, and international showcase tours.',
    highlights: ['Daily tactical & technical sessions', 'GPS tracking & video analysis', 'Match play vs Academy Pro sides', 'Academic tutoring included'],
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'prog-2',
    title: 'Grand Slam Tennis Academy',
    sport: 'Tennis',
    category: 'Elite High-Performance',
    duration: '12 Weeks / Semester',
    schedule: 'Mon - Sat (07:00 - 13:00)',
    price: 'Ksh 95,000 / semester',
    description: 'High-intensity court training focusing on modern biomechanics, mental toughness, footwork agility, and ITF tournament preparation.',
    highlights: ['1-on-1 sparring & hitting partners', 'Mental conditioning workshops', 'Video stroke biomechanics review', 'ITF tournament travel support'],
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'prog-3',
    title: 'Hoops Elite Basketball Camp',
    sport: 'Basketball',
    category: 'Elite High-Performance',
    duration: '8 Weeks Intensive',
    schedule: 'Mon - Fri (14:00 - 19:00)',
    price: 'Ksh 55,000',
    description: 'Master ball handling, shooting mechanics, defensive IQ, and team play with state-of-the-art shooting machines and expert coaching.',
    highlights: ['Vertical jump & agility lab', 'Game film breakdown sessions', 'Scout showcase games', 'Strength & conditioning'],
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'prog-4',
    title: 'Hydro-Dynamics Elite Swimming',
    sport: 'Swimming',
    category: 'Junior Development',
    duration: 'Semester Program',
    schedule: 'Mon - Sat (05:30 - 08:30)',
    price: 'Ksh 75,000 / year',
    description: 'Advanced stroke correction, underwater filming analysis, endurance threshold building, and competitive race strategy.',
    highlights: ['Underwater HD camera analysis', 'Customized caloric & nutrition plans', 'Dryland strength training', 'Regional & National meet prep'],
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'prog-5',
    title: 'Esports & Sim Racing Pro Academy',
    sport: 'Esports',
    category: 'Pro Pathway',
    duration: '6 Months',
    schedule: 'Tue - Sun (15:00 - 20:00)',
    price: 'Ksh 65,000',
    description: 'Professional training in competitive esports titles and high-fidelity sim racing. Focus on reflexes, team synergy, mental endurance, and media training.',
    highlights: ['Pro-grade simulator rigs', 'Sports psychologist sessions', 'Twitch/Media streaming coaching', 'Global tournament representation'],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: '2026 Holiday Sports & Team-Building Boot Camp Registration Open',
    category: 'Training Camp',
    message:
      'Registration is now open for youth athletes, partner schools, and corporate teams! Join us for intensive Football, Swimming, Tennis, Basketball, and Experiential Team-Building sessions led by our senior coaching staff.',
    photo: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800',
    date: 'Nov 21, 2026',
    pinned: true,
    author: 'Academy Technical Director',
  },
  {
    id: 'ann-2',
    title: 'Corporate Wellness & Soft Skills Packages Available for Q1 2027',
    category: 'School & Org Event',
    message:
      'Organizations and colleges can now book customized Team Building, Emotional Intelligence, Leadership, and Occupational Wellness programs tailored to team dynamics and workplace performance.',
    photo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    date: 'Nov 19, 2026',
    pinned: true,
    author: 'Corporate Partnerships Office',
  },
  {
    id: 'ann-3',
    title: 'Saturday Youth Trial & Diagnostic Assessments Schedule',
    category: 'Trials & Admissions',
    message:
      'All newly registered junior and U18 athletes should report at 08:30 AM with full training kit for Saturday biomechanical, agility, and sport-specific evaluations.',
    photo: 'https://images.unsplash.com/photo-1517649763962-0c6232660102?auto=format&fit=crop&q=80&w=800',
    date: 'Nov 17, 2026',
    pinned: false,
    author: 'Admissions Coordinator',
  },
  {
    id: 'ann-4',
    title: 'Official Telesports Academy Merchandise Restock Notice',
    category: 'General Notice',
    message:
      'Fresh stock of our 2026 Pro Home Kits, Champion Hoodies, and match equipment has arrived at the Academy Store. Orders can be placed directly online in Ksh.',
    photo: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    date: 'Nov 14, 2026',
    pinned: false,
    author: 'Operations Desk',
  },
];

export const initialNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Telesports Academy Signs Strategic Partnership with European Pro Scouts',
    category: 'Partnerships',
    date: 'Nov 20, 2026',
    readTime: '4 min read',
    summary: 'Our elite athletes will now have direct pathways to trials with top-tier international clubs across Europe and North America.',
    content: 'Telesports Academy is thrilled to announce a landmark agreement with an international sports management network. This partnership establishes a direct scouting pipeline, allowing our top academy graduates in football, basketball, and tennis to bypass preliminary hurdles and attend direct professional trials...',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'news-2',
    title: 'State-of-the-Art Biomechanics & AI Lab Opens at Telesports Campus',
    category: 'Facility Upgrade',
    date: 'Nov 15, 2026',
    readTime: '3 min read',
    summary: 'Equipped with 4K high-speed motion capture and AI performance diagnostics, our new lab redefines athlete development.',
    content: 'The newly inaugurated Telesports Science and Biomechanics Lab provides unprecedented insights into athlete kinetics, muscle load, and injury prevention. Utilizing custom AI algorithms developed in conjunction with sports scientists, coaches can now pinpoint mechanical inefficiencies down to the millisecond...',
    image: 'https://images.unsplash.com/photo-1517649763962-0c6232660102?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'news-3',
    title: 'Marcus Vance Secures U18 Golden Boot & International Call-up',
    category: 'Athlete Success',
    date: 'Nov 10, 2026',
    readTime: '2 min read',
    summary: 'Academy striker Marcus Vance caps off a stellar season with 24 goals and his first national youth team selection.',
    content: 'Our star striker Marcus Vance continues his meteoric rise. After netting a phenomenal hat-trick in the regional final last weekend, Marcus has officially received his first call-up to the National U19 squad. Congratulations to Marcus and our exceptional coaching staff...',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=600'
  }
];

export const initialCoachApplications: CoachApplication[] = [
  {
    id: 'app-1',
    fullName: 'Arthur Pendelton',
    email: 'arthur.coach@example.com',
    phone: '+1 (555) 382-9102',
    sport: 'Football',
    experienceYears: 9,
    certifications: 'UEFA A Licence, FA Youth Module 3',
    philosophy: 'High-pressing, possession-dominant tactical discipline with rigorous physical conditioning.',
    status: 'Interview Scheduled',
    appliedDate: '2026-11-18'
  },
  {
    id: 'app-2',
    fullName: 'Clara Dupond',
    email: 'clara.tennis@example.com',
    phone: '+1 (555) 491-8273',
    sport: 'Tennis',
    experienceYears: 12,
    certifications: 'USPTA Elite Professional, PTR Master of Tennis',
    philosophy: 'Biomechanically sound strokes, aggressive baseline positioning, and elite mental composure.',
    status: 'Pending Review',
    appliedDate: '2026-11-19'
  }
];

export const initialParentRequests: ParentSportRequest[] = [
  {
    id: 'req-1',
    parentName: 'Eleanor Vance',
    parentEmail: 'eleanor.vance@example.com',
    phone: '+1 (555) 902-1182',
    kidName: 'Leo Vance',
    kidAge: 12,
    sport: 'Football',
    skillLevel: 'Intermediate',
    trainingGoals: 'Prepare for junior academy tryouts and improve tactical vision.',
    requestDate: '2026-11-19',
    status: 'Trial Assigned'
  },
  {
    id: 'req-2',
    parentName: 'Harrison Ford',
    parentEmail: 'harrison.bball@example.com',
    phone: '+1 (555) 481-9923',
    kidName: 'Maya Ford',
    kidAge: 14,
    sport: 'Basketball',
    skillLevel: 'Advanced / Competitive',
    trainingGoals: 'Shooting efficiency and point guard court leadership.',
    requestDate: '2026-11-20',
    status: 'Received'
  }
];

export const initialMerchandise: MerchandiseItem[] = [
  {
    id: 'merch-1',
    name: 'Telesports Elite Pro Home Kit 2026',
    category: 'Apparel',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=500',
    description: 'Official moisture-wicking home jersey featuring the Telesports Academy crest and vibrant brand accents.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  },
  {
    id: 'merch-2',
    name: 'Telesports Academy Champion Hoodie',
    category: 'Apparel',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=500',
    description: 'Heavyweight fleece hoodie designed for pre-match warmups and travel days.',
    sizes: ['M', 'L', 'XL'],
    inStock: true
  },
  {
    id: 'merch-3',
    name: 'Pro Match Football (FIFA Quality)',
    category: 'Equipment',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1614632537455-c9381e8e7162?auto=format&fit=crop&q=80&w=500',
    description: 'Official match ball with thermal-bonded seamless surface for precise flight trajectory.',
    inStock: true
  },
  {
    id: 'merch-4',
    name: 'Titanium Hydro Training Water Bottle',
    category: 'Accessories',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=500',
    description: 'Double-wall vacuum insulated stainless steel bottle keeping drinks ice-cold for 24 hours.',
    inStock: true
  }
];
