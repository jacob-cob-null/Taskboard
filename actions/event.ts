"use server";
import { getCalendarClient } from "./calendar";

// Creates an event in a team's calendar.
export async function createCalendarEvent(
  calendarId: string,
  eventDetails: {
    title: string;
    start: Date;
    end: Date;
    description?: string;
  },
) {
  try {
    const { client } = await getCalendarClient();

    const response = await client.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: eventDetails.title,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.start.toISOString(),
          timeZone: "Asia/Manila",
        },
        end: {
          dateTime: eventDetails.end.toISOString(),
          timeZone: "Asia/Manila",
        },
      },
    });

    return {
      success: true,
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
    };
  } catch (error: any) {
    console.error("Error creating event:", error?.message);
    return {
      success: false,
      error: error?.message || "Failed to create event",
    };
  }
}
export async function getTeamEvents(teamId: string) {}
export async function createEvent() {}
export async function updateEvent() {}
export async function deleteEvent() {}
