import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Input } from "@/components/ui/Input";
import { CalendarEvent } from "@/lib/calendar-utils";

interface CalendarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: Omit<CalendarEvent, "id">) => void;
}

export default function CalendarModal({
  open,
  onOpenChange,
  onSubmit,
}: CalendarModalProps) {
  const [title, setTitle] = useState("");
  const [startStr, setStartStr] = useState("");
  const [endStr, setEndStr] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startStr || !endStr) return;

    onSubmit({
      title,
      start: new Date(startStr),
      end: new Date(endStr),
    });

    // Reset and close
    setTitle("");
    setStartStr("");
    setEndStr("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Event</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the details for the new calendar event.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Event Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Team Meeting"
            />
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="start" className="text-sm font-medium">
                Start Time
              </label>
              <Input
                id="start"
                type="datetime-local"
                value={startStr}
                onChange={(e) => setStartStr(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="end" className="text-sm font-medium">
                End Time
              </label>
              <Input
                id="end"
                type="datetime-local"
                value={endStr}
                onChange={(e) => setEndStr(e.target.value)}
              />
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={!title}>
            Add Event
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
