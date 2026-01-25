import { useState, useCallback } from "react";
import { SlotInfo } from "react-big-calendar";

export function useCalendarActions(initialEvents: any[]) {
  const [events, setEvents] = useState(initialEvents);

  const onSelectSlot = useCallback(({ start, end }: SlotInfo) => {
    const title = window.prompt("New Event name");
    if (title) {
      setEvents((prev) => [...prev, { start, end, title, id: Date.now() }]);
    }
  }, []);

  return {
    events,
    onSelectSlot,
    setEvents, // Exported for flexibility
  };
}
