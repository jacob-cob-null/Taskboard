import MemberTable from "./components/MemberTable";

interface MemberPageProps {
  params: {
    teamsId: string;
  };
}

export default function MemberPage({ params }: MemberPageProps) {
  return (
    <div className="h-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Team Members</h1>
      <MemberTable teamId={params.teamsId} />
    </div>
  );
}
