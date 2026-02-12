"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
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

// Dynamic import to avoid SSR issues with TipTap
const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-lg p-3 min-h-[160px] bg-gray-50 animate-pulse" />
  ),
});

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
    // Strip HTML to check if content is empty
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (!title.trim() || !textContent) {
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
    } catch {
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
      <AlertDialogContent className="p-4 left-4 right-4 translate-x-0 sm:left-[50%] sm:right-auto sm:translate-x-[-50%] max-w-md sm:max-w-2xl sm:m-0 sm:w-full h-[500px] sm:h-[480px] flex flex-col">
        <AlertDialogHeader className="p-1 shrink-0">
          <AlertDialogTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-600" />
            Create Announcement
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
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
          <div className="flex-1 min-h-0">
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your announcement content..."
              maxLength={2000}
            />
          </div>
        </div>

        <AlertDialogFooter className="flex flex-row gap-2 shrink-0">
          <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="flex-1 flex justify-center gap-2 items-center"
            disabled={
              isSubmitting ||
              !title.trim() ||
              !content.replace(/<[^>]*>/g, "").trim()
            }
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
