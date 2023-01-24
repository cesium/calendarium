import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import path from "path";
import fsPromises from "fs/promises";
import FeedbackForm from "../components/FeedbackForm";
import EventModalShift from "../components/EventModalShift";

import Layout from "../components/Layout";
import { SelectSchedule } from "../components/SelectSchedule";

import { IFilterDTO, IShiftDTO } from "../dtos";

import "react-big-calendar/lib/css/react-big-calendar.css";

import styles from "../styles/schedule.module.css";

const localizer = momentLocalizer(moment);

interface IFormatedShift {
  id: number;
  title: string;
  theoretical: boolean;
  shift?: string;
  building: string;
  room: string;
  day: number;
  start: Date;
  end: Date;
  filterId: number;
}

interface ISelectedFilter {
  id: number;
  shift?: string;
}

interface ISchedulesProps {
  filters: IFilterDTO[];
  shifts: IShiftDTO[];
}

export default function Schedule({ filters, shifts }: ISchedulesProps) {
  const [events, setEvents] = useState<IFormatedShift[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilter[]>([]);
  const [selectedShift, setSelectedShift] = useState<{
    id: number;
    title: string;
    theoretical: boolean;
    shift: string;
    building: string;
    room: string;
    day: number;
    start: string;
    end: string;
    filterId: number;
  }>(shifts[0]);
  const [inspectShift, setInspectShift] = useState(false);

  const handleSelection = (shift) => {
    setSelectedShift(shift);
    setInspectShift(!inspectShift);
  };

  const formats = useMemo(
    () => ({
      dayFormat: (date, _, localizer) => localizer.format(date, "ddd"),
      eventTimeRangeFormat: () => {
        return "";
      },
    }),
    []
  );

  const formatEvents = useCallback(() => {
    const filteredShifts = shifts.filter((shift) => {
      const findFilter = selectedFilters.find(
        (filter) => filter.id === shift.filterId && filter.shift === shift.shift
      );

      return !!findFilter;
    });

    const formatedEvents = filteredShifts.map((shift) => {
      const [startHour, startMinute] = shift.start.split(":");
      const [endHour, endMinute] = shift.end.split(":");

      return {
        ...shift,
        title: `${shift.title} - ${shift.shift} I ${
          shift.building.includes("CP") ? "" : "Ed."
        } ${shift.building} - ${shift.room}`,
        start: moment()
          .day(shift.day + 1)
          .hour(+startHour)
          .minute(+startMinute)
          .toDate(),
        end: moment()
          .day(shift.day + 1)
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
        <link rel="icon" href="/favicon-calendarium.ico" />~
      </Head>

      <div className={styles.filters}>
        <SelectSchedule
          filters={filters}
          handleFilters={(myFilters) => {
            console.log(myFilters);
            setSelectedFilters(myFilters);
          }}
        />
      </div>

      <div id="SCHEDULE" className={styles.schedule}>
        <Calendar
          toolbar={false}
          localizer={localizer}
          formats={formats}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={"work_week"}
          views={["day", "work_week"]}
          defaultDate={new Date()}
          min={new Date("08:00 2022/01/01")}
          max={new Date("20:00 2022/01/01")}
          onSelectEvent={(shift) => handleSelection(shift)}
          className={styles.schedule_style}
          eventPropGetter={(event) => {
            const newStyle = {
              border: "0.2rem solid white",
              backgroundColor: event.theoretical ? "var(--orange)" : "#c65932",
              fontWeight: "500",
              padding: "0.5rem",
              borderRadius: "12px",
            };

            return { style: newStyle };
          }}
        />
      </div>

      {inspectShift && (
        <EventModalShift
          selectedShift={selectedShift}
          setInspectShift={setInspectShift}
        />
      )}

      <FeedbackForm />
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
