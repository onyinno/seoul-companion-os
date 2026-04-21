'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { seoulSeedData } from '@/lib/seed';
import type {
  Activity,
  ActivityCategory,
  AppSettings,
  BookingData,
  FontSizeLevel,
  ItineraryDay,
  PrepCategory,
  PrepChecklistItem,
  ShoppingAreaTag,
  ShoppingCategory,
  ShoppingItem,
  ThemeColor,
  Trip,
  VisualPreference
} from '@/lib/types';

type ActivityInput = {
  dayId: string;
  category: ActivityCategory;
  time: string;
  place: string;
  address?: string;
  googleMapsUrl?: string;
  note: string;
  cost: number;
};

type PrepInput = {
  title: string;
  category: PrepCategory;
  note: string;
};

type ShoppingInput = {
  title: string;
  category: ShoppingCategory;
  area: string;
  areaTag?: ShoppingAreaTag;
  storeName?: string;
  address?: string;
  googleMapsUrl?: string;
  note: string;
  estimatedCost: number;
  actualCost: number;
};

type TripState = {
  trip: Trip;
  days: ItineraryDay[];
  activities: Activity[];
  bookings: BookingData;
  prepItems: PrepChecklistItem[];
  prepReminders: string[];
  shoppingItems: ShoppingItem[];
  settings: AppSettings;
  selectedDayId: string;
  seedData: () => void;
  selectDay: (dayId: string) => void;
  resetToSeed: () => void;
  setTotalBudget: (totalBudget: number) => void;
  addActivity: (input: ActivityInput) => void;
  updateActivity: (activityId: string, input: ActivityInput) => void;
  deleteActivity: (activityId: string) => void;
  moveActivityUp: (activityId: string) => void;
  moveActivityDown: (activityId: string) => void;
  togglePrepItem: (itemId: string) => void;
  addPrepItem: (input: PrepInput) => void;
  removePrepItem: (itemId: string) => void;
  toggleShoppingItem: (itemId: string) => void;
  addShoppingItem: (input: ShoppingInput) => void;
  updateShoppingItem: (itemId: string, input: ShoppingInput) => void;
  removeShoppingItem: (itemId: string) => void;
  setThemeColor: (themeColor: ThemeColor) => void;
  setFontSizeLevel: (fontSizeLevel: FontSizeLevel) => void;
  setDarkMode: (darkMode: boolean) => void;
  setVisualPreference: (visualPreference: VisualPreference) => void;
};

const initialState = {
  trip: seoulSeedData.trip,
  days: seoulSeedData.days,
  activities: seoulSeedData.activities,
  bookings: seoulSeedData.bookings,
  prepItems: seoulSeedData.prep.items,
  prepReminders: seoulSeedData.prep.reminders,
  shoppingItems: seoulSeedData.shopping.items,
  settings: {
    themeColor: 'seoul' as ThemeColor,
    fontSizeLevel: 'md' as FontSizeLevel,
    darkMode: false,
    visualPreference: 'simple' as VisualPreference
  },
  selectedDayId: seoulSeedData.days[0].id
};

const categoryTitle: Record<ActivityCategory, string> = {
  food: '美食',
  cafe: '咖啡店',
  sightseeing: '觀光',
  shopping: '購物',
  transport: '交通',
  hotel: '住宿',
  other: '其他'
};

const timeToMinutes = (value: string) => {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
};

const sortDayActivitiesByTime = (activities: Activity[], dayId: string) => {
  const target = activities
    .filter((activity) => activity.dayId === dayId)
    .sort((a, b) => {
      const timeDiff = timeToMinutes(a.time) - timeToMinutes(b.time);
      if (timeDiff !== 0) return timeDiff;
      return a.order - b.order;
    })
    .map((activity, index) => ({ ...activity, order: index + 1 }));

  const otherDays = activities.filter((activity) => activity.dayId !== dayId);
  return [...otherDays, ...target];
};

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      ...initialState,
      seedData: () => set({ ...initialState }),
      selectDay: (dayId) => set({ selectedDayId: dayId }),
      resetToSeed: () => set({ ...initialState }),
      setTotalBudget: (totalBudget) => {
        const nextBudget = Number.isFinite(totalBudget) ? Math.max(0, Math.round(totalBudget)) : get().trip.totalBudget;
        set((state) => ({ trip: { ...state.trip, totalBudget: nextBudget } }));
      },
      addActivity: ({ dayId, category, time, place, address, googleMapsUrl, note, cost }) => {
        const dayActivities = get().activities.filter((activity) => activity.dayId === dayId);
        const nextId = `activity-${dayId}-${Date.now()}`;

        const newActivity: Activity = {
          id: nextId,
          dayId,
          title: `${categoryTitle[category]}：${place}`,
          category,
          time,
          place,
          address: address?.trim() ?? '',
          googleMapsUrl: googleMapsUrl?.trim() ?? '',
          note,
          cost,
          order: dayActivities.length + 1
        };

        const nextActivities = sortDayActivitiesByTime([...get().activities, newActivity], dayId);
        set({ activities: nextActivities });
      },
      updateActivity: (activityId, { dayId, category, time, place, address, googleMapsUrl, note, cost }) => {
        const current = get().activities.find((activity) => activity.id === activityId);
        if (!current) return;

        const nextActivities = get().activities.map((activity) => {
          if (activity.id !== activityId) return activity;
          return {
            ...activity,
            dayId,
            category,
            time,
            place,
            address: address?.trim() ?? '',
            googleMapsUrl: googleMapsUrl?.trim() ?? '',
            note,
            cost,
            title: `${categoryTitle[category]}：${place}`
          };
        });

        const sortedCurrentDay = sortDayActivitiesByTime(nextActivities, current.dayId);
        const sortedTargetDay = sortDayActivitiesByTime(sortedCurrentDay, dayId);
        set({ activities: sortedTargetDay });
      },
      deleteActivity: (activityId) => {
        const target = get().activities.find((activity) => activity.id === activityId);
        if (!target) return;

        const filtered = get().activities.filter((activity) => activity.id !== activityId);
        const nextActivities = sortDayActivitiesByTime(filtered, target.dayId);
        set({ activities: nextActivities });
      },
      moveActivityUp: (activityId) => {
        const activities = [...get().activities];
        const target = activities.find((activity) => activity.id === activityId);
        if (!target) return;
        const siblings = activities
          .filter((activity) => activity.dayId === target.dayId)
          .sort((a, b) => a.order - b.order);
        const index = siblings.findIndex((activity) => activity.id === activityId);
        if (index <= 0) return;
        const prev = siblings[index - 1];
        const targetRef = activities.find((activity) => activity.id === target.id);
        const prevRef = activities.find((activity) => activity.id === prev.id);
        if (!targetRef || !prevRef) return;
        const temp = targetRef.order;
        targetRef.order = prevRef.order;
        prevRef.order = temp;
        set({ activities });
      },
      moveActivityDown: (activityId) => {
        const activities = [...get().activities];
        const target = activities.find((activity) => activity.id === activityId);
        if (!target) return;
        const siblings = activities
          .filter((activity) => activity.dayId === target.dayId)
          .sort((a, b) => a.order - b.order);
        const index = siblings.findIndex((activity) => activity.id === activityId);
        if (index === -1 || index >= siblings.length - 1) return;
        const next = siblings[index + 1];
        const targetRef = activities.find((activity) => activity.id === target.id);
        const nextRef = activities.find((activity) => activity.id === next.id);
        if (!targetRef || !nextRef) return;
        const temp = targetRef.order;
        targetRef.order = nextRef.order;
        nextRef.order = temp;
        set({ activities });
      },
      togglePrepItem: (itemId) => {
        const prepItems = get().prepItems.map((item) => {
          if (item.id !== itemId) return item;
          return { ...item, completed: !item.completed };
        });
        set({ prepItems });
      },
      addPrepItem: ({ title, category, note }) => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;
        const trimmedNote = note.trim();
        const prepItems = [
          ...get().prepItems,
          {
            id: `prep-custom-${Date.now()}`,
            title: trimmedTitle,
            category,
            note: trimmedNote,
            completed: false
          }
        ];
        set({ prepItems });
      },
      removePrepItem: (itemId) => {
        const prepItems = get().prepItems.filter((item) => item.id !== itemId);
        set({ prepItems });
      },
      toggleShoppingItem: (itemId) => {
        const shoppingItems = get().shoppingItems.map((item) => {
          if (item.id !== itemId) return item;
          return { ...item, completed: !item.completed };
        });
        set({ shoppingItems });
      },
      addShoppingItem: ({ title, category, area, areaTag, storeName, address, googleMapsUrl, note, estimatedCost, actualCost }) => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;
        const trimmedNote = note.trim();
        const trimmedArea = area.trim();
        const shoppingItems = [
          ...get().shoppingItems,
          {
            id: `shopping-custom-${Date.now()}`,
            title: trimmedTitle,
            category,
            area: trimmedArea,
            areaTag,
            storeName: storeName?.trim() ?? '',
            address: address?.trim() ?? '',
            googleMapsUrl: googleMapsUrl?.trim() ?? '',
            note: trimmedNote,
            estimatedCost: Math.max(0, Math.round(estimatedCost || 0)),
            actualCost: Math.max(0, Math.round(actualCost || 0)),
            completed: false
          }
        ];
        set({ shoppingItems });
      },
      updateShoppingItem: (itemId, { title, category, area, areaTag, storeName, address, googleMapsUrl, note, estimatedCost, actualCost }) => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;
        const trimmedNote = note.trim();
        const trimmedArea = area.trim();
        const shoppingItems = get().shoppingItems.map((item) => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            title: trimmedTitle,
            category,
            area: trimmedArea,
            areaTag,
            storeName: storeName?.trim() ?? '',
            address: address?.trim() ?? '',
            googleMapsUrl: googleMapsUrl?.trim() ?? '',
            note: trimmedNote,
            estimatedCost: Math.max(0, Math.round(estimatedCost || 0)),
            actualCost: Math.max(0, Math.round(actualCost || 0))
          };
        });
        set({ shoppingItems });
      },
      removeShoppingItem: (itemId) => {
        const shoppingItems = get().shoppingItems.filter((item) => item.id !== itemId);
        set({ shoppingItems });
      },
      setThemeColor: (themeColor) => {
        set((state) => ({ settings: { ...state.settings, themeColor } }));
      },
      setFontSizeLevel: (fontSizeLevel) => {
        set((state) => ({ settings: { ...state.settings, fontSizeLevel } }));
      },
      setDarkMode: (darkMode) => {
        set((state) => ({ settings: { ...state.settings, darkMode } }));
      },
      setVisualPreference: (visualPreference) => {
        set((state) => ({ settings: { ...state.settings, visualPreference } }));
      }
    }),
    {
      name: 'seoul-companion-v1',
      version: 7,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
