import { useState, useCallback } from "react";
import { CalendarEvent } from "@/lib/calendar-utils";

export function useCalendarActions(initialEvents: CalendarEvent[]) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const addEvent = useCallback((eventData: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(), // Simple ID generation
    };
    setEvents((prev) => [...prev, newEvent]);
  }, []);

  return {
    events,
    addEvent,
    setEvents,
  };
}
