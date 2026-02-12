"use server";

import prisma from "@/utils/prisma/prisma";
import { getUser } from "../auth";
import { EmailStatus } from "@prisma/client";

/**
 * Create a new announcement (in PENDING status)
 */
export async function createAnnouncement(
  teamId: string,
  title: string,
  content: string,
) {
  try {
    const user = await getUser();
    const leaderId = user.data.user?.id;

    if (!user || !leaderId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify team ownership
    const team = await prisma.teams.findFirst({
      where: {
        id: teamId,
        leader_id: leaderId,
      },
    });

    if (!team) {
      return { success: false, error: "Unauthorized: Not team leader" };
    }

    // Validate inputs
    if (!title || title.trim().length === 0) {
      return { success: false, error: "Title is required" };
    }

    if (!content || content.trim().length === 0) {
      return { success: false, error: "Content is required" };
    }

    if (title.length > 200) {
      return { success: false, error: "Title must be 200 characters or less" };
    }

    if (content.length > 2000) {
      return {
        success: false,
        error: "Content must be 2000 characters or less",
      };
    }

    // Create announcement
    const announcement = await prisma.announcements.create({
      data: {
        team_id: teamId,
        title: title.trim(),
        content: content.trim(),
        email_status: EmailStatus.PENDING,
      },
    });

    return { success: true, announcement };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return { success: false, error: "Failed to create announcement" };
  }
}

/**
 * Get all announcements for a team
 */
export async function getAnnouncementsForTeam(teamId: string) {
  try {
    const user = await getUser();
    const leaderId = user.data.user?.id;

    if (!user || !leaderId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify team ownership
    const team = await prisma.teams.findFirst({
      where: {
        id: teamId,
        leader_id: leaderId,
      },
    });

    if (!team) {
      return { success: false, error: "Unauthorized: Not team leader" };
    }

    const announcements = await prisma.announcements.findMany({
      where: { team_id: teamId },
      orderBy: { created_at: "desc" },
    });

    return { success: true, announcements };
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return { success: false, error: "Failed to fetch announcements" };
  }
}

/**
 * Delete an announcement (only if PENDING or FAILED)
 */
export async function deleteAnnouncement(announcementId: bigint) {
  try {
    const user = await getUser();
    const leaderId = user.data.user?.id;

    if (!user || !leaderId) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch announcement with team
    const announcement = await prisma.announcements.findUnique({
      where: { id: announcementId },
      include: { teams: true },
    });

    if (!announcement) {
      return { success: false, error: "Announcement not found" };
    }

    // Verify team ownership
    if (announcement.teams.leader_id !== leaderId) {
      return { success: false, error: "Unauthorized: Not team leader" };
    }

    // Only allow deletion of PENDING or FAILED announcements
    if (
      announcement.email_status !== EmailStatus.PENDING &&
      announcement.email_status !== EmailStatus.FAILED
    ) {
      return {
        success: false,
        error: "Cannot delete sent or sending announcements",
      };
    }

    await prisma.announcements.delete({
      where: { id: announcementId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return { success: false, error: "Failed to delete announcement" };
  }
}
