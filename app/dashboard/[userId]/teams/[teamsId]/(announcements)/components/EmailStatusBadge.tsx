import { EmailStatus } from "@prisma/client";

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
  if (!status) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
        Unknown
      </span>
    );
  }

  switch (status) {
    case EmailStatus.PENDING:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-300">
          Not Sent
        </span>
      );

    case EmailStatus.SENDING:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-300 flex items-center gap-2">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          Sending...
        </span>
      );

    case EmailStatus.SENT:
      return (
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300"
          title={`Delivered to ${deliveredCount} of ${recipientCount} members`}
        >
          ✓ Sent to {recipientCount}{" "}
          {recipientCount === 1 ? "member" : "members"}
        </span>
      );

    case EmailStatus.PARTIALLY_FAILED:
      return (
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-300"
          title={errorMessage || "Some emails failed to send"}
        >
          ⚠ Sent to {deliveredCount} of {recipientCount}
        </span>
      );

    case EmailStatus.FAILED:
      return (
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300"
          title={errorMessage || "Failed to send"}
        >
          ✗ Failed
        </span>
      );

    default:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
          {status}
        </span>
      );
  }
}
