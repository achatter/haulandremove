export type Category = 'estate_cleanout' | 'junk_removal';
export type BusinessStatus = 'active' | 'inactive';

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  street_address: string | null;
  city: string;
  state: string;
  state_full: string;
  zip_code: string;
  years_in_business: number | null;
  insured: boolean;
  bonded: boolean;
  featured: boolean;
  average_rating: number;
  review_count: number;
  status: BusinessStatus;
  created_at: string;
  images?: BusinessImage[];
}

export interface BusinessImage {
  id: string;
  business_id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  reviewer_name: string;
  reviewer_email: string | null;
  rating: number;
  title: string;
  body: string;
  is_flagged: boolean;
  created_at: string;
}

export interface SearchParams {
  q?: string;
  category?: Category | '';
  state?: string;
  sort?: 'rating' | 'name' | 'newest';
  page?: string;
}

export interface ReviewFormData {
  business_id: string;
  reviewer_name: string;
  reviewer_email?: string;
  rating: number;
  title: string;
  body: string;
}
