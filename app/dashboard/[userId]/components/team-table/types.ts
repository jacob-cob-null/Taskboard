export type Team = {
  id: string;
  name: string;
  memberCount: number;
  icon: string;
  color: string;
};

export interface TeamTableProps {
  data?: Team[];
  onViewTeam?: (team: Team) => void;
  onEditTeam?: (team: Team) => void;
  onDeleteTeam?: (team: Team) => void;
  onCopyTeamId?: (team: Team) => void;
}
