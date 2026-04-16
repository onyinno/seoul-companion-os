'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { seoulSeedData } from '@/lib/seed';
import type { Activity, ActivityCategory, ItineraryDay, Trip } from '@/lib/types';

type TripState = {
  trip: Trip;
  days: ItineraryDay[];
  activities: Activity[];
  selectedDayId: string;
  seedData: () => void;
  selectDay: (dayId: string) => void;
  resetToSeed: () => void;
  addActivity: (input: {
    dayId: string;
    category: ActivityCategory;
    time: string;
    place: string;
    note: string;
    cost: number;
  }) => void;
  moveActivityUp: (activityId: string) => void;
  moveActivityDown: (activityId: string) => void;
};

const initialState = {
  trip: seoulSeedData.trip,
  days: seoulSeedData.days,
  activities: seoulSeedData.activities,
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

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      ...initialState,
      seedData: () => set({ ...initialState }),
      selectDay: (dayId) => set({ selectedDayId: dayId }),
      resetToSeed: () => set({ ...initialState }),
      addActivity: ({ dayId, category, time, place, note, cost }) => {
        const dayActivities = get().activities.filter((a) => a.dayId === dayId);
        const nextOrder = dayActivities.length ? Math.max(...dayActivities.map((a) => a.order)) + 1 : 1;
        const nextId = `activity-${dayId}-${Date.now()}`;

        const newActivity: Activity = {
          id: nextId,
          dayId,
          title: `${categoryTitle[category]}：${place}`,
          category,
          time,
          place,
          note,
          cost,
          order: nextOrder
        };

        set({ activities: [...get().activities, newActivity] });
      },
      moveActivityUp: (activityId) => {
        const activities = [...get().activities];
        const target = activities.find((a) => a.id === activityId);
        if (!target) return;
        const siblings = activities
          .filter((a) => a.dayId === target.dayId)
          .sort((a, b) => a.order - b.order);
        const index = siblings.findIndex((a) => a.id === activityId);
        if (index <= 0) return;
        const prev = siblings[index - 1];
        const targetRef = activities.find((a) => a.id === target.id);
        const prevRef = activities.find((a) => a.id === prev.id);
        if (!targetRef || !prevRef) return;
        const temp = targetRef.order;
        targetRef.order = prevRef.order;
        prevRef.order = temp;
        set({ activities });
      },
      moveActivityDown: (activityId) => {
        const activities = [...get().activities];
        const target = activities.find((a) => a.id === activityId);
        if (!target) return;
        const siblings = activities
          .filter((a) => a.dayId === target.dayId)
          .sort((a, b) => a.order - b.order);
        const index = siblings.findIndex((a) => a.id === activityId);
        if (index === -1 || index >= siblings.length - 1) return;
        const next = siblings[index + 1];
        const targetRef = activities.find((a) => a.id === target.id);
        const nextRef = activities.find((a) => a.id === next.id);
        if (!targetRef || !nextRef) return;
        const temp = targetRef.order;
        targetRef.order = nextRef.order;
        nextRef.order = temp;
        set({ activities });
      }
    }),
    {
      name: 'seoul-companion-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
