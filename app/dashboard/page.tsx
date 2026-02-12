import { requireAuth } from "@/actions/auth";
import { getTeams } from "@/actions/teams";
import WelcomeMsg from "./components/WelcomeMsg";
import { inter } from "@/app/fonts";
import { TeamTable } from "./components/team-table";
import NewTeamBtn from "./components/NewTeamBtn";
import CalendarPermissionsBanner from "./components/CalendarPermissionsBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Taskboard",
};

export default async function Page() {
  const user = await requireAuth();

  // Fetch teams data
  const teams = await getTeams();

  // Google auth info is in user.user_metadata
  const { email, avatar_url, name } = user.user_metadata;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100 flex items-center justify-center p-2 sm:p-8">
      <div className="max-w-4xl w-full">
        {/* Welcome Section */}
        <div className="mb-4 sm:mb-8">
          <WelcomeMsg name={name} avatarUrl={avatar_url} email={email} />
        </div>

        {/* Calendar Permissions Banner */}
        <CalendarPermissionsBanner />

        {/* Team Selection Card */}
        <div className="flex flex-col bg-white h-fit sm:min-h-[65vh] min-h-[80vh] sm:h-[70vh] rounded-lg sm:rounded-2xl border border-black sm:border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3.5 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className={`${inter.className} font-semibold text-xl sm:text-xl`}>
                Select a Team
              </h2>
              <p className={`${inter.className} text-sm sm:text-sm text-gray-500 mt-1`}>
                Choose a workspace to continue your progress.
              </p>
            </div>
            <NewTeamBtn />
          </div>
          {/* Team Table */}
          <TeamTable data={teams} />
        </div>
      </div>
    </div>
  );
}
