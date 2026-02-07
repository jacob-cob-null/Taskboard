import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma/prisma";
import { EmailStatus } from "@prisma/client";
import { Webhook } from "svix";

/**
 * Resend webhook handler
 * Receives delivery status updates from Resend
 *
 * Events: email.sent, email.delivered, email.bounced, email.complained
 */
export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RESEND_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 },
      );
    }

    // Get webhook headers for signature verification
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.warn("Missing svix headers");
      return NextResponse.json(
        { error: "Missing webhook headers" },
        { status: 401 },
      );
    }

    // Get raw body for signature verification
    const body = await request.text();

    // Verify webhook signature
    const wh = new Webhook(webhookSecret);
    let payload: any;

    try {
      payload = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse verified payload
    const { type, data } = payload;

    console.log("Received webhook:", type, data);

    // Extract batch ID from the event
    // Note: Resend's webhook structure may vary, adjust as needed
    const batchId = data?.batch_id || data?.id;

    if (!batchId) {
      console.warn("No batch ID in webhook payload");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Find announcement by batch ID
    // Handle both single ID and JSON array of IDs
    const announcements = await prisma.announcements.findMany({
      where: {
        OR: [
          { resend_batch_id: batchId },
          { resend_batch_id: { contains: batchId } },
        ],
      },
    });

    if (announcements.length === 0) {
      console.warn(`No announcement found for batch ID: ${batchId}`);
      // Return 200 to acknowledge webhook (idempotent)
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Process each announcement
    for (const announcement of announcements) {
      await processWebhookEvent(announcement.id, type, data);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Always return 200 to prevent Resend from retrying
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

/**
 * Process individual webhook event
 */
async function processWebhookEvent(
  announcementId: bigint,
  eventType: string,
  eventData: any,
) {
  try {
    const announcement = await prisma.announcements.findUnique({
      where: { id: announcementId },
    });

    if (!announcement) return;

    switch (eventType) {
      case "email.sent":
        // Email accepted by Resend, no action needed
        break;

      case "email.delivered":
        // Increment delivered count
        await prisma.announcements.update({
          where: { id: announcementId },
          data: {
            delivered_count: {
              increment: 1,
            },
          },
        });

        // Check if all emails delivered
        const updated = await prisma.announcements.findUnique({
          where: { id: announcementId },
        });

        if (
          updated &&
          updated.delivered_count >= updated.recipient_count &&
          updated.email_status === EmailStatus.SENDING
        ) {
          await prisma.announcements.update({
            where: { id: announcementId },
            data: {
              email_status: EmailStatus.SENT,
            },
          });
        }
        break;

      case "email.bounced":
      case "email.complained":
        // Handle failures
        const failedEmail = eventData?.email || "unknown";
        const currentErrors = announcement.error_message || "";
        const failedEmails = currentErrors ? JSON.parse(currentErrors) : [];

        if (!failedEmails.includes(failedEmail)) {
          failedEmails.push(failedEmail);
        }

        await prisma.announcements.update({
          where: { id: announcementId },
          data: {
            error_message: JSON.stringify(failedEmails),
            email_status:
              failedEmails.length > 0
                ? EmailStatus.PARTIALLY_FAILED
                : announcement.email_status,
          },
        });
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    console.error("Error processing webhook event:", error);
  }
}
