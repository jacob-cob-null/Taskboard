"use server";

import { getUser } from "../auth";
import prisma from "@/utils/prisma/prisma";
import { getCalendarClient } from "../(events)/google";

// Get calendar id
export async function getTeamCalendarId(
  teamId: string,
  leader_id: string,
): Promise<string | null> {
  const team = await prisma.teams.findFirst({
    where: {
      id: teamId,
      leader_id: leader_id,
    },
    select: {
      google_calendar_id: true,
    },
  });
  return team?.google_calendar_id ?? null;
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
    console.error(`Error creating calendar: ${teamName}`, error?.message);
    return {
      success: false,
      error: error?.message || `Failed to create calendar: ${teamName}`,
    };
  }
}
// update calendar
export async function updateTeamCalendar(teamId: string, teamName: string) {
  const user = await getUser();
  const userId = user.data.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  // retrieve calendar id
  const calendarId = await getTeamCalendarId(teamId, userId);

  if (!calendarId) {
    return {
      success: false,
      error: "Calendar not found",
    };
  }

  try {
    const { client } = await getCalendarClient();
    const response = await client.calendars.update({
      calendarId: calendarId,
      requestBody: {
        summary: `${teamName} Calendar`,
        description: `Shared calendar for ${teamName} team`,
        timeZone: "Asia/Manila",
      },
    });

    return { success: true, calendarId: response.data.id };
  } catch (error: any) {
    console.error(`Error updating calendar: ${calendarId}`, error?.message);
    return {
      success: false,
      error: error?.message || `Failed to update calendar: ${calendarId}`,
    };
  }
}
// delete calendar
export async function deleteTeamCalendar(teamId: string) {
  const user = await getUser();
  const userId = user.data.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  // retrieve calendar id
  const calendarId = await getTeamCalendarId(teamId, userId);

  if (!calendarId) {
    return {
      success: false,
      error: "Calendar not found",
    };
  }
  try {
    const { client } = await getCalendarClient();
    const response = await client.calendars.delete({
      calendarId: calendarId,
    });

    return { success: true, response: response.data };
  } catch (error: any) {
    console.error(`Error deleting calendar: ${calendarId}`, error?.message);
    return {
      success: false,
      error: error?.message || `Failed to delete calendar: ${calendarId}`,
    };
  }
}
