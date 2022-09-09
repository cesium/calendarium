import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const colors = {
  Análise: "#b70a0a",
  Lógica: "#f0c954",
};

export default function Schedule() {
  const [events, setEvents] = useState([]);

  const formatEvents = () => {
    const mock = [
      {
        id: 12345,
        title: "Análise",
        theoretical: true,
        shift: "TP2",
        building: "7",
        room: "0.02",
        day: 0,
        start: "09:00",
        end: "11:00",
      },
      {
        id: 12345,
        title: "Lógica",
        theoretical: true,
        shift: "TP2",
        building: "7",
        room: "0.02",
        day: 1,
        start: "09:00",
        end: "11:00",
      },
    ];

    const formatedEvents = mock.map((mockEvent) => {
      const [startHour, startMinute] = mockEvent.start.split(":");
      const [endHour, endMinute] = mockEvent.end.split(":");

      return {
        ...mockEvent,
        start: new Date(
          moment().day(mockEvent.day).hour(startHour).minute(startMinute)
        ),
        end: new Date(
          moment().day(mockEvent.day).hour(endHour).minute(endMinute)
        ),
      };
    });

    setEvents(formatedEvents);
  };

  useEffect(() => {
    formatEvents();
  }, []);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        style={{ height: "90vh" }}
        defaultDate={new Date()}
        toolbar={false}
        min={new Date("08:00 2022/01/01")}
        max={new Date("21:00 2022/01/01")}
        // onNavigate={(newDate) => updateEvents(newDate)}
        //
        //Custom event colors by their year (groupID)
        eventPropGetter={(event) => {
          const style = {
            backgroundColor: colors[event.title],
            border: "none",
          };

          return { style };
        }}
      />
    </div>
  );
}
