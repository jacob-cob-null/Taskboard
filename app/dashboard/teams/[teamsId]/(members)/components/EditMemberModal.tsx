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
import { AddMemberSchema } from "@/lib/validations";

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
  const [errors, setErrors] = useState<{ email?: string; full_name?: string }>(
    {},
  );

  // Sync input with member data when modal opens
  useEffect(() => {
    if (member && open) {
      setFullName(member.full_name || "");
      setEmail(member.email);
      setErrors({}); // Clear errors when opening
    }
  }, [member, open]);

  const handleUpdate = async () => {
    if (!member) return;

    // Check for empty fields first
    if (!email.trim() || !fullName.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate inputs
    const validation = AddMemberSchema.safeParse({
      email: email.trim(),
      full_name: fullName.trim(),
    });

    if (!validation.success) {
      const fieldErrors: { email?: string; full_name?: string } = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "full_name") fieldErrors.full_name = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      toast.loading("Updating member...");
      await updateMember(member.id, {
        email: validation.data.email,
        full_name: validation.data.full_name || undefined,
      });
      toast.dismiss();
      toast.success(
        `Member "${validation.data.full_name || validation.data.email}" updated successfully!`,
      );
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
          <div>
            <Input
              placeholder="Full Name *"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors((prev) => ({ ...prev, full_name: undefined }));
              }}
              onBlur={() => {
                // Validate name on blur
                const result = AddMemberSchema.shape.full_name.safeParse(
                  fullName.trim(),
                );
                if (!result.success) {
                  setErrors((prev) => ({
                    ...prev,
                    full_name: result.error.issues[0]?.message,
                  }));
                }
              }}
              className="border-gray-200 focus:border-blue-500 rounded-lg"
              required
            />
            {errors.full_name && (
              <p className="text-sm text-red-600 mt-1">{errors.full_name}</p>
            )}
          </div>
          <div>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              onBlur={() => {
                // Validate email on blur
                const result = AddMemberSchema.shape.email.safeParse(
                  email.trim(),
                );
                if (!result.success) {
                  setErrors((prev) => ({
                    ...prev,
                    email: result.error.issues[0]?.message,
                  }));
                }
              }}
              className="border-gray-200 focus:border-blue-500 rounded-lg"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <AlertDialogFooter className="flex flex-row">
          <AlertDialogCancel className="flex-1 sm:flex-none">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex justify-center gap-2 items-center"
            disabled={isLoading || !email.trim() || !fullName.trim()}
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
