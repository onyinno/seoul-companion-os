'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { seoulSeedData } from '@/lib/seed';
import type { Activity, ActivityCategory, ItineraryDay, Trip } from '@/lib/types';

type ActivityInput = {
  dayId: string;
  category: ActivityCategory;
  time: string;
  place: string;
  note: string;
  cost: number;
};

type TripState = {
  trip: Trip;
  days: ItineraryDay[];
  activities: Activity[];
  selectedDayId: string;
  seedData: () => void;
  selectDay: (dayId: string) => void;
  resetToSeed: () => void;
  addActivity: (input: ActivityInput) => void;
  updateActivity: (activityId: string, input: ActivityInput) => void;
  deleteActivity: (activityId: string) => void;
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
      addActivity: ({ dayId, category, time, place, note, cost }) => {
        const dayActivities = get().activities.filter((activity) => activity.dayId === dayId);
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
          order: dayActivities.length + 1
        };

        const nextActivities = sortDayActivitiesByTime([...get().activities, newActivity], dayId);
        set({ activities: nextActivities });
      },
      updateActivity: (activityId, { dayId, category, time, place, note, cost }) => {
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
      }
    }),
    {
      name: 'seoul-companion-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
