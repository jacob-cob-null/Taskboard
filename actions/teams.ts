"use server";
//singleton instance
import prisma from "@/utils/prisma/prisma";
import { getUser } from "./auth";
import { revalidatePath } from "next/cache";
import { Team } from "@/lib/validations";
import { createTeamCalendar } from "./calendar";

// TODO::: make get user function reusable

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

// Get list of teams
export async function getTeams() {
  const user = await getUser();
  const leaderId = user.data.user?.id;

  if (!user || !leaderId) {
    throw new Error("Unauthorized Action");
  }
  const teams = await prisma.teams.findMany({
    where: {
      leader_id: leaderId,
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: { teamMembers: true },
      },
    },
  });

  // Transform to match Team type with memberCount
  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    memberCount: team._count.teamMembers,
  }));
}

// Delete teams
export async function deleteTeam(teamId: string) {
  const user = await getUser();
  const leaderId = user.data.user?.id;

  if (!user || !leaderId) {
    throw new Error("Unauthorized Action");
  }

  try {
    await prisma.teams.delete({
      where: {
        id: teamId,
      },
    });
    revalidatePath("/dashboard/[userId]");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to delete team" };
  }
}
// Update teams
export async function updateTeam(teamId: string, teamName: string) {
  const user = await getUser();
  const leaderId = user.data.user?.id;

  if (!user || !leaderId) {
    throw new Error("Unauthorized Action");
  }

  try {
    await prisma.teams.update({
      where: {
        id: teamId,
      },
      data: {
        name: teamName,
      },
    });
    revalidatePath("/dashboard/[userId]");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to update team" };
  }
}
