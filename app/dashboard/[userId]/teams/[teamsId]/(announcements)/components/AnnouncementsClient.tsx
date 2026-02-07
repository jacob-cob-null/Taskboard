"use client";

import { useState, useEffect } from "react";
import { getAnnouncementsForTeam } from "@/actions/(announcements)/crud";
import CreateAnnouncementDialog from "./CreateAnnouncementDialog";
import AnnouncementCard from "./AnnouncementCard";
import { EmailStatus } from "@prisma/client";

interface AnnouncementsClientProps {
  teamId: string;
}

interface Announcement {
  id: bigint;
  title: string;
  content: string;
  created_at: Date;
  email_status: EmailStatus | null;
  sent_at: Date | null;
  recipient_count: number;
  delivered_count: number;
  error_message: string | null;
}

export default function AnnouncementsClient({
  teamId,
}: AnnouncementsClientProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAnnouncements() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getAnnouncementsForTeam(teamId);

      if (result.success && result.announcements) {
        setAnnouncements(result.announcements as Announcement[]);
      } else {
        setError(result.error || "Failed to load announcements");
      }
    } catch (err) {
      setError("An error occurred while loading announcements");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, [teamId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Skeleton cards */}
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
          <p className="text-sm text-gray-600">
            Create and send email announcements to your team members
          </p>
        </div>
        <CreateAnnouncementDialog
          teamId={teamId}
          onSuccess={loadAnnouncements}
        />
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No announcements yet</p>
          <p className="text-sm text-gray-500">
            Create your first announcement to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id.toString()}
              announcement={announcement}
              onUpdate={loadAnnouncements}
            />
          ))}
        </div>
      )}
    </div>
  );
}
