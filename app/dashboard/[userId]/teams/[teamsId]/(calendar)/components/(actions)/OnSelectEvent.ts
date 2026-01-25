import { CalendarEvent } from "@/lib/calendar-utils";

export default function OnSelectEvent({ event }: { event: CalendarEvent }) {
  console.log(event);
}
