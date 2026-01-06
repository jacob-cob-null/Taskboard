"use server";
// 1. Use the singleton instance
import prisma from "@/utils/prisma/prisma";

export async function createTeam(leaderId: string, teamName: string) {
  try {
    const newTeam = await prisma.teams.create({
      data: {
        name: teamName,
        leader_id: leaderId,
      },
    });

    // Return the data so the UI can use it
    return { success: true, team: newTeam };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to create team" };
  }
}
