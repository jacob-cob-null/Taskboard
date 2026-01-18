"use server";
//singleton instance
import prisma from "@/utils/prisma/prisma";
import { getUser } from "./auth";
import { revalidatePath } from "next/cache";
export async function createTeam(teamName: string) {
  const user = await getUser();
  const leaderId = user.data.user?.id;

  if (!user || !leaderId) {
    throw new Error("Unauthorized Action");
  }

  try {
    const newTeam = await prisma.teams.create({
      data: {
        name: teamName,
        leader_id: leaderId,
      },
    });

    revalidatePath("/dashboard/[userId]");
    return { success: true, team: newTeam };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to create team" };
  }
}
