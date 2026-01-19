"use client";

import { useState, useEffect } from "react";
import { signOut } from "@/actions/auth";
import { checkCalendarPermissions } from "@/actions/calendar";

export default function CalendarPermissionsBanner() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPermissions() {
      try {
        const data = await checkCalendarPermissions();
        setShow(data.needsReauth);
      } catch (error) {
        console.error("Failed to check permissions:", error);
      } finally {
        setLoading(false);
      }
    }
    checkPermissions();
  }, []);

  if (loading || !show) return null;

  return (
    <div className="mb-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-600 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900">
            Calendar Permissions Required
          </h3>
          <p className="text-sm text-yellow-800 mt-1">
            To create team calendars, please sign out and sign back in to grant
            the updated Google Calendar permissions.
          </p>
          <button
            onClick={async () => {
              setLoading(true);
              // Sign out - this will redirect to login page where they can sign in again
              await signOut();
            }}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? "Signing out..." : "Sign Out and Re-authorize"}
          </button>
        </div>
        <button
          onClick={() => setShow(false)}
          className="flex-shrink-0 text-yellow-600 hover:text-yellow-800"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
