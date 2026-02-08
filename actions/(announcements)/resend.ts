import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import { AnnouncementEmail } from "@/components/email/announcement";
import React from "react";

interface SendEmailParams {
  recipients: Array<{ email: string; name?: string }>;
  title: string;
  content: string;
  teamName: string;
}

interface BatchSendResult {
  batchIds: string[];
  totalRecipients: number;
}

const BATCH_LIMIT = 100;

/**
 * Validates email addresses
 */
export function validateEmails(emails: string[]): {
  valid: string[];
  invalid: string[];
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const email of emails) {
    if (emailRegex.test(email)) {
      valid.push(email);
    } else {
      invalid.push(email);
    }
  }

  return { valid, invalid };
}

/**
 * Sends announcement email to multiple recipients using Resend batch API
 * Handles batch splitting for >100 recipients
 */
export async function sendAnnouncementEmail({
  recipients,
  title,
  content,
  teamName,
}: SendEmailParams): Promise<BatchSendResult> {
  // Validate all emails first
  const emails = recipients.map((r) => r.email);
  const { invalid } = validateEmails(emails);

  if (invalid.length > 0) {
    throw new Error(`Invalid email addresses: ${invalid.join(", ")}`);
  }

  const batchIds: string[] = [];

  // Split into batches if needed
  for (let i = 0; i < recipients.length; i += BATCH_LIMIT) {
    const batch = recipients.slice(i, i + BATCH_LIMIT);

    // Render all emails in the batch (render is async in v2.x)
    const renderedHtmls = await Promise.all(
      batch.map((recipient) =>
        render(
          React.createElement(AnnouncementEmail, {
            title,
            content,
            teamName,
            memberName: recipient.name,
          }),
        ),
      ),
    );

    // Create email objects with rendered HTML
    const emails = batch.map((recipient, index) => ({
      from: "Taskboard <onboarding@resend.dev>", // TODO: Replace with your verified domain
      to: recipient.email,
      subject: `${teamName}: ${title}`,
      html: renderedHtmls[index],
    }));

    // Send batch
    const { data, error } = await resend.batch.send(emails);

    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }

    if (data?.id) {
      batchIds.push(data.id);
    }
  }

  return {
    batchIds,
    totalRecipients: recipients.length,
  };
}

/**
 * Query Resend API for batch status (for reconciliation)
 */
export async function getBatchStatus() {
  try {
    // Note: Resend doesn't have a direct batch status endpoint yet
    // This is a placeholder for future implementation
    // For now, rely on webhooks for status updates
    return { status: "unknown" };
  } catch (error) {
    console.error("Error fetching batch status:", error);
    return { status: "error" };
  }
}
