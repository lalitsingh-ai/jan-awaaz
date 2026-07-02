// Core domain types for Jan Awaaz (People's Priorities)

export type Category =
  | 'Water'
  | 'Roads'
  | 'Electricity'
  | 'Health'
  | 'Education'
  | 'Sanitation'
  | 'Employment'
  | 'Agriculture'
  | 'Other';

export type Sentiment = 'angry' | 'frustrated' | 'concerned' | 'hopeful';

export interface Submission {
  id: string;
  text: string;            // citizen text (any language)
  language: string;        // BCP-47-ish label e.g. 'hi', 'en', 'te'
  category: Category;
  village: string;
  lat: number;
  lng: number;
  photo?: string;          // optional data-URL of an uploaded photo
  createdAt: number;
}

export interface Village {
  name: string;
  lat: number;
  lng: number;
  population: number;      // for demand-vs-need weighting
  households: number;
  schoolEnrolment: number; // children enrolled
  phcDistanceKm: number;   // distance to nearest health centre
}

export interface Priority {
  category: Category;
  title: string;           // short title an MP can read
  count: number;           // how many citizens raised it
  urgency: number;         // 1-100
  sentiment: Sentiment;
  recommendation: string;  // suggested action for the MP
  villages: string[];      // demand hotspots
  peopleReached: number;   // est. population that benefits
  score: number;           // ranking score (demand x urgency x reach)
}

export interface Brief {
  headline: string;        // one-line summary for the MP
  bullets: string[];       // 3 quick takeaways for a busy MP
}
