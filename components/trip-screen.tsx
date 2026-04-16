'use client';

import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useTripStore } from '@/store/use-trip-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function TripScreen() {
  const { days, activities, selectedDayId, selectDay, addQuickNoteActivity, moveActivityUp, moveActivityDown } = useTripStore();
  const selectedDay = days.find((d) => d.id === selectedDayId) ?? days[0];
  const dayActivities = activities
    .filter((a) => a.dayId === selectedDay.id)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Itinerary</h1>
        <p className="text-sm text-slate-500">Single Seoul trip · stable reorder via Up/Down controls</p>
      </header>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {days.map((day) => (
          <Button
            key={day.id}
            onClick={() => selectDay(day.id)}
            className={cn(
              'min-w-max rounded-full border px-4 py-2 text-sm',
              day.id === selectedDay.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'
            )}
          >
            Day {day.dayNumber}
          </Button>
        ))}
      </div>

      <section className="rounded-3xl bg-white p-5 shadow-soft">
        <p className="text-sm text-slate-500">{formatDate(selectedDay.date)} · {selectedDay.district}</p>
        <h2 className="text-lg font-semibold">{selectedDay.title}</h2>
        <p className="text-sm text-slate-600">{selectedDay.weather.condition} · {selectedDay.weather.minC}°/{selectedDay.weather.maxC}°</p>
      </section>

      <ul className="space-y-3">
        {dayActivities.map((activity) => (
          <li key={activity.id} className="rounded-2xl bg-white p-4 shadow-soft">
            <p className="text-xs uppercase tracking-wide text-slate-500">{activity.category}</p>
            <p className="mt-1 font-medium">{activity.time} · {activity.title}</p>
            <p className="text-sm text-slate-600">{activity.place}</p>
            <div className="mt-3 flex gap-2">
              <Button onClick={() => moveActivityUp(activity.id)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs"><ArrowUp className="h-3 w-3" /></Button>
              <Button onClick={() => moveActivityDown(activity.id)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs"><ArrowDown className="h-3 w-3" /></Button>
            </div>
          </li>
        ))}
      </ul>

      <Button onClick={() => addQuickNoteActivity(selectedDay.id)} className="fixed bottom-24 right-6 rounded-full bg-slate-900 p-4 text-white shadow-soft">
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
