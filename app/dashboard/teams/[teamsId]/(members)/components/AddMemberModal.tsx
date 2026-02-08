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
} from "@/components/ui/AlertDialog";
import { Input } from "@/components/ui/Input";
import { UserPlus } from "lucide-react";
import { addMemberToTeam } from "@/actions/members";
import toast from "react-hot-toast";
import { AddMemberSchema } from "@/lib/validations";

interface AddMemberModalProps {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function AddMemberModal({
  teamId,
  open,
  onOpenChange,
  onSuccess,
}: AddMemberModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; full_name?: string }>(
    {},
  );

  const handleAdd = async () => {
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
      toast.loading("Adding member...");
      const result = await addMemberToTeam(
        teamId,
        validation.data.email,
        validation.data.full_name,
      );

      toast.dismiss();

      if (result.success) {
        toast.success(
          `Member "${validation.data.full_name || validation.data.email}" added successfully!`,
        );
        setFullName("");
        setEmail("");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to add member");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to add member",
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
            <UserPlus className="w-6 h-6 text-blue-600" />
            Add Member
          </AlertDialogTitle>
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
              placeholder="Email *"
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
              required
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
            onClick={handleAdd}
          >
            <UserPlus className="w-4 h-4" />
            {isLoading ? "Adding..." : "Add Member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AddMemberModal;
