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

export type FlightBooking = {
  id: string;
  tripType: 'outbound' | 'return';
  routeTitle: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  departureTerminal: string;
  arrivalAirport: string;
  arrivalTerminal: string;
  flightNumber: string;
  bookingRef: string;
  duration: string;
};

export type AccommodationBooking = {
  id: string;
  name: string;
  checkInDate: string;
  checkOutDate: string;
  address: string;
  note: string;
};

export type ClinicBooking = {
  id: string;
  clinicName: string;
  date: string;
  time: string;
  address: string;
  note: string;
};

export type BookingData = {
  flights: FlightBooking[];
  accommodation: AccommodationBooking;
  clinic: ClinicBooking;
};

export type PrepCategory =
  | '文件 / 財務'
  | '電子 / 工具'
  | '服飾 / 穿搭'
  | '盥洗 / 個人護理'
  | '醫療 / 健康 / 私人物品'
  | '日用品 / 雜項';

export type PrepChecklistItem = {
  id: string;
  title: string;
  category: PrepCategory;
  note: string;
  completed: boolean;
};

export type PrepData = {
  items: PrepChecklistItem[];
  reminders: string[];
};

export type ShoppingCategory =
  | '零食 / 手信'
  | '美妝 / 護膚'
  | '服飾 / 配件'
  | '生活 / 雜貨'
  | '藥妝 / 健康'
  | '其他';

export type ShoppingItem = {
  id: string;
  title: string;
  category: ShoppingCategory;
  area: string;
  note: string;
  completed: boolean;
};

export type ShoppingData = {
  items: ShoppingItem[];
};

export type SeedData = {
  trip: Trip;
  days: ItineraryDay[];
  activities: Activity[];
  bookings: BookingData;
  prep: PrepData;
  shopping: ShoppingData;
};
