import { CalendarEvent } from "@/lib/validations";
// MOCK DATA
export const INITIAL_EVENTS: CalendarEvent[] = [
  // Team Planning
  {
    id: "1",
    title: "Team Planning Day",
    start: new Date(2026, 0, 20),
    end: new Date(2026, 0, 20),
  },
  // Morning standup
  {
    id: "2",
    title: "Daily Standup",
    start: new Date(2026, 0, 23, 9, 0),
    end: new Date(2026, 0, 23, 9, 30),
  },
  // Sprint review
  {
    id: "3",
    title: "Sprint Review",
    start: new Date(2026, 0, 24, 14, 0),
    end: new Date(2026, 0, 24, 15, 30),
  },
  // Team Retreat
  {
    id: "4",
    title: "Team Retreat",
    start: new Date(2026, 0, 27),
    end: new Date(2026, 0, 29),
  },
  // Client Presentation
  {
    id: "5",
    title: "Client Presentation",
    start: new Date(2026, 0, 25, 10, 0),
    end: new Date(2026, 0, 25, 11, 0),
  },
  // Weekly recurring-style events
  {
    id: "6",
    title: "1-on-1 Meeting",
    start: new Date(2026, 0, 22, 15, 0),
    end: new Date(2026, 0, 22, 15, 30),
  },
  {
    id: "7",
    title: "1-on-1 Meeting",
    start: new Date(2026, 0, 29, 15, 0),
    end: new Date(2026, 0, 29, 15, 30),
  },
  // Today's event
  {
    id: "8",
    title: "Code Review Session",
    start: new Date(2026, 0, 23, 13, 0),
    end: new Date(2026, 0, 23, 14, 0),
  },
];
