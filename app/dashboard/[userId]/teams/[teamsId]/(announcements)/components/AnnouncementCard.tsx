"use client";

import { useState } from "react";
import { EmailStatus } from "@prisma/client";
import { sendAnnouncement } from "@/actions/(announcements)/announcements";
import { deleteAnnouncement } from "@/actions/(announcements)/crud";
import { Button } from "@/components/ui/Button";
import EmailStatusBadge from "./EmailStatusBadge";
import { Send, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface AnnouncementCardProps {
  announcement: {
    id: bigint;
    title: string;
    content: string;
    created_at: Date;
    email_status: EmailStatus | null;
    sent_at: Date | null;
    recipient_count: number;
    delivered_count: number;
    error_message: string | null;
  };
  onUpdate: () => void;
}

export default function AnnouncementCard({
  announcement,
  onUpdate,
}: AnnouncementCardProps) {
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSend() {
    setIsSending(true);
    try {
      const result = await sendAnnouncement(announcement.id);

      if (result.success) {
        toast.success("Announcement sent successfully!");
        onUpdate();
      } else {
        toast.error(result.error || "Failed to send announcement");
      }
    } catch (error) {
      toast.error("An error occurred while sending");
    } finally {
      setIsSending(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAnnouncement(announcement.id);

      if (result.success) {
        toast.success("Announcement deleted");
        onUpdate();
      } else {
        toast.error(result.error || "Failed to delete announcement");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
    }
  }

  const canSend = announcement.email_status === EmailStatus.PENDING;
  const canDelete =
    announcement.email_status === EmailStatus.PENDING ||
    announcement.email_status === EmailStatus.FAILED;

  return (
    <div className="bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-3">
        <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">
          {announcement.title}
        </h3>
        <EmailStatusBadge
          status={announcement.email_status}
          recipientCount={announcement.recipient_count}
          deliveredCount={announcement.delivered_count}
          errorMessage={announcement.error_message}
        />
      </div>

      {/* Content Preview */}
      <p className="text-gray-700 text-sm mb-3 line-clamp-3 whitespace-pre-wrap">
        {announcement.content}
      </p>

      {/* Metadata */}
      <div className="text-xs text-gray-500 mb-3">
        <p>Created: {format(new Date(announcement.created_at), "PPp")}</p>
        {announcement.sent_at && (
          <p>Sent: {format(new Date(announcement.sent_at), "PPp")}</p>
        )}
      </div>

      {/* Error Message */}
      {announcement.error_message && (
        <div className="bg-red-50 border border-red-200 rounded p-2 mb-4">
          <p className="text-xs text-red-700">
            <strong>Error:</strong> {announcement.error_message}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {canSend && (
          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 text-sm"
          >
            {isSending ? (
              <div className="h-4 w-4 bg-blue-300 rounded animate-pulse" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        )}

        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="h-4 w-4 bg-red-200 rounded animate-pulse" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
