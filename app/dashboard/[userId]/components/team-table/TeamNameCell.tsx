import { Team } from "./types";

interface TeamNameCellProps {
  team: Team;
}

export function TeamNameCell({ team }: TeamNameCellProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-lg ${team.color} flex items-center justify-center text-base`}
      >
        {team.icon}
      </div>
      <span className="font-medium text-gray-900">{team.name}</span>
    </div>
  );
}
