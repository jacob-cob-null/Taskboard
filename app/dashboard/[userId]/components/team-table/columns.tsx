import { ColumnDef } from "@tanstack/react-table";
import { Team } from "./types";
import { ColumnHeader } from "./ColumnHeader";
import { TeamNameCell } from "./TeamNameCell";
import { ActionsMenu } from "./ActionsMenu";

interface ColumnHandlers {
  onView: (team: Team) => void;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
  onCopyId: (team: Team) => void;
}

export function createColumns(handlers: ColumnHandlers): ColumnDef<Team>[] {
  return [
    {
      accessorKey: "name",
      header: () => <ColumnHeader>Team Name</ColumnHeader>,
      cell: ({ row }) => <TeamNameCell team={row.original} />,
    },
    {
      accessorKey: "memberCount",
      header: () => <ColumnHeader>Members</ColumnHeader>,
      cell: ({ row }) => (
        <div className="text-gray-600 text-center">
          {row.getValue("memberCount")}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <ColumnHeader>Actions</ColumnHeader>,
      enableHiding: false,
      cell: ({ row }) => {
        const team = row.original;
        return (
          <ActionsMenu
            team={team}
            onView={() => handlers.onView(team)}
            onEdit={() => handlers.onEdit(team)}
            onDelete={() => handlers.onDelete(team)}
            onCopyId={() => handlers.onCopyId(team)}
          />
        );
      },
    },
  ];
}
