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
import { updateMember } from "@/actions/members";
import toast from "react-hot-toast";

export interface Member {
  id: string;
  email: string;
  full_name: string | null;
  added_at?: Date;
}

interface EditMemberModalProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditMemberModal({ member, open, onOpenChange }: EditMemberModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sync input with member data when modal opens
  useEffect(() => {
    if (member && open) {
      setFullName(member.full_name || "");
      setEmail(member.email);
    }
  }, [member, open]);

  const handleUpdate = async () => {
    if (!member) return;
    setIsLoading(true);

    try {
      toast.loading("Updating member...");
      await updateMember(member.id, { email, full_name: fullName });
      toast.dismiss();
      toast.success(`Member "${fullName}" updated successfully!`);
      onOpenChange(false);
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to update member",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="p-4 left-4 right-4 translate-x-0 sm:left-[50%] sm:right-auto sm:translate-x-[-50%] max-w-md sm:m-0 sm:w-full">
        <AlertDialogHeader className="p-1">
          <AlertDialogTitle>Edit Member</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border-gray-200 focus:border-blue-500 rounded-lg"
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-gray-200 focus:border-blue-500 rounded-lg"
          />
        </div>

        <AlertDialogFooter className="flex flex-row">
          <AlertDialogCancel className="flex-1 sm:flex-none">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex justify-center gap-2 items-center"
            disabled={isLoading || !email.trim()}
            onClick={handleUpdate}
          >
            <Pencil className="w-4 h-4" />
            {isLoading ? "Updating..." : "Update Member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditMemberModal;
