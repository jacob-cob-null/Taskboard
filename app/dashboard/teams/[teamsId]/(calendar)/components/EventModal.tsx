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
  CreateEventSchema,
  UpdateEventSchema,
} from "@/lib/validations";
import { format } from "date-fns";
import { inter, instrumentSerif } from "@/app/fonts";
import toast from "react-hot-toast";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync state with event data when editing
  // eslint-disable-next-line react-hooks/set-state-in-effect
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
    setErrors({});
  }, [mode, event, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (mode === "create") {
      const data = {
        title,
        start: new Date(startStr),
        end: endStr ? new Date(endStr) : undefined, // Allow empty end date
        desc: desc || undefined,
      };

      // Validate with Zod
      const result = CreateEventSchema.safeParse(data);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        toast.error("Please fix the validation errors");
        return;
      }

      await onSubmit(result.data);
    } else {
      const data = {
        id: event!.id,
        title,
        start: new Date(startStr),
        end: endStr ? new Date(endStr) : undefined, // Allow empty end date
        desc: desc || undefined,
        googleEventId: event!.googleEventId,
      };

      // Validate with Zod
      const result = UpdateEventSchema.safeParse(data);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        toast.error("Please fix the validation errors");
        return;
      }

      await onSubmit(result.data);
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
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="datetime-local"
                  value={startStr}
                  onChange={(e) => setStartStr(e.target.value)}
                  className={errors.start ? "border-red-500" : ""}
                />
                {errors.start && (
                  <p className="text-sm text-red-500">{errors.start}</p>
                )}
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="datetime-local"
                  value={endStr}
                  onChange={(e) => setEndStr(e.target.value)}
                  className={errors.end ? "border-red-500" : ""}
                />
                {errors.end && (
                  <p className="text-sm text-red-500">{errors.end}</p>
                )}
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
                className={errors.desc ? "border-red-500" : ""}
              />
              {errors.desc && (
                <p className="text-sm text-red-500">{errors.desc}</p>
              )}
            </div>

            <DialogFooter className="flex mt-4 justify-between items-center md:justify-between">
              {mode === "edit" && onDelete && (
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  type="button"
                  onClick={() => onDelete(event!.id)}
                >
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
