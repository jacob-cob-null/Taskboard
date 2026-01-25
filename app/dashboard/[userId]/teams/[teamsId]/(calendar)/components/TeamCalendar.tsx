"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { events } from "./data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-custom.css";
import OnSelectEvent from "./OnSelectEvent";
import CalendarToolbar from "./CalendarToolbar";
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
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  // Set initial view based on screen size, but allow user to switch afterwards
  useEffect(() => {
    if (window.innerWidth < 768) {
      setView("agenda");
    }
  }, []);

  return (
    <div className="w-full h-[600px] md:h-[700px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        view={view}
        onNavigate={(newDate) => setDate(newDate)}
        onView={(newView) => setView(newView)}
        onSelectEvent={(event) => OnSelectEvent({ event })}
        components={{
          toolbar: CalendarToolbar,
        }}
        views={["month", "week", "day", "agenda"]}
        popup
      />
    </div>
  );
}

export default TeamCalendar;
