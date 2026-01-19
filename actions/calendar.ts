"use server";

import { google } from "googleapis";
import { getUser } from "./auth";
import prisma from "@/utils/prisma/prisma";
import { getOAuth2Client } from "@/lib/google-calendar";

// Nullify to break auth loops
async function nullifyToken(userId: string) {
  console.warn(`Nullifying invalid token for user ${userId}`);
  await prisma.profiles.update({
    where: { id: userId },
    data: { google_refresh_token: null },
  });
}

// Gets calendar client, if invalid token (400) nullify and re-auth
async function getCalendarClient() {
  const user = await getUser();
  const userId = user.data.user?.id;

  if (!userId) throw new Error("User not authenticated");

  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
    select: { google_refresh_token: true },
  });

  if (!profile?.google_refresh_token) {
    throw new Error("No Google refresh token found. Please reconnect.");
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: profile.google_refresh_token });

  return {
    client: google.calendar({ version: "v3", auth: oauth2Client }),
    userId,
  };
}

// Checks permission, if error, nullify and re-auth
export async function checkCalendarPermissions() {
  try {
    const { client } = await getCalendarClient();
    await client.calendarList.list({ maxResults: 1 });
    return { hasValidToken: true, needsReauth: false };
  } catch (error: any) {
    console.error("Permission check failed:", error?.message);

    // If any auth error, we need re-auth
    const isAuthError =
      [400, 401, 403].includes(error?.code) ||
      error?.response?.data?.error === "invalid_request";

    if (isAuthError) {
      const user = await getUser();
      const userId = user.data.user?.id;
      if (userId) await nullifyToken(userId);
      return { hasValidToken: false, needsReauth: true };
    }

    return { hasValidToken: false, needsReauth: true };
  }
}

// Creates a new Google Calendar for a team.
export async function createTeamCalendar(teamName: string) {
  try {
    const { client } = await getCalendarClient();

    const response = await client.calendars.insert({
      requestBody: {
        summary: `${teamName} Calendar`,
        description: `Shared calendar for ${teamName} team`,
        timeZone: "Asia/Manila",
      },
    });

    return { success: true, calendarId: response.data.id };
  } catch (error: any) {
    console.error("Error creating calendar:", error?.message);
    return {
      success: false,
      error: error?.message || "Failed to create calendar",
    };
  }
}

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
