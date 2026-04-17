export type ActivityCategory =
  | 'food'
  | 'cafe'
  | 'sightseeing'
  | 'shopping'
  | 'transport'
  | 'hotel'
  | 'other';

export type TripStatus = 'planning' | 'active' | 'completed';

export type Trip = {
  id: string;
  title: string;
  destination: string;
  baseArea: string;
  hotel: string;
  startDate: string;
  endDate: string;
  departureDate: string;
  coverImage: string;
  status: TripStatus;
};

export type DayWeather = {
  condition: string;
  icon: string;
  minC: number;
  maxC: number;
};

export type ItineraryDay = {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  district: string;
  weather: DayWeather;
};

export type Activity = {
  id: string;
  dayId: string;
  title: string;
  category: ActivityCategory;
  time: string;
  place: string;
  note: string;
  cost: number;
  order: number;
};

export type SeedData = {
  trip: Trip;
  days: ItineraryDay[];
  activities: Activity[];
};
