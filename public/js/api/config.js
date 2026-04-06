const CONFIG = {
  SUPABASE_URL: 'https://jloymzjrjaacfhylhobo.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsb3ltempyamFhY2ZoeWxob2JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTc5NDAsImV4cCI6MjA5MTAzMzk0MH0.Or3_mHlakRtwadQPJdWsp6WrPEmcF-pBNoGYHlJ3jxg'
};

const API_ENDPOINTS = {
  GET_TODOS: '/rest/v1/todos?select=*&order=created_at.desc',
  ADD_TODO: '/rest/v1/todos',
  UPDATE_TODO: '/rest/v1/todos',
  DELETE_TODO: '/rest/v1/todos',
  GET_STATS: '/rest/v1/stats?select=*&id=eq.default',
  UPDATE_STATS: '/rest/v1/stats'
};

const HEADERS = {
  'apikey': CONFIG.SUPABASE_ANON_KEY,
  'Authorization': 'Bearer ' + CONFIG.SUPABASE_ANON_KEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

window.CONFIG = CONFIG;
window.API_ENDPOINTS = API_ENDPOINTS;
window.HEADERS = HEADERS;
