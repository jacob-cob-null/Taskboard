"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Users } from "lucide-react";
import { createTeam } from "@/actions/teams";
import toast from "react-hot-toast";
import { instrumentSerif } from "@/app/fonts";

function NewTeamBtn() {
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    setIsLoading(true);

    try {
      toast.loading("Creating team...");
      await createTeam(teamName);
      toast.success(`Team "${teamName}" created successfully!`);
      setTeamName("");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create team",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-end gap-2">
          <Plus className="w-4 h-4" />
          New Team
        </Button>
      </DialogTrigger>
      <DialogOverlay className="bg-black/30">
        <DialogContent className="p-8 rounded-xl outline-4 outline-black overflow-visible">
          <DialogHeader className="p-1">
            <DialogTitle
              className={`${instrumentSerif.className} text-md font-base font-bold text-4xl flex items-center gap-3`}
            >
              <Users className="w-10 h-10 text-blue-600" />
              Create New Team
            </DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Enter Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="border-gray-200 focus:border-blue-500 rounded-lg"
          />
          <DialogFooter className="flex flex-row">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 sm:flex-none bg-slate-100 text-black"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 sm:flex-none justify-center gap-2 items-center"
              disabled={isLoading || !teamName.trim()}
              onClick={handleCreate}
            >
              <Plus className="w-4 h-4" />
              {isLoading ? "Creating..." : "Add Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}

export default NewTeamBtn;
