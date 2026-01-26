import { CalendarEvent } from "@/lib/calendar-utils";

export const INITIAL_EVENTS: CalendarEvent[] = [
  // All-day event - Team Planning
  {
    id: "1",
    title: "Team Planning Day",
    start: new Date(2026, 0, 20), // January 20, 2026
    end: new Date(2026, 0, 20),
    allDay: true,
  },
  // Timed event - Morning standup
  {
    id: "2",
    title: "Daily Standup",
    start: new Date(2026, 0, 23, 9, 0), // January 23, 9:00 AM
    end: new Date(2026, 0, 23, 9, 30), // January 23, 9:30 AM
  },
  // Timed event - Sprint review
  {
    id: "3",
    title: "Sprint Review",
    start: new Date(2026, 0, 24, 14, 0), // January 24, 2:00 PM
    end: new Date(2026, 0, 24, 15, 30), // January 24, 3:30 PM
  },
  // Multi-day event
  {
    id: "4",
    title: "Team Retreat",
    start: new Date(2026, 0, 27), // January 27
    end: new Date(2026, 0, 29), // January 29
    allDay: true,
  },
  // Another timed event
  {
    id: "5",
    title: "Client Presentation",
    start: new Date(2026, 0, 25, 10, 0), // January 25, 10:00 AM
    end: new Date(2026, 0, 25, 11, 0), // January 25, 11:00 AM
  },
  // Weekly recurring-style event (mock)
  {
    id: "6",
    title: "1-on-1 Meeting",
    start: new Date(2026, 0, 22, 15, 0), // January 22, 3:00 PM
    end: new Date(2026, 0, 22, 15, 30), // January 22, 3:30 PM
  },
  {
    id: "7",
    title: "1-on-1 Meeting",
    start: new Date(2026, 0, 29, 15, 0), // January 29, 3:00 PM
    end: new Date(2026, 0, 29, 15, 30), // January 29, 3:30 PM
  },
  // Today's event
  {
    id: "8",
    title: "Code Review Session",
    start: new Date(2026, 0, 23, 13, 0), // Today, 1:00 PM
    end: new Date(2026, 0, 23, 14, 0), // Today, 2:00 PM
  },
];
