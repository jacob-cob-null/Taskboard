"use client";

import { inter } from "@/app/fonts";
import { useState } from "react";

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
      <div className="min-h-[400px]">
        {activeTab === "calendar" && (
          <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-lg">
            <p className={`${inter.className} text-gray-400 text-lg`}>
              Calendar view will be added here
            </p>
          </div>
        )}

        {activeTab === "members" && (
          <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-lg">
            <p className={`${inter.className} text-gray-400 text-lg`}>
              Members view will be added here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
