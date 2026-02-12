"use server";

import prisma from "@/utils/prisma/prisma";
import { getUser } from "../auth";
import { sendAnnouncementEmail } from "./resend";
import { EmailStatus } from "@prisma/client";

const RATE_LIMIT_HOURS = 1;
const MAX_ANNOUNCEMENTS_PER_HOUR = 10;

interface SendAnnouncementResult {
  success: boolean;
  error?: string;
  batchIds?: string[];
}

/**
 * Send announcement email to all team members
 * Implements idempotency, rate limiting, and batch splitting
 */
export async function sendAnnouncement(
  announcementId: bigint,
): Promise<SendAnnouncementResult> {
  try {
    // Get authenticated user
    const user = await getUser();
    const leaderId = user.data.user?.id;

    if (!user || !leaderId) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch announcement with team
    const announcement = await prisma.announcements.findUnique({
      where: { id: announcementId },
      include: {
        team: {
          include: {
            teamMembers: {
              include: {
                members: true,
              },
            },
          },
        },
      },
    });

    if (!announcement) {
      return { success: false, error: "Announcement not found" };
    }

    // Verify user is team leader
    if (announcement.team.leader_id !== leaderId) {
      return { success: false, error: "Unauthorized: Not team leader" };
    }

    // IDEMPOTENCY CHECK
    if (announcement.email_status !== EmailStatus.PENDING) {
      return {
        success: false,
        error: `Announcement already ${(announcement.email_status ?? "processed").toLowerCase()}`,
      };
    }

    // RATE LIMITING
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000);
    const recentAnnouncements = await prisma.announcements.count({
      where: {
        team_id: announcement.team_id,
        sent_at: {
          gte: oneHourAgo,
        },
        email_status: {
          in: [EmailStatus.SENT, EmailStatus.PARTIALLY_FAILED],
        },
      },
    });

    if (recentAnnouncements >= MAX_ANNOUNCEMENTS_PER_HOUR) {
      return {
        success: false,
        error: `Rate limit exceeded. Maximum ${MAX_ANNOUNCEMENTS_PER_HOUR} announcements per hour.`,
      };
    }

    // Fetch team members
    const recipients = announcement.team.teamMembers.map((tm) => ({
      email: tm.members.email,
      name: tm.members.full_name || undefined,
    }));

    if (recipients.length === 0) {
      return { success: false, error: "No team members to send to" };
    }

    // Update status to SENDING
    await prisma.announcements.update({
      where: { id: announcementId },
      data: {
        email_status: EmailStatus.SENDING,
        recipient_count: recipients.length,
      },
    });

    try {
      // Send emails via Resend
      const result = await sendAnnouncementEmail({
        recipients,
        title: announcement.title,
        content: announcement.content,
        teamName: announcement.team.name,
      });

      // Store batch IDs (as JSON array if multiple batches)
      const batchIdString =
        result.batchIds.length === 1
          ? result.batchIds[0]
          : JSON.stringify(result.batchIds);

      // Update to SENT status
      await prisma.announcements.update({
        where: { id: announcementId },
        data: {
          email_status: EmailStatus.SENT,
          resend_batch_id: batchIdString,
          sent_at: new Date(),
        },
      });

      return {
        success: true,
        batchIds: result.batchIds,
      };
    } catch (sendError) {
      // Rollback to FAILED status
      await prisma.announcements.update({
        where: { id: announcementId },
        data: {
          email_status: EmailStatus.FAILED,
          error_message:
            sendError instanceof Error
              ? sendError.message
              : "Unknown error sending emails",
        },
      });

      return {
        success: false,
        error:
          sendError instanceof Error
            ? sendError.message
            : "Failed to send emails",
      };
    }
  } catch (error) {
    console.error("Error in sendAnnouncement:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

/**
 * Get announcement with email status
 */
export async function getAnnouncementStatus(announcementId: bigint) {
  try {
    const user = await getUser();
    const leaderId = user.data.user?.id;

    if (!user || !leaderId) {
      return { success: false, error: "Unauthorized" };
    }

    const announcement = await prisma.announcements.findUnique({
      where: { id: announcementId },
      include: {
        team: true,
      },
    });

    if (!announcement) {
      return { success: false, error: "Announcement not found" };
    }

    if (announcement.team.leader_id !== leaderId) {
      return { success: false, error: "Unauthorized" };
    }

    return {
      success: true,
      status: announcement.email_status,
      sentAt: announcement.sent_at,
      recipientCount: announcement.recipient_count,
      deliveredCount: announcement.delivered_count,
      errorMessage: announcement.error_message,
    };
  } catch (error) {
    console.error("Error fetching announcement status:", error);
    return { success: false, error: "Failed to fetch status" };
  }
}
