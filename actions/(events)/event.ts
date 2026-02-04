"use server";
import { getCalendarClient } from "./google";
import { CalendarEventSchema } from "@/lib/validations";
import {
  createCalendarEvent_DB,
  updateCalendarEvent_DB,
  deleteCalendarEvent_DB,
} from "./event_db";
import { getTeamCalendarId } from "../(calendar)/calendar";
import { getUser } from "../auth";
import prisma from "@/utils/prisma/prisma";
import { getMembersForTeam } from "../members";

// TODO: Can be set by user
const DEFAULT_TIMEZONE = "Asia/Manila";

// Creates an event in a team's calendar.
export async function createCalendarEvent(
  teamId: string,
  eventDetails: {
    title: string;
    start: Date;
    end: Date;
    description?: string;
  },
) {
  let leader_id: string;

  // validate and get user id
  try {
    const user = await getUser();
    const idHelper = user.data.user?.id;
    if (!idHelper) {
      throw new Error("User not authenticated");
    }
    leader_id = idHelper;
  } catch (error: any) {
    console.error(`Error creating calendar: ${teamId}`, error?.message);
    return {
      success: false,
      error: error?.message || `Failed to create calendar: ${teamId}`,
    };
  }

  // get calendar id
  const calendarId = await getTeamCalendarId(teamId, leader_id);
  if (!calendarId) {
    return {
      success: false,
      error: "Failed to get calendar id",
    };
  }
  try {
    const { client } = await getCalendarClient();

    // Note: Validation is handled by the caller (Zod schema at form level)

    // Fetch team members to add as attendees
    const membersResult = await getMembersForTeam(teamId);
    const attendees =
      membersResult.success && membersResult.members
        ? membersResult.members.map((m) => ({ email: m.email }))
        : [];

    // Create Event
    const response = await client.events.insert({
      calendarId: calendarId,
      sendUpdates: "none", // Don't send email notifications
      requestBody: {
        summary: eventDetails.title,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.start.toISOString(),
          timeZone: DEFAULT_TIMEZONE,
        },
        end: {
          dateTime: eventDetails.end.toISOString(),
          timeZone: DEFAULT_TIMEZONE,
        },
        attendees: attendees,
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
export async function getTeamEvents(teamId: string) {
  // Get user
  let leader_id: string;
  try {
    const user = await getUser();
    const idHelper = user.data.user?.id;
    if (!idHelper) {
      throw new Error("User not authenticated");
    }
    leader_id = idHelper;
  } catch (error: any) {
    console.error(`Error in getTeamEvents: ${teamId}`, error?.message);
    return {
      success: false,
      error: error?.message || "Authentication failed",
    };
  }

  // Resolve calendarId from teamId
  const calendarId = await getTeamCalendarId(teamId, leader_id);
  if (!calendarId) {
    return {
      success: false,
      error: "Failed to get calendar id",
    };
  }

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
  teamId: string,
  eventData: {
    id: string;
    title?: string;
    start?: Date;
    end?: Date;
    googleEventId?: string | null;
    desc?: string;
  },
) {
  // Extract and validate required fields
  const { id: eventId, title, start, end, googleEventId, desc } = eventData;

  // Map desc to description for DB layer
  const description = desc;

  if (!eventId) {
    return {
      success: false,
      error: "Missing required field: eventId is required for update",
    };
  }
  if (!title || !start || !end) {
    return {
      success: false,
      error:
        "Missing required fields: title, start, and end are required for update",
    };
  }

  const eventDetails = { title, start, end, description };
  let leader_id: string;
  // validate and get user id
  try {
    const user = await getUser();
    const idHelper = user.data.user?.id;
    if (!idHelper) {
      throw new Error("User not authenticated");
    }
    leader_id = idHelper;
  } catch (error: any) {
    console.error(`Error creating calendar: ${teamId}`, error?.message);
    return {
      success: false,
      error: error?.message || `Failed to create calendar: ${teamId}`,
    };
  }

  // get calendar id
  const calendarId = await getTeamCalendarId(teamId, leader_id);
  if (!calendarId) {
    return {
      success: false,
      error: "Failed to get calendar id",
    };
  }

  // Validate googleEventId for Google API call
  if (!googleEventId) {
    return {
      success: false,
      error: "Missing googleEventId: cannot update event in Google Calendar",
    };
  }

  try {
    const { client } = await getCalendarClient();

    // Fetch team members to add as attendees
    const membersResult = await getMembersForTeam(teamId);
    const attendees =
      membersResult.success && membersResult.members
        ? membersResult.members.map((m) => ({ email: m.email }))
        : [];

    const response = await client.events.update({
      calendarId: calendarId,
      eventId: googleEventId,
      sendUpdates: "none", // Don't send email notifications
      requestBody: {
        summary: eventDetails.title,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.start.toISOString(),
          timeZone: DEFAULT_TIMEZONE,
        },
        end: {
          dateTime: eventDetails.end.toISOString(),
          timeZone: DEFAULT_TIMEZONE,
        },
        attendees: attendees,
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
      await updateCalendarEvent_DB(eventId, eventDetails);
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

    return {
      success: true,
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
    };
  } catch (error: any) {
    console.error("Error updating event:", error?.message);
    return {
      success: false,
      error: error?.message || "Failed to update event",
    };
  }
}
export async function deleteCalendarEvent(teamId: string, eventId: string) {
  // Get user
  let leader_id: string;
  try {
    const user = await getUser();
    const idHelper = user.data.user?.id;
    if (!idHelper) {
      throw new Error("User not authenticated");
    }
    leader_id = idHelper;
  } catch (error: any) {
    console.error(`Error in deleteCalendarEvent: ${teamId}`, error?.message);
    return {
      success: false,
      error: error?.message || "Authentication failed",
    };
  }

  // Resolve calendarId from teamId
  const calendarId = await getTeamCalendarId(teamId, leader_id);
  if (!calendarId) {
    return {
      success: false,
      error: "Failed to get calendar id",
    };
  }

  // Fetch event from DB to get googleEventId
  let dbEvent;
  try {
    dbEvent = await prisma.events.findUnique({
      where: { id: eventId },
      select: { google_event_id: true },
    });
  } catch (dbError: any) {
    console.error(
      "Database query failed in deleteCalendarEvent:",
      dbError.message,
    );
    return {
      success: false,
      error: `Database error: ${dbError.message}`,
    };
  }

  if (!dbEvent || !dbEvent.google_event_id) {
    return {
      success: false,
      error: "Event not found or missing Google Event ID",
    };
  }

  try {
    const { client } = await getCalendarClient();
    await client.events.delete({
      calendarId: calendarId,
      eventId: dbEvent.google_event_id,
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

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Error deleting event:", error?.message);
    return {
      success: false,
      error: error?.message || "Failed to delete event",
    };
  }
}
