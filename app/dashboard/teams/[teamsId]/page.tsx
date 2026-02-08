import { requireAuth } from "@/actions/auth";
import { verifyTeamOwnership } from "@/actions/teams";
import TeamDashboard from "./TeamDashboardClient";
import { TeamHeader } from "./TeamHeader";

async function TeamPage({ params }: { params: Promise<{ teamsId: string }> }) {
  // Verify if user has access to this team
  const { teamsId } = await params;
  const user = await requireAuth();

  // verify team
  const team = await verifyTeamOwnership(teamsId, user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-2 sm:p-8">
      <div className="max-w-6xl w-full my-4 sm:my-0">
        {/* Team Dashboard Card */}
        <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6">
          {/* Header */}
          <TeamHeader teamName={team.name} />

          {/* Client-side Tab Navigation and Content */}
          <TeamDashboard teamId={teamsId} />
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
