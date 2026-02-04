"use client";

import * as React from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { deleteTeam } from "@/actions/teams";
import { Team, TeamTableProps } from "./types";
import { sampleData } from "./data";
import { SearchInput } from "./SearchInput";
import { Pagination } from "./Pagination";
import { ActionsMenu } from "./ActionsMenu";
import ConfirmationModal from "./ConfirmationModal";
import toast from "react-hot-toast";
import EditTeamModal from "./EditTeamModal";
import { useRouter } from "next/navigation";

export default function TeamTable({
  data = sampleData,
  userId,
}: TeamTableProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [teamToDelete, setTeamToDelete] = React.useState<Team | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [teamToEdit, setTeamToEdit] = React.useState<Team | null>(null);

  const handleDeleteClick = (team: Team) => {
    setTeamToDelete(team);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (team: Team) => {
    setTeamToEdit(team);
    setEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (teamToDelete) {
      toast.loading(`Deleting team ${teamToDelete.name} ...`);
      await deleteTeam(teamToDelete.id);
      setDeleteModalOpen(false);
      setTeamToDelete(null);
      toast.dismiss();
      toast.success(`Team ${teamToDelete.name} deleted successfully!`);
    }
  };

  const columns: ColumnDef<Team>[] = [
    {
      key: "name",
      header: "Team Name",
      className: "w-[300px]",
      render: (team) => (
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-900">{team.name}</span>
        </div>
      ),
    },
    {
      key: "memberCount",
      header: "Members",
      className: "text-center",
      render: (team) => <div className="text-gray-600">{team.memberCount}</div>,
    },
  ];

  return (
    <>
      <DataTable<Team>
        data={data}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search teams..."
        emptyMessage="Try adding a new team!"
        onRowClick={(team) =>
          router.push(`/dashboard/${userId}/teams/${team.id}`)
        }
        renderActions={(team) => (
          <ActionsMenu
            team={team}
            onEdit={() => handleEditClick(team)}
            onDelete={() => handleDeleteClick(team)}
          />
        )}
        SearchComponent={SearchInput}
        PaginationComponent={Pagination}
      />

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        description="This action cannot be undone. This will permanently delete your team."
        onConfirm={handleConfirmDelete}
      />

      <EditTeamModal
        team={teamToEdit}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </>
  );
}
