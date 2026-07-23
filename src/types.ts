export type MediaType = 'image' | 'video' | 'link';

export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface PortfolioItem {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  clientName?: string;
  projectDate: string;
  designer: string;
  tags: string[];
  category: string; // e.g. "Poster Design", "Logo Design"
  mediaType: MediaType;
  imageUrl?: string;
  videoUrl?: string;
  externalLink?: string;
  thumbnail: string;
  additionalGallery: string[];
  softwareUsed: string[];
  duration?: string;
  completionDate?: string;
  featured: boolean;
  homepage: boolean;
  public: boolean;
  acceptSimilar: boolean;
  seoUrl: string;
  metaDescription: string;
  keywords: string[];
  createdDate: string;
  updatedDate: string;
  views: number;
  likes: number;
  status: ProjectStatus;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export interface BookingItem {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  serviceType: string;
  projectDetails: string;
  budget: string;
  targetDate: string;
  designProofUrl?: string;
  referencedProjectId?: string;
  referencedProjectTitle?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  company: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
  featured: boolean;
  createdAt: string;
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  designProofUrl?: string;
  date: string;
  status: 'unread' | 'read' | 'archived';
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  priceRange: string;
  deliverables: string[];
}

export interface WebsiteContent {
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutBio: string;
  aboutExperienceYears: number;
  completedProjectsCount: number;
  satisfiedClientsCount: number;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    behance: string;
    dribbble: string;
    instagram: string;
    facebook: string;
    youtube: string;
    tiktok: string;
    vimeo: string;
  };
}
