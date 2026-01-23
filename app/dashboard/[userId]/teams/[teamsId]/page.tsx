import { verifyUserAccess } from "@/actions/auth";
import { verifyTeamOwnership } from "@/actions/teams";
import { inter, instrumentSerif } from "@/app/fonts";
import Link from "next/link";
import TeamDashboard from "./TeamDashboardClient";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

async function TeamPage({
  params,
}: {
  params: Promise<{ userId: string; teamsId: string }>;
}) {
  // Verify if user has access to this team
  const { userId, teamsId } = await params;
  const user = await verifyUserAccess(userId);

  // verify team
  const team = await verifyTeamOwnership(teamsId, user.id);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-6xl w-full">
        {/* Team Dashboard Card */}
        <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className={`${instrumentSerif.className} font-bold text-5xl`}>
                Team <span className="text-blue-600 italic">{team.name}</span>
              </h1>
            </div>
            <Button asChild>
              <Link href={`/dashboard/${userId}`}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </Button>
          </div>

          {/* Client-side Tab Navigation and Content */}
          <TeamDashboard teamId={teamsId} userId={userId} />
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
