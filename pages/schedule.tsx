import React, { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useTheme } from "next-themes";
import * as fs from "fs";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ShiftModal from "../components/ShiftModal";
import Layout from "../components/Layout";
import { IFilterDTO, IShiftDTO, ISelectedFilterDTO } from "../dtos";
import useColorTheme from "../hooks/useColorTheme";
import styles from "../styles/schedule.module.css";

const localizer = momentLocalizer(moment);

export interface IFormatedShift {
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
  // EVENT RELATED

  const [events, setEvents] = useState<IFormatedShift[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilterDTO[]>(
    []
  );
  const [selectedShift, setSelectedShift] = useState<IShiftDTO>(shifts[0]);
  const [inspectShift, setInspectShift] = useState(false);

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
      const filter = filters.find((filter) => filter.id === shift.filterId);

      return {
        ...shift,
        title: `${filter.name} - ${shift.shift}`,
        start: moment()
          .day(shift.day + 1)
          .hour(+startHour)
          .minute(+startMinute)
          .toDate(),
        /* (*) we're subtracting 1 minute here to solve an issue that occurs when
         * the end time of an event is equal to the start time of another.
         * this issue causes the event bellow to think it is overlaping with the top one,
         * when the `dayLayoutAlgorithm` is set to `no-overlap`.
         */
        end: moment()
          .day(shift.day + 1)
          .hour(+endHour)
          .minute(+endMinute - 1) // (*)
          .toDate(),
      };
    });

    setEvents(formatedEvents);
  }, [shifts, selectedFilters, filters]);

  const handleFilters = useCallback((myFilters: ISelectedFilterDTO[]) => {
    setSelectedFilters(myFilters);
  }, []);

  const handleSelection = (shift) => {
    setSelectedShift(shift);
    setInspectShift(!inspectShift);
  };

  // THEMES

  const { fetchTheme, getBgColor, getTextColor } = useColorTheme(filters);

  // INITIALIZATION

  useEffect(() => {
    formatEvents();
  }, [selectedFilters, formatEvents]);

  // RELATED TO react-big-calendar

  const formats = useMemo(
    () => ({
      dayFormat: (date, _, localizer) => localizer.format(date, "ddd"),
      eventTimeRangeFormat: () => {
        return "";
      },
      timeGutterFormat: (date, culture, localizer) =>
        localizer.format(date, "HH\\h", culture).replace(/^0+/, ""),
    }),
    []
  );

  const minDate = new Date();
  minDate.setHours(8, 0, 0);

  const maxDate = new Date();
  maxDate.setHours(20, 0, 0);

  return (
    <Layout
      isEvents={false}
      filters={filters}
      handleFilters={handleFilters}
      fetchTheme={fetchTheme}
    >
      <Head>
        <title>Schedule | Calendarium</title>
        <meta name="description" content="Your weekly schedule." />
        <link rel="icon" href="/favicon-calendarium.ico" />
      </Head>
      <div className="h-full pt-4 sm:pt-6 md:pt-0">
        <Calendar
          toolbar={false}
          localizer={localizer}
          selected={selectedShift}
          onSelectEvent={(shift) => handleSelection(shift)}
          defaultDate={new Date()}
          defaultView={"work_week"}
          views={["work_week"]}
          min={minDate}
          max={maxDate}
          eventPropGetter={(event) => {
            const newStyle = {
              backgroundColor: getBgColor(event),
              color: getTextColor(event),
            };

            return { style: newStyle };
          }}
          formats={formats}
          dayLayoutAlgorithm={"no-overlap"}
          events={events}
          className={styles.schedule}
        />
        <ShiftModal
          selectedShift={selectedShift}
          setInspectShift={setInspectShift}
          inspectShift={inspectShift}
          shifts={shifts}
        />
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  // fetch filters
  const filters = JSON.parse(fs.readFileSync("data/filters.json", "utf-8"));

  // fetch shitfs
  const shifts = JSON.parse(fs.readFileSync("data/shifts.json", "utf-8"));

  return {
    props: {
      filters,
      shifts,
    },
  };
};
