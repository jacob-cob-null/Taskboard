"use server";
import { getCalendarClient } from "./google";
import { CalendarEventSchema } from "@/lib/validations";
import {
  createCalendarEvent_DB,
  updateCalendarEvent_DB,
  deleteCalendarEvent_DB,
} from "./event_db";

// Creates an event in a team's calendar.
export async function createCalendarEvent(
  calendarId: string,
  teamId: string,
  eventDetails: {
    title: string;
    start: Date;
    end: Date;
    description?: string;
  },
) {
  try {
    const { client } = await getCalendarClient();

    // Validate
    const result = CalendarEventSchema.safeParse(eventDetails);
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }
    try {
    } catch (error: any) {
      console.error("Error creating event:", error?.message);
      return {
        success: false,
        error: error?.message || "Failed to create event",
      };
    }
    // Create Event
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

    const calendarEventId = response.data.id;

    // Check if event was created before db update
    if (!calendarEventId) {
      return {
        success: false,
        error: "Failed to create event",
      };
    }

    // save to database
    try {
      await createCalendarEvent_DB(
        calendarId,
        teamId,
        eventDetails,
        calendarEventId,
      );
    } catch (dbError: any) {
      console.error("DB Error. Rolling back Google Event...", dbError.message);

      // Delete event from google calendar
      try {
        await client.events.delete({
          calendarId: calendarId,
          eventId: calendarEventId,
        });
        console.log("✅ Rollback successful: Google Event deleted.");
      } catch (rollbackError) {
        // Rollback error
        console.error("System data is inconsistent.", rollbackError);
        // TODO: Send alert to admin / deadlock queue
      }

      throw new Error(`System Error: Failed to save event. ${dbError.message}`);
    }

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
// Get team events (google)
export async function getTeamEvents(calendarId: string) {
  try {
    const { client } = await getCalendarClient();
    const response = await client.events.list({
      calendarId: calendarId,
    });
    return {
      success: true,
      events: response.data.items,
    };
  } catch (error: any) {
    console.error("Error getting events:", error?.message);
    return {
      success: false,
      error: error?.message || "Failed to get events",
    };
  }
}
export async function updateCalendarEvent(
  calendarId: string,
  eventId: string,
  eventDetails: {
    title: string;
    start: Date;
    end: Date;
    description?: string;
  },
) {
  try {
    const { client } = await getCalendarClient();
    const response = await client.events.update({
      calendarId: calendarId,
      eventId: eventId,
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
    // Check if event was updated before db update
    if (!response.data.id) {
      return {
        success: false,
        error: "Failed to update event",
      };
    }
    // Save changes to DB
    try {
      await updateCalendarEvent_DB(calendarId, eventId, eventDetails);
    } catch (dbError: any) {
      console.error(
        "❌ DB Consistency Failure during Update. Google Event updated, but DB failed.",
        dbError.message,
      );
      // NOTE: Rolling back an update is complex (needs old data).
      // For now, we log the inconsistency.
      throw new Error(
        `System Error: Failed to update event in DB. ${dbError.message}`,
      );
    }
  } catch (error: any) {
    console.error("Error updating event:", error?.message);
    return {
      success: false,
      error: error?.message || "Failed to update event",
    };
  }
}
export async function deleteCalendarEvent(calendarId: string, eventId: string) {
  try {
    const { client } = await getCalendarClient();
    await client.events.delete({
      calendarId: calendarId,
      eventId: eventId,
    });
    try {
      await deleteCalendarEvent_DB(eventId);
    } catch (dbError: any) {
      console.error(
        "❌ DB Consistency Failure during Delete. Google Event deleted, but DB failed (Zombie Data).",
        dbError.message,
      );
      // NOTE: Rolling back a delete means RE-CREATING the event (new ID).
      // For now, we log the inconsistency.
      throw new Error(
        `System Error: Failed to delete event in DB. ${dbError.message}`,
      );
    }
  } catch (error: any) {
    console.error("Error deleting event:", error?.message);
    return {
      success: false,
      error: error?.message || "Failed to delete event",
    };
  }
}
