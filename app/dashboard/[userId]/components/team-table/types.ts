export type Team = {
  id: string;
  name: string;
  memberCount: number;
  icon: string;
  color: string;
};

export interface TeamTableProps {
  data?: Team[];
  onEditTeam?: (team: Team) => void;
  onDeleteTeam?: (team: Team) => void;
}
