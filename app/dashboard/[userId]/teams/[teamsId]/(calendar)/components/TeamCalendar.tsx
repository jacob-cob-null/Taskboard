"use client";

import { useMemo } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  ToolbarProps,
  CalendarProps,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-custom.css";
import { CalendarEvent } from "@/lib/validations";
import { useTeamCalendar } from "./(actions)/useCalendarActions";
import CalendarToolbar from "./CalendarToolbar";
import EventModal from "./EventModal";

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

// Shared configuration to keep JSX clean
const calendarConfig: Omit<CalendarProps<CalendarEvent, object>, "events"> = {
  localizer,
  selectable: true,
  startAccessor: "start",
  endAccessor: "end",
  views: ["month", "week", "day", "agenda"],
  popup: true,
};

export default function TeamCalendar({ teamId }: { teamId: string }) {
  // 1. Data Layer Hook
  const { events, view, setView, date, setDate, modal, actions } =
    useTeamCalendar(teamId);

  // 2. Custom Toolbar Injection
  const components = useMemo(
    () => ({
      toolbar: (props: ToolbarProps<CalendarEvent>) => (
        <CalendarToolbar {...props} onAddEvent={actions.openCreate} />
      ),
    }),
    [actions.openCreate],
  );

  return (
    <>
      <div className="w-full h-[600px] md:h-[700px]">
        {/* TODO: Add a loading spinner based on isLoading */}
        <Calendar
          {...calendarConfig}
          events={events}
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          onSelectEvent={actions.openEdit}
          components={components}
        />
      </div>

      <EventModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        event={modal.selectedEvent}
        onClose={actions.close}
        onSubmit={actions.submit}
        onDelete={actions.remove}
      />
    </>
  );
}
