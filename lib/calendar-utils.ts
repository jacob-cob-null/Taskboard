import type { events } from "@prisma/client";
import { CalendarEvent } from "./validations";

// Util: convert Prisma events to CalendarEvent
export function eventToCalendarEvent(event: events): CalendarEvent {
  return {
    id: event.id,
    title: event.title,
    start: event.event_start,
    end: event.event_end,
    googleEventId: event.google_event_id,
  };
}
