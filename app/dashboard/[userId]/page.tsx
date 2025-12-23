import { verifyUserAccess } from "@/actions/auth";
export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  await verifyUserAccess(userId);

  return (
    <div>
      <h1>Dashboard</h1>
      Team: {userId}
    </div>
  );
}
