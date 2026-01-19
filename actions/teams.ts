"use server";
//singleton instance
import prisma from "@/utils/prisma/prisma";
import { getUser } from "./auth";
import { revalidatePath } from "next/cache";
import { Team } from "@/lib/validations";
import { createTeamCalendar } from "./calendar";

export async function createTeam(teamName: string) {
  // Get user id
  const user = await getUser();
  const leaderId = user.data.user?.id;

  if (!user || !leaderId) {
    throw new Error("Unauthorized Action");
  }

  // Validate team inputs
  const result = Team.safeParse({ name: teamName, leader_id: leaderId });
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    // Create Google Calendar for the team
    const calendarResult = await createTeamCalendar(teamName);

    // Create the team in database, calendar id is optional
    const newTeam = await prisma.teams.create({
      data: {
        name: teamName,
        leader_id: leaderId,
        google_calendar_id: calendarResult.success
          ? calendarResult.calendarId
          : null,
      },
    });

    if (!calendarResult.success) {
      console.warn(
        `Team created but calendar creation failed: ${calendarResult.error}`,
      );
    }

    revalidatePath("/dashboard/[userId]");
    return {
      success: true,
      team: newTeam,
      calendarCreated: calendarResult.success,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to create team" };
  }
}
