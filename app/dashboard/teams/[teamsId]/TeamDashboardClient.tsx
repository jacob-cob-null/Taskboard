"use client";

import { inter } from "@/app/fonts";
import { useState } from "react";
import TeamCalendar from "./(calendar)/components/TeamCalendar";
import MemberPage from "./(members)/page";
import AnnouncementsClient from "./(announcements)/components/AnnouncementsClient";
type Tab = "calendar" | "members" | "announcements";

interface TeamDashboardClientProps {
  teamId: string;
}

export default function TeamDashboard({ teamId }: TeamDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("calendar");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-3 border-b-2 border-gray-200 mb-2">
        <button
          onClick={() => setActiveTab("calendar")}
          className={`${inter.className} pb-3 px-1 font-medium transition-colors relative ${
            activeTab === "calendar"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Calendar
          {activeTab === "calendar" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`${inter.className} pb-3 px-1 font-medium transition-colors relative ${
            activeTab === "members"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Members
          {activeTab === "members" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("announcements")}
          className={`${inter.className} pb-3 px-1 font-medium transition-colors relative ${
            activeTab === "announcements"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Announcements
          {activeTab === "announcements" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="h-[600px] md:h-[700px]">
        {/* Calendar */}
        <div
          className={
            activeTab === "calendar" ? "block h-full" : "hidden h-full"
          }
        >
          <TeamCalendar teamId={teamId} />
        </div>
        {/* Members */}
        <div
          className={
            activeTab === "members"
              ? "block h-full overflow-y-auto p-1 sm:p-2"
              : "hidden h-full"
          }
        >
          <MemberPage params={{ teamsId: teamId }} />
        </div>
        {/* Announcements */}
        <div
          className={
            activeTab === "announcements" ? "block h-full" : "hidden h-full"
          }
        >
          <AnnouncementsClient teamId={teamId} />
        </div>
      </div>
    </div>
  );
}
