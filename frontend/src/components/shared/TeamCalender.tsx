import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format: ((date: Date, fmt?: string) => format(date, fmt || "P")) as any,
  parse: ((value: string, fmt?: string) => parse(value, fmt || "P", new Date())) as any,
  startOfWeek,
  getDay,
  locales,
});

export default function TeamCalendar() {
  const [date] = useState(new Date());
  return (
    <div style={{ height: 500 }}>
      <Calendar localizer={localizer} events={[]} startAccessor="start" endAccessor="end" date={date} onNavigate={() => {}} />
    </div>
  );
}
