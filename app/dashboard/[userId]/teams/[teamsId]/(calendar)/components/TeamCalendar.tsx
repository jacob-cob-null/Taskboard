"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  View,
  ToolbarProps,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { INITIAL_EVENTS } from "./data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-custom.css";
import { CalendarEvent } from "@/lib/calendar-utils";
import OnSelectEvent from "./(actions)/OnSelectEvent";
import { useCalendarActions } from "./(actions)/useCalendarActions";
import CalendarToolbar from "./CalendarToolbar";
import CalendarModal from "./CalendarModal";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function TeamCalendar() {
  const { events: calendarEvents, addEvent } =
    useCalendarActions(INITIAL_EVENTS);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Responsive view adjustment
  useEffect(() => {
    if (window.innerWidth < 768) {
      setView("agenda");
    }
  }, []);

  // Handlers
  const handleAddEventTrigger = useCallback(() => setIsModalOpen(true), []);

  const handleFormSubmit = useCallback(
    (eventData: any) => {
      addEvent(eventData);
      setIsModalOpen(false);
    },
    [addEvent],
  );

  // Custom Toolbar Wrapper to inject the 'onAddEvent' prop
  const components = useMemo(
    () => ({
      toolbar: (props: ToolbarProps<CalendarEvent>) => (
        <CalendarToolbar {...props} onAddEvent={handleAddEventTrigger} />
      ),
    }),
    [handleAddEventTrigger],
  );

  return (
    <>
      <div className="w-full h-[600px] md:h-[700px]">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          selectable={true}
          startAccessor="start"
          endAccessor="end"
          date={date}
          view={view}
          onNavigate={setDate}
          onView={setView}
          onSelectEvent={(event) => OnSelectEvent({ event })}
          components={components}
          views={["month", "week", "day", "agenda"]}
          popup
        />
      </div>

      <CalendarModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}

import { useEffect } from "react"; // Added missing import at top-level merge
export default TeamCalendar;
