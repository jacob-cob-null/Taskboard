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

    const loadingToast = toast.loading("Creating team...");
    try {
      await createTeam(teamName);
      toast.dismiss(loadingToast);
      toast.success(`Team "${teamName}" created successfully!`);
      setTeamName("");
      setOpen(false);
    } catch (error) {
      toast.dismiss(loadingToast);
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
        <Button className="flex items-center justify-end gap-1.5 sm:gap-2 text-xs sm:text-base" size="sm">
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          New Team
        </Button>
      </DialogTrigger>
      <DialogOverlay className="bg-black/30">
        <DialogContent className="p-4.5 sm:p-8 rounded-lg sm:rounded-xl outline-2 sm:outline-4 outline-black overflow-visible">
          <DialogHeader className="p-0.5 sm:p-1">
            <DialogTitle
              className={`${instrumentSerif.className} text-md font-base font-bold text-2xl sm:text-4xl flex items-center gap-2 sm:gap-3`}
            >
              <Users className="w-7 h-7 sm:w-10 sm:h-10 text-blue-600" />
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
