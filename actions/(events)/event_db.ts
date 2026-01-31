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
  calendarId: string,
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
      google_event_id: eventId,
    },
    data: {
      title: eventDetails.title,
      description: eventDetails.description,
      event_start: eventDetails.start,
      event_end: eventDetails.end,
    },
  });
}

// Delete event PRISMA
export async function deleteCalendarEvent_DB(event_id: string) {
  await prisma.events.delete({
    where: {
      google_event_id: event_id,
    },
  });
}

export default {
  createCalendarEvent_DB,
  updateCalendarEvent_DB,
  deleteCalendarEvent_DB,
};
