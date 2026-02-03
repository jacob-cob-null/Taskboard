"use client";

import { inter } from "@/app/fonts";
import { useState } from "react";
import TeamCalendar from "./(calendar)/components/TeamCalendar";
import MemberPage from "./(members)/page";
type Tab = "calendar" | "members";

interface TeamDashboardClientProps {
  teamId: string;
  userId: string;
}

export default function TeamDashboard({
  teamId,
  userId,
}: TeamDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("calendar");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-6 border-b-2 border-gray-200 mb-6">
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
      </div>

      {/* Tab Content */}
      <div className="h-[600px] md:h-[700px]">
        {/* Calendar */}
        {activeTab === "calendar" && <TeamCalendar teamId={teamId} />}
        {/* Members */}
        {activeTab === "members" && (
          <MemberPage params={{ userId, teamsId: teamId }} />
        )}
      </div>
    </div>
  );
}
