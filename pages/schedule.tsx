import React, { useCallback, useEffect, useMemo, useState } from "react";

import { GetStaticProps } from "next";
import Head from "next/head";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from "moment";
import path from "path";
import fsPromises from "fs/promises";

import ShiftModal from "../components/ShiftModal";
import Layout from "../components/Layout";
import { IFilterDTO, IShiftDTO } from "../dtos";

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
  const [selectedShift, setSelectedShift] = useState<IShiftDTO>(shifts[0]);
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
      timeGutterFormat: (date, culture, localizer) =>
        localizer.format(date, "h A", culture).replace(/^0+/, ""),
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
      const filter = filters.find((filter) => filter.id === shift.filterId);

      return {
        ...shift,
        title: `${filter.name} - ${shift.shift}`,
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

  const minDate = new Date();
  minDate.setHours(8, 0, 0);

  const maxDate = new Date();
  maxDate.setHours(20, 0, 0);

  function reduceOpacity(hexColor) {
    // Convert HEX color code to RGBA color code
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);
    let a = 0.25; // 25% opacity
    let rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

    return rgbaColor;
  }

  return (
    <Layout
      isHome={false}
      filters={filters}
      handleFilters={(myFilters) => {
        setSelectedFilters(myFilters);
      }}
    >
      <div>
        <Head>
          <title>Schedule | Calendarium</title>
          <meta name="Calendarium" content="Calendar of events and exams" />
          <link rel="icon" href="/favicon-calendarium.ico" />~
        </Head>

        <div id="SCHEDULE" className={styles.schedule}>
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
                border: "0.2rem solid white",
                backgroundColor: event.theoretical
                  ? reduceOpacity("#ed7950")
                  : reduceOpacity("#c65932"),
                color: event.theoretical ? "#ed7950" : "#c65932",
                fontWeight: "500",
                padding: "0.5rem",
                borderRadius: "12px",
              };

              return { style: newStyle };
            }}
            formats={formats}
            dayLayoutAlgorithm={"overlap"}
            events={events}
            className={styles.schedule_style}
          />
          <div
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              marginTop: "0.5rem",
              paddingBottom: "1rem",
            }}
          >
            <b>Fonte:</b>{" "}
            <a href="https://alunos.uminho.pt/pt/estudantes/paginas/infouteishorarios.aspx">
              Horários UMinho
            </a>
          </div>
        </div>

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
