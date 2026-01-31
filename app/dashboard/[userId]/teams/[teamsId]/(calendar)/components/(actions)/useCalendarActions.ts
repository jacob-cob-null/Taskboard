import { useState, useCallback, useEffect } from "react";
import { View } from "react-big-calendar";
import {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from "@/lib/validations";
import {
  getTeamEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/actions/(events)/event";
import { INITIAL_EVENTS } from "../data";

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

  // 4. Initial Load
  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);

      // Mock data
      const result = INITIAL_EVENTS;
      setEvents(result);

      // const result = await getTeamEvents(teamId);

      // if (result.success && result.data) {
      //   setEvents(result.data);
      // }

      setIsLoading(false);
    }
    loadEvents();
  }, [teamId]);

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
        // TODO: Call createEvent action
        const result = await createCalendarEvent(teamId, data);
        if (result.success) {
          setEvents((prev) => [...prev, result.data]);
        }
      } else {
        // TODO: Call updateEvent action
        const result = await updateCalendarEvent(
          teamId,
          modal.selectedEvent?.id,
          data,
        );
        if (result.success) {
          setEvents((prev) => [...prev, result.data]);
        }
      }
      close();
    },
    [modal.mode, close],
  );

  const remove = useCallback(
    async (id: string) => {
      // TODO: Call deleteEvent action
      close();
    },
    [close],
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
