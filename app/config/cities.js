export const ACTIVE_CITIES = ['Lucknow'];
export const DEFAULT_CITY = 'Lucknow';
export const DEFAULT_STATE = 'Uttar Pradesh';
export const DEFAULT_COUNTRY = 'India';

// Helper function to check if a city is active
export const isCityActive = (city) => {
  return ACTIVE_CITIES.includes(city);
};
