import { z } from "zod";
import type { announcements } from "@prisma/client";
import { CalendarEvent } from "./validations";

// Util: convert Prisma announcements to CalendarEvent
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
