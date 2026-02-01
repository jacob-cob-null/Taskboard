"use server";
import prisma from "@/utils/prisma/prisma";

// Create event PRISMA
export async function createCalendarEvent_DB(
  calendarId: string,
  teamId: string,
  eventDetails: { title: string; start: Date; end: Date; description?: string },
  calendarEventId: string,
) {
  // save to database
  await prisma.events.create({
    data: {
      google_event_id: calendarEventId,
      title: eventDetails.title,
      team_id: teamId,
      description: eventDetails.description,
      event_start: eventDetails.start,
      event_end: eventDetails.end,
    },
  });
}

// Update event PRISMA
export async function updateCalendarEvent_DB(
  eventId: string,
  eventDetails: {
    title: string;
    start: Date;
    end: Date;
    description?: string;
  },
) {
  await prisma.events.update({
    where: {
      id: eventId,
    },
    data: {
      title: eventDetails.title,
      description: eventDetails.description,
      event_start: eventDetails.start,
      event_end: eventDetails.end,
    },
  });
}

// Get team events PRISMA
export async function getTeamEvents_DB(teamId: string) {
  const events = await prisma.events.findMany({
    where: {
      team_id: teamId,
    },
    select: {
      id: true,
      google_event_id: true,
      title: true,
      description: true,
      event_start: true,
      event_end: true,
    },
  });

  // Map DB columns to CalendarEvent shape
  return events.map((event) => ({
    id: event.id,
    googleEventId: event.google_event_id,
    title: event.title,
    desc: event.description ?? undefined,
    start: event.event_start,
    end: event.event_end,
  }));
}

// Delete event PRISMA
export async function deleteCalendarEvent_DB(event_id: string) {
  await prisma.events.delete({
    where: {
      id: event_id,
    },
  });
}

// No default export allowed in "use server" files.
// Use named exports for server actions.
