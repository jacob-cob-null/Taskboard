import { verifyUserAccess } from "@/actions/auth";
import WelcomeMsg from "./components/WelcomeMsg";
import { inter } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import TeamTable from "./components/TeamTable";
import { Plus } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const user = await verifyUserAccess(userId);

  // Google auth info is in user.user_metadata
  const { full_name, email, avatar_url, name } = user.user_metadata;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <WelcomeMsg name={name} avatarUrl={avatar_url} email={email} />
        </div>

        {/* Team Selection Card */}
        <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className={`${inter.className} font-semibold text-xl`}>
                Select a Team
              </h2>
              <p className={`${inter.className} text-sm text-gray-500 mt-1`}>
                Choose a workspace to continue your progress.
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Team
            </Button>
          </div>

          {/* Team Table */}
          <TeamTable />
        </div>
      </div>
    </div>
  );
}
