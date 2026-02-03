"use client";

import * as React from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { getMembersForTeam, removeMemberFromTeam } from "@/actions/members";
import { SearchInput } from "@/app/dashboard/[userId]/components/team-table/SearchInput";
import { Pagination } from "@/app/dashboard/[userId]/components/team-table/Pagination";
import { MemberActionsMenu } from "./MemberActionsMenu";
import ConfirmationModal from "@/app/dashboard/[userId]/components/team-table/ConfirmationModal";
import EditMemberModal, { Member } from "./EditMemberModal";
import toast from "react-hot-toast";

import { UserPlus, Upload } from "lucide-react";

interface MemberTableProps {
  teamId: string;
}

export default function MemberTable({ teamId }: MemberTableProps) {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [memberToRemove, setMemberToRemove] = React.useState<Member | null>(
    null,
  );
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [memberToEdit, setMemberToEdit] = React.useState<Member | null>(null);

  // Fetch members on mount
  React.useEffect(() => {
    const fetchMembers = async () => {
      const result = await getMembersForTeam(teamId);
      if (result.success && result.members) {
        setMembers(result.members as Member[]);
      }
    };
    fetchMembers();
  }, [teamId]);

  const handleRemoveClick = (member: Member) => {
    setMemberToRemove(member);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (member: Member) => {
    setMemberToEdit(member);
    setEditModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (memberToRemove) {
      toast.loading(
        `Removing ${memberToRemove.full_name || memberToRemove.email} ...`,
      );
      await removeMemberFromTeam(teamId, memberToRemove.id);
      setDeleteModalOpen(false);
      setMemberToRemove(null);
      toast.dismiss();
      toast.success(`Member removed successfully!`);
    }
  };

  const columns: ColumnDef<Member>[] = [
    {
      key: "full_name",
      header: "Name",
      className: "w-[250px]",
      render: (member) => (
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-900">
            {member.full_name || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      className: "",
      render: (member) => <div className="text-gray-600">{member.email}</div>,
    },
    {
      key: "added_at",
      header: "Added",
      className: "text-center",
      render: (member) => (
        <div className="text-gray-600">
          {member.added_at
            ? new Date(member.added_at).toLocaleDateString()
            : "—"}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable<Member>
        data={members}
        columns={columns}
        searchKey="full_name"
        searchPlaceholder="Search members..."
        emptyMessage="No members in this team yet."
        headerActions={
          <>
            <button className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              <span className="hidden md:inline">Add Member</span>
            </button>
            <button className="px-3 md:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
              <Upload className="w-5 h-5" />
              <span className="hidden md:inline">Import</span>
            </button>
          </>
        }
        renderActions={(member) => (
          <MemberActionsMenu
            member={member}
            onEdit={() => handleEditClick(member)}
            onRemove={() => handleRemoveClick(member)}
          />
        )}
        SearchComponent={SearchInput}
        PaginationComponent={Pagination}
      />

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        description="This will remove the member from this team. They can be added back later."
        onConfirm={handleConfirmRemove}
      />

      <EditMemberModal
        member={memberToEdit}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </>
  );
}
