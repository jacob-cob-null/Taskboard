"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createTeam } from "@/actions/teams";

function NewTeamBtn() {
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    setIsLoading(true);

    try {
      await createTeam(teamName);
      // fallback: native alert
      alert(`Team "${teamName}" created successfully!`);
      setTeamName("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create team");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* alerts removed — using native alert as fallback */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="flex items-center justify-end gap-2">
            <Plus className="w-4 h-4" />
            New Team
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="p-4">
          <AlertDialogHeader className="p-1">
            <AlertDialogTitle>🎯 Create New Team</AlertDialogTitle>
          </AlertDialogHeader>

          <Input
            placeholder="Enter Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className=" border-gray-200 focus:border-blue-500 rounded-lg"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="flex justify-between gap-2 items-center"
              disabled={isLoading || !teamName.trim()}
              onClick={handleCreate}
            >
              <Plus className="w-4 h-4" />
              {isLoading ? "Creating..." : "Add Team"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default NewTeamBtn;
