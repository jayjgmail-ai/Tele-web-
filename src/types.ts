export type SportType = string;

export type PartnerCategory = string;

export interface ExtraDetailItem {
  label: string;
  value: string;
}

export interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;
  focusArea: string;
  programsProvided: string[];
  description: string;
  logoOrImage: string;
  location: string;
  contactPerson?: string;
  partnerSince: string;
  status: string;
  extraDetails?: ExtraDetailItem[];
  extraPhotos?: string[];
}

export interface Coach {
  id: string;
  name: string;
  sport: SportType;
  role: string;
  experienceYears: number;
  bio: string;
  image: string;
  certifications: string[];
  rating: number;
  extraDetails?: ExtraDetailItem[];
  extraPhotos?: string[];
}

export interface Program {
  id: string;
  title: string;
  sport: SportType;
  category: string;
  duration: string;
  schedule: string;
  price: string;
  description: string;
  highlights: string[];
  image: string;
  extraDetails?: ExtraDetailItem[];
  extraPhotos?: string[];
}

export type AnnouncementCategory = string;

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  message: string;
  photo?: string;
  date: string;
  pinned?: boolean;
  author: string;
  extraDetails?: ExtraDetailItem[];
  extraPhotos?: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  image: string;
  extraDetails?: ExtraDetailItem[];
  extraPhotos?: string[];
}

export interface CoachApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  sport: SportType;
  experienceYears: number;
  certifications: string;
  philosophy: string;
  status: 'Pending Review' | 'Interview Scheduled' | 'Approved';
  appliedDate: string;
  extraAnswers?: ExtraDetailItem[];
}

export interface ParentSportRequest {
  id: string;
  parentName: string;
  parentEmail: string;
  phone: string;
  kidName: string;
  kidAge: number;
  sport: SportType;
  skillLevel: string;
  trainingGoals: string;
  requestDate: string;
  status: 'Received' | 'Trial Assigned' | 'Enrolled';
  extraAnswers?: ExtraDetailItem[];
}

export interface MerchandiseItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  sizes?: string[];
  inStock: boolean;
  extraDetails?: ExtraDetailItem[];
  extraPhotos?: string[];
}

export type NotificationCategory = 'purchases' | 'requests' | 'applications';

export interface AdminNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  subtitle: string;
  details: string;
  timestamp: string;
  read: boolean;
  targetTab: string;
  amount?: string;
}
