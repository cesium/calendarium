import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import path from "path";
import fsPromises from "fs/promises";

import { Layout } from "../components/Layout";
import CheckBox from "../components/CheckBox";

import { IFilterDTO, IShiftDTO } from "../dtos";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface IFormatedShift {
  id: number;
  title: string;
  theoretical: boolean;
  shift: string;
  building: string;
  room: string;
  day: number;
  start: Date;
  end: Date;
  filterId: number;
}

interface ISchedulesProps {
  filters: IFilterDTO[];
  shifts: IShiftDTO[];
}

export default function Schedule({ filters, shifts }: ISchedulesProps) {
  const [events, setEvents] = useState<IFormatedShift[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

  const formats = useMemo(
    () => ({
      dayFormat: (date, _, localizer) => localizer.format(date, "ddd"),
    }),
    []
  );

  const formatEvents = useCallback(() => {
    const filteredShifts = shifts.filter((event) =>
      selectedFilters.includes(event.filterId)
    );

    const formatedEvents = filteredShifts.map((mockEvent) => {
      const [startHour, startMinute] = mockEvent.start.split(":");
      const [endHour, endMinute] = mockEvent.end.split(":");

      return {
        ...mockEvent,
        title: `${mockEvent.title} ${mockEvent.shift} - Edf. ${mockEvent.building} Sala ${mockEvent.room}`,
        start: moment()
          .day(mockEvent.day)
          .hour(+startHour)
          .minute(+startMinute)
          .toDate(),
        end: moment()
          .day(mockEvent.day)
          .hour(+endHour)
          .minute(+endMinute)
          .toDate(),
      };
    });

    setEvents(formatedEvents);
  }, [shifts, selectedFilters]);

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

      <CheckBox
        filters={filters}
        handleFilters={(myFilters) => setSelectedFilters(myFilters)}
      />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // fetch filters
  const filterFilePath = path.join(process.cwd(), "data/filters.json");

  const filtersBuffer = await fsPromises.readFile(filterFilePath);
  const filters = JSON.parse(filtersBuffer as unknown as string);

  // fetch shitfs
  const shiftFilePath = path.join(process.cwd(), "data/shifts.json");

  const shiftsBuffer = await fsPromises.readFile(shiftFilePath);
  const shifts = JSON.parse(shiftsBuffer as unknown as string);

  return {
    props: {
      filters,
      shifts,
    },
  };
};
