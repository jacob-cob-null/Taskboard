import type { announcements } from "@prisma/client";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  googleEventId?: string | null;
}

// Util, prisma to big calendar

export function announcementToCalendarEvent(
  announcement: announcements,
): CalendarEvent {
  return {
    id: announcement.id,
    title: announcement.title,
    start: announcement.event_start,
    end: announcement.event_end,
    googleEventId: announcement.google_event_id,
  };
}
