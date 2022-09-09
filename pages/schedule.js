import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import path from "path";
import fsPromises from "fs/promises";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { Layout } from "../components/Layout";
import CheckBox from "../components/CheckBox";

const localizer = momentLocalizer(moment);

const mock = [
  {
    id: 12345,
    title: "Análise",
    theoretical: true,
    shift: "TP2",
    building: "7",
    room: "0.02",
    day: 1,
    start: "09:00",
    end: "11:00",
    filterId: 121,
  },
  {
    id: 12345,
    title: "Lógica",
    theoretical: true,
    shift: "TP2",
    building: "7",
    room: "0.02",
    day: 2,
    start: "09:00",
    end: "11:00",
    filterId: 124,
  },
];

export default function Schedule({ filters }) {
  const [events, setEvents] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const formats = useMemo(
    () => ({
      dayFormat: (date, _, localizer) => localizer.format(date, "ddd"),
    }),
    []
  );

  const formatEvents = useCallback(() => {
    const myMock = mock.filter((event) =>
      selectedFilters.includes(event.filterId)
    );

    const formatedEvents = myMock.map((mockEvent) => {
      const [startHour, startMinute] = mockEvent.start.split(":");
      const [endHour, endMinute] = mockEvent.end.split(":");

      return {
        ...mockEvent,
        title: `${mockEvent.title} ${mockEvent.shift} - Edf. ${mockEvent.building} Sala ${mockEvent.room}`,
        start: new Date(
          moment().day(mockEvent.day).hour(startHour).minute(startMinute)
        ),
        end: new Date(
          moment().day(mockEvent.day).hour(endHour).minute(endMinute)
        ),
      };
    });

    setEvents(formatedEvents);
  }, [selectedFilters]);

  useEffect(() => {
    formatEvents();
  }, [selectedFilters, formatEvents]);

  return (
    <Layout>
      <Head>
        <title>Schedule | Calendarium</title>
        <meta name="Calendarium" content="Calendar of events and exams" />
        <link rel="icon" href="/calendar-icon.ico" />~
      </Head>

      <div id="SCHEDULE">
        <Calendar
          toolbar={false}
          localizer={localizer}
          formats={formats}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          defaultDate={new Date()}
          min={new Date("08:00 2022/01/01")}
          max={new Date("21:00 2022/01/01")}
          style={{ height: "90vh" }}
        />
      </div>

      <div>
        <CheckBox
          filters={filters}
          handleFilters={(myFilters) => setSelectedFilters(myFilters)}
        />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const filterFilePath = path.join(process.cwd(), "data/filters.json");

  const filterData = await fsPromises.readFile(filterFilePath);

  const filters = JSON.parse(filterData);

  return {
    props: {
      filters,
    },
  };
}
