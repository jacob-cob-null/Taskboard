import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from "@/lib/validations";
import { format } from "date-fns";
import { inter, instrumentSerif } from "@/app/fonts";

interface EventModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  event: CalendarEvent | null;
  onClose: () => void;
  onSubmit: (data: CreateEventInput | UpdateEventInput) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export default function EventModal({
  isOpen,
  mode,
  event,
  onClose,
  onSubmit,
  onDelete,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [startStr, setStartStr] = useState("");
  const [endStr, setEndStr] = useState("");
  const [desc, setDesc] = useState("");

  // Sync state with event data when editing
  useEffect(() => {
    if (mode === "edit" && event) {
      setTitle(event.title);
      setStartStr(format(event.start, "yyyy-MM-dd'T'HH:mm"));
      setEndStr(format(event.end, "yyyy-MM-dd'T'HH:mm"));
      setDesc(event.desc || "");
    } else {
      setTitle("");
      setStartStr("");
      setEndStr("");
      setDesc("");
    }
  }, [mode, event, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Zod validation and Toasting here

    if (mode === "create") {
      const data: CreateEventInput = {
        title,
        start: new Date(startStr),
        end: new Date(endStr),
        desc,
      };
      await onSubmit(data);
    } else {
      const data: UpdateEventInput = {
        id: event!.id,
        title,
        start: new Date(startStr),
        end: new Date(endStr),
        desc,
        googleEventId: event!.googleEventId,
      };
      await onSubmit(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className=" bg-black/30">
        <DialogContent className="p-8 rounded-xl outline-4 outline-black overflow-visible">
          <DialogHeader className="p-0">
            <DialogTitle
              className={`${instrumentSerif.className} font-base font-bold text-4xl`}
            >
              {mode === "create" ? "📅 Add New Event" : "📝 Edit Event"}
            </DialogTitle>
            <DialogDescription
              className={`${inter.className} text-md font-base text-foreground`}
            >
              {mode === "create"
                ? "Enter the details for the new team event."
                : "Update the details of this event."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Event Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design Sprint"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="datetime-local"
                  value={startStr}
                  onChange={(e) => setStartStr(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="datetime-local"
                  value={endStr}
                  onChange={(e) => setEndStr(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Description (Optional)
              </label>
              <Input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Short description"
              />
            </div>

            <DialogFooter className="flex mt-4 justify-between items-center md:justify-between">
              {mode === "edit" && onDelete && (
                <Button type="button" onClick={() => onDelete(event!.id)}>
                  Delete
                </Button>
              )}
              <div className="place-content-end grid grid-cols-2 w-full sm:flex gap-2 ml-auto">
                <Button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-100 text-black"
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {mode === "create" ? "Add Event" : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
