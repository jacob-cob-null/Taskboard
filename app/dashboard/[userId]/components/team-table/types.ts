export type Team = {
  id: string;
  name: string;
  memberCount: number;
};

export interface TeamTableProps {
  data?: Team[];
  onEditTeam?: (team: Team) => void;
  onDeleteTeam?: (team: Team) => void;
}
