import { verifyUserAccess } from "@/actions/auth";
import { verifyTeamOwnership } from "@/actions/teams";
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

  return <div>{team.name}</div>;
}

export default TeamPage;
