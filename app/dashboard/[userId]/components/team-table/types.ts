export type Team = {
  id: string;
  name: string;
  memberCount: number;
};

export interface TeamTableProps {
  data?: Team[];
  userId: string;
}
