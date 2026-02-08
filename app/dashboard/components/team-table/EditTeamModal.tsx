"use client";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Input } from "@/components/ui/Input";
import { Pencil } from "lucide-react";
import { updateTeam } from "@/actions/teams";
import toast from "react-hot-toast";
import { Team } from "./types";

interface EditTeamModalProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditTeamModal({ team, open, onOpenChange }: EditTeamModalProps) {
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sync input with team name when modal opens
  useEffect(() => {
    if (team && open) {
      setTeamName(team.name);
    }
  }, [team, open]);

  const handleUpdate = async () => {
    if (!teamName.trim() || !team) return;
    setIsLoading(true);

    try {
      toast.loading("Updating team...");
      await updateTeam(team.id, teamName);
      toast.dismiss();
      toast.success(`Team "${teamName}" updated successfully!`);
      onOpenChange(false);
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to update team",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="p-4 left-4 right-4 translate-x-0 sm:left-[50%] sm:right-auto sm:translate-x-[-50%] max-w-md sm:m-0 sm:w-full">
        <AlertDialogHeader className="p-1">
          <AlertDialogTitle className="flex items-center gap-2">
            <Pencil className="w-6 h-6 text-blue-600" />
            Edit Team
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Input
          placeholder="Enter Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="border-gray-200 focus:border-blue-500 rounded-lg"
        />
        <AlertDialogFooter className="flex flex-row">
          <AlertDialogCancel className="flex-1 sm:flex-none">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex justify-center gap-2 items-center"
            disabled={isLoading || !teamName.trim()}
            onClick={handleUpdate}
          >
            <Pencil className="w-4 h-4" />
            {isLoading ? "Updating..." : "Update Team"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditTeamModal;
