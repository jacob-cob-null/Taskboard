import { useState, useCallback, useEffect } from "react";
import { View } from "react-big-calendar";
import {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from "@/lib/validations";
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/actions/(events)/event";
import { getTeamEvents_DB } from "@/actions/(events)/event_db";

export function useTeamCalendar(teamId: string) {
  // 1. Data State
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Calendar View State
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  // 3. Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    selectedEvent: CalendarEvent | null;
  }>({
    isOpen: false,
    mode: "create",
    selectedEvent: null,
  });

  // 4. Load Events (extracted for refetch)
  const loadEvents = useCallback(async () => {
    setIsLoading(true);

    try {
      const events = await getTeamEvents_DB(teamId);
      setEvents(events);
    } catch (error) {
      console.error("Failed to load events:", error);
      setEvents([]);
    }

    setIsLoading(false);
  }, [teamId]);

  // 5. Initial Load
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);
  const handleCreate = useCallback(
    async (data: CreateEventInput) => {
      // Map desc to description for server action
      const result = await createCalendarEvent(teamId, {
        title: data.title,
        start: data.start,
        end: data.end,
        description: data.desc,
      });
      if (result.success) {
        await loadEvents(); // Refetch canonical list
      }
    },
    [teamId, loadEvents],
  );
  const handleUpdate = useCallback(
    async (data: UpdateEventInput) => {
      const result = await updateCalendarEvent(teamId, data);
      if (result.success) {
        await loadEvents(); // Refetch canonical list
      }
    },
    [teamId, loadEvents],
  );
  const handleDelete = useCallback(
    async (id: string) => {
      const result = await deleteCalendarEvent(teamId, id);
      if (result.success) {
        await loadEvents(); // Refetch canonical list
      }
    },
    [teamId, loadEvents],
  );

  // 5. Actions (Scaffolded for User Implementation)
  const openCreate = useCallback(() => {
    setModal({ isOpen: true, mode: "create", selectedEvent: null });
  }, []);

  const openEdit = useCallback((event: CalendarEvent) => {
    setModal({ isOpen: true, mode: "edit", selectedEvent: event });
  }, []);

  const close = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const submit = useCallback(
    async (data: CreateEventInput | UpdateEventInput) => {
      if (modal.mode === "create") {
        await handleCreate(data as CreateEventInput);
      } else if (modal.mode === "edit") {
        await handleUpdate(data as UpdateEventInput);
      }
      close();
    },
    [modal.mode, close, handleCreate, handleUpdate],
  );

  const remove = useCallback(
    async (id: string) => {
      await handleDelete(id);
      close();
    },
    [close, handleDelete],
  );

  return {
    // State
    events,
    isLoading,
    date,
    view,
    modal,

    // Setters
    setDate,
    setView,

    // Actions
    actions: {
      openCreate,
      openEdit,
      close,
      submit,
      remove,
    },
  };
}
