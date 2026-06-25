export const ACTIVE_CITIES = ['Lucknow'];
export const DEFAULT_CITY = 'Lucknow';
export const DEFAULT_STATE = 'Uttar Pradesh';
export const DEFAULT_COUNTRY = 'India';

export const LUCKNOW_ZONES = [
  "Gomti Nagar",
  "Hazratganj",
  "Aliganj",
  "Indira Nagar",
  "Vikas Nagar",
  "Jankipuram",
  "Ashiyana",
  "Charbagh",
  "Mahanagar",
  "Aminabad",
  "Sushant Golf City",
  "Chowk",
  "Alambagh",
  "Rajajipuram",
  "Kapoorthala"
];

export const CITY_ZONES = {
  "Lucknow": LUCKNOW_ZONES
};

// Helper function to check if a city is active
export const isCityActive = (city) => {
  return ACTIVE_CITIES.includes(city);
};
