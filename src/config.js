// kazispot/frontend/app/src/config.js

// CRITICAL FIX: Hardcoding the live Render URL to bypass potential 
// environment variable injection issues during Vercel build process.
export const API_BASE_URL = 'https://kazispot-api.onrender.com';