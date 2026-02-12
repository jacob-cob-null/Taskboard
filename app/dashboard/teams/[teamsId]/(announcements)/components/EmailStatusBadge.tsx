import { EmailStatus } from "@prisma/client";
import { Check, X } from "lucide-react";

interface EmailStatusBadgeProps {
  status: EmailStatus | null;
  recipientCount?: number;
  deliveredCount?: number;
  errorMessage?: string | null;
}

export default function EmailStatusBadge({
  status,
  recipientCount = 0,
  deliveredCount = 0,
  errorMessage,
}: EmailStatusBadgeProps) {
  // Don't show badge if not sent yet
  if (!status || status === EmailStatus.PENDING) {
    return null;
  }

  switch (status) {

    case EmailStatus.SENDING:
      return (
        <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-300 flex items-center gap-1 sm:gap-2">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="hidden sm:inline">Sending...</span>
        </span>
      );

    case EmailStatus.SENT:
      return (
        <span
          className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300 flex items-center gap-1"
          title={`Delivered to ${deliveredCount} of ${recipientCount} members`}
        >
          <Check className="w-3 h-3 sm:hidden" />
          <span className="hidden sm:inline">✓ Sent to {recipientCount}{" "}
          {recipientCount === 1 ? "member" : "members"}</span>
          <span className="sm:hidden">{recipientCount}</span>
        </span>
      );

    case EmailStatus.PARTIALLY_FAILED:
      return (
        <span
          className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-300 flex items-center gap-1"
          title={errorMessage || "Some emails failed to send"}
        >
          <span className="sm:hidden font-bold">!</span>
          <span className="hidden sm:inline">⚠ Sent to {deliveredCount} of {recipientCount}</span>
          <span className="sm:hidden">{deliveredCount}/{recipientCount}</span>
        </span>
      );

    case EmailStatus.FAILED:
      return (
        <span
          className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300 flex items-center gap-1"
          title={errorMessage || "Failed to send"}
        >
          <X className="w-3 h-3 sm:hidden" />
          <span className="hidden sm:inline">✗ Failed</span>
          <span className="sm:hidden">✗</span>
        </span>
      );

    default:
      return (
        <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
          {status}
        </span>
      );
  }
}
