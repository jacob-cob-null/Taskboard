"use client";

import { useState } from "react";
import { EmailStatus } from "@prisma/client";
import { sendAnnouncement } from "@/actions/(announcements)/announcements";
import { deleteAnnouncement } from "@/actions/(announcements)/crud";
import EmailStatusBadge from "./EmailStatusBadge";
import { Send, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import ConfirmationModal from "@/app/dashboard/components/team-table/ConfirmationModal";

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  async function handleSend() {
    setIsSending(true);
    const toastId = toast.loading("Sending announcement emails...");
    try {
      const result = await sendAnnouncement(announcement.id);

      if (result.success) {
        toast.success("Announcement sent successfully!", { id: toastId });
        onUpdate();
      } else {
        toast.error(result.error || "Failed to send announcement", {
          id: toastId,
        });
      }
    } catch {
      toast.error("An error occurred while sending", { id: toastId });
    } finally {
      setIsSending(false);
    }
  }

  async function confirmDelete() {
    setDeleteModalOpen(false);
    setIsDeleting(true);
    const toastId = toast.loading("Deleting announcement...");
    try {
      const result = await deleteAnnouncement(announcement.id);

      if (result.success) {
        toast.success("Announcement deleted", { id: toastId });
        onUpdate();
      } else {
        toast.error(result.error || "Failed to delete announcement", {
          id: toastId,
        });
      }
    } catch {
      toast.error("An error occurred while deleting", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  }

  const canSend = announcement.email_status === EmailStatus.PENDING;
  const canDelete =
    announcement.email_status === EmailStatus.PENDING ||
    announcement.email_status === EmailStatus.FAILED;

  return (
    <>
      <div className="flex items-center gap-3 py-3 px-3 sm:px-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
              {announcement.title}
            </h3>
            <EmailStatusBadge
              status={announcement.email_status}
              recipientCount={announcement.recipient_count}
              deliveredCount={announcement.delivered_count}
              errorMessage={announcement.error_message}
            />
          </div>
          <p className="text-gray-500 text-xs truncate">
            {format(new Date(announcement.created_at), "MMM d, yyyy")}
            {announcement.sent_at &&
              ` • Sent ${format(new Date(announcement.sent_at), "MMM d")}`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {canSend && (
            <button
              onClick={handleSend}
              disabled={isSending}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              title="Send Email"
            >
              {isSending ? (
                <div className="h-4 w-4 bg-blue-300 rounded animate-pulse" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => setDeleteModalOpen(true)}
              disabled={isDeleting}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete"
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

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Announcement"
        description="Are you sure you want to delete this announcement? This action cannot be undone."
        onConfirm={confirmDelete}
      />
    </>
  );
}
