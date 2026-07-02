import type { Submission, Village } from '../types';

// Demographic context for the sample constituency (open data style: population, households,
// school enrolment, distance to PHC). The MP dashboard weighs citizen demand against these
// numbers so a request from a large under-served village outranks noise.
export const VILLAGES: Village[] = [
  { name: 'Rompicherla', lat: 16.18, lng: 80.06, population: 12400, households: 2900, schoolEnrolment: 1850, phcDistanceKm: 14 },
  { name: 'Nekarikallu', lat: 16.21, lng: 80.12, population: 9800, households: 2300, schoolEnrolment: 1420, phcDistanceKm: 9 },
  { name: 'Narasaraopet', lat: 16.235, lng: 80.045, population: 38000, households: 8600, schoolEnrolment: 5200, phcDistanceKm: 2 },
  { name: 'Chilakaluripet', lat: 16.09, lng: 80.16, population: 21000, households: 5100, schoolEnrolment: 3100, phcDistanceKm: 6 },
];

// Realistic sample citizen submissions for a sample constituency (Narasaraopet, AP).
// Multilingual on purpose, to showcase inclusivity. Coordinates are spread across nearby villages.
export const SEED: Submission[] = [
  { id: 's1', text: 'हमारे गाँव में पीने का पानी नहीं आता, हफ्ते में सिर्फ दो दिन सप्लाई होती है।', language: 'hi', category: 'Water', village: 'Rompicherla', lat: 16.18, lng: 80.05, createdAt: Date.now() - 86400000 * 22 },
  { id: 's2', text: 'మా ఊరిలో నీళ్ళు సరిగా రావడం లేదు, బోరు ఎండిపోయింది.', language: 'te', category: 'Water', village: 'Nekarikallu', lat: 16.21, lng: 80.12, createdAt: Date.now() - 86400000 * 16 },
  { id: 's3', text: 'The road to the village school is broken, children fall during monsoon.', language: 'en', category: 'Roads', village: 'Rompicherla', lat: 16.19, lng: 80.06, createdAt: Date.now() - 86400000 * 19 },
  { id: 's4', text: 'రోడ్డు బాగా పాడైంది, బస్సు రావడం లేదు.', language: 'te', category: 'Roads', village: 'Nekarikallu', lat: 16.22, lng: 80.11, createdAt: Date.now() - 86400000 * 12 },
  { id: 's5', text: 'PHC has no doctor after 5pm, pregnant women travel 30km at night.', language: 'en', category: 'Health', village: 'Narasaraopet', lat: 16.23, lng: 80.04, createdAt: Date.now() - 86400000 * 13 },
  { id: 's6', text: 'अस्पताल में डॉक्टर नहीं है, बुखार के लिए शहर जाना पड़ता है।', language: 'hi', category: 'Health', village: 'Narasaraopet', lat: 16.24, lng: 80.03, createdAt: Date.now() - 86400000 * 9 },
  { id: 's7', text: 'Street lights not working, unsafe for girls returning from college.', language: 'en', category: 'Electricity', village: 'Chilakaluripet', lat: 16.09, lng: 80.16, createdAt: Date.now() - 86400000 * 11 },
  { id: 's8', text: 'కరెంట్ తరచూ పోతుంది, పిల్లల చదువుకు ఇబ్బంది.', language: 'te', category: 'Electricity', village: 'Chilakaluripet', lat: 16.10, lng: 80.17, createdAt: Date.now() - 86400000 * 8 },
  { id: 's9', text: 'No drainage, water logs in front of houses, mosquitoes everywhere.', language: 'en', category: 'Sanitation', village: 'Rompicherla', lat: 16.18, lng: 80.07, createdAt: Date.now() - 86400000 * 7 },
  { id: 's10', text: 'गाँव के स्कूल में शिक्षक कम हैं, बच्चे पढ़ नहीं पाते।', language: 'hi', category: 'Education', village: 'Nekarikallu', lat: 16.20, lng: 80.13, createdAt: Date.now() - 86400000 * 6 },
  { id: 's11', text: 'Borewell water is salty, need clean drinking water connection.', language: 'en', category: 'Water', village: 'Narasaraopet', lat: 16.235, lng: 80.045, createdAt: Date.now() - 86400000 * 2 },
  { id: 's12', text: 'రైతులకు సరైన మార్కెట్ ధర రావడం లేదు, పంట అమ్మడం కష్టం.', language: 'te', category: 'Agriculture', village: 'Chilakaluripet', lat: 16.08, lng: 80.15, createdAt: Date.now() - 86400000 * 5 },
  { id: 's13', text: 'पानी की टंकी खराब है, पूरे मोहल्ले में सप्लाई बंद है।', language: 'hi', category: 'Water', village: 'Narasaraopet', lat: 16.232, lng: 80.05, createdAt: Date.now() - 86400000 * 1 },
  { id: 's14', text: 'பள்ளியில் கழிப்பறை இல்லை, பெண் குழந்தைகள் சிரமப்படுகிறார்கள்.', language: 'ta', category: 'Sanitation', village: 'Nekarikallu', lat: 16.205, lng: 80.125, createdAt: Date.now() - 86400000 * 2 },
  { id: 's15', text: 'PHC ambulance not available at night, very risky for delivery cases.', language: 'en', category: 'Health', village: 'Rompicherla', lat: 16.182, lng: 80.058, createdAt: Date.now() - 3600000 * 8 },
  { id: 's16', text: 'বর্ষায় পুরো রাস্তা জলে ডুবে যায়, স্কুলে যাওয়া যায় না।', language: 'bn', category: 'Roads', village: 'Chilakaluripet', lat: 16.095, lng: 80.158, createdAt: Date.now() - 3600000 * 3 },
];
