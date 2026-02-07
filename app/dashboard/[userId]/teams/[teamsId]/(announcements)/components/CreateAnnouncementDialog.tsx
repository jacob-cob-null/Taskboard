"use client";

import { useState } from "react";
import { createAnnouncement } from "@/actions/(announcements)/crud";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { Input } from "@/components/ui/Input";
import { Megaphone } from "lucide-react";
import toast from "react-hot-toast";

interface CreateAnnouncementDialogProps {
  teamId: string;
  onSuccess: () => void;
}

export default function CreateAnnouncementDialog({
  teamId,
  onSuccess,
}: CreateAnnouncementDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createAnnouncement(teamId, title, content);

      if (result.success) {
        toast.success(
          "Announcement created! Click Send to email team members.",
        );
        setTitle("");
        setContent("");
        setOpen(false);
        onSuccess();
      } else {
        toast.error(result.error || "Failed to create announcement");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
          <Megaphone className="w-5 h-5" />
          <span className="hidden md:inline">Create Announcement</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-4 left-4 right-4 translate-x-0 sm:left-[50%] sm:right-auto sm:translate-x-[-50%] max-w-md sm:m-0 sm:w-full">
        <AlertDialogHeader className="p-1">
          <AlertDialogTitle>Create Announcement</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-3">
          <div>
            <Input
              placeholder="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="border-gray-200 focus:border-blue-500 rounded-lg"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/200 characters
            </p>
          </div>
          <div>
            <textarea
              placeholder="Content *"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={2000}
              rows={8}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.length}/2000 characters
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex flex-row gap-2">
          <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="flex-1 flex justify-center gap-2 items-center"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            onClick={handleSubmit}
          >
            <Megaphone className="w-4 h-4" />
            {isSubmitting ? "Creating..." : "Create"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
