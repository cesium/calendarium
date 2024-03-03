import React, { useCallback, useEffect, useMemo, useState } from "react";

import Head from "next/head";

import * as fs from "fs";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from "moment";

import ShiftModal from "../components/ShiftModal";
import Layout from "../components/Layout";
import { IFilterDTO, IShiftDTO } from "../dtos";
import { reduceOpacity, defaultColors, mergeColors } from "../utils";
import { SubjectColor } from "../types";

import styles from "../styles/schedule.module.css";

import { useTheme } from "next-themes";

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

  // THEMES

  const [colorTheme, setColorTheme] = useState<string>("Modern");
  const [colors, setColors] = useState<string[]>(defaultColors);
  const [opacity, setOpacity] = useState<boolean>(true);
  const [subjectColors, setSubjectColors] = useState<SubjectColor[]>([]);
  const [customType, setCustomType] = useState<string>("Year");

  function getDefaultColor(event: IFormatedShift) {
    return defaultColors[String(event.filterId)[0]];
  }

  // note: returns the default color if it was not found in the subjectColors array
  function getSubjectColor(event: IFormatedShift) {
    const color = subjectColors.find(
      (sc) => sc.filterId === event.filterId
    )?.color;
    return color ? color : getDefaultColor(event);
  }

  function getBgColor(event: IFormatedShift) {
    let color: string = "#000000";

    if (colorTheme === "Modern") color = reduceOpacity(getDefaultColor(event));
    else if (colorTheme === "Classic") color = getDefaultColor(event);
    else if (colorTheme === "Custom") {
      if (customType === "Year") {
        opacity
          ? (color = reduceOpacity(colors[String(event.filterId)[0]] ?? getDefaultColor(event)))
          : (color = colors[String(event.filterId)[0]] ?? getDefaultColor(event));
      } else if (customType === "Subject") {
        opacity
          ? (color = reduceOpacity(getSubjectColor(event)))
          : (color = getSubjectColor(event));
      }
    }

    return color;
  }

  function getTextColor(event: IFormatedShift) {
    let color: string = "#000000";

    if (colorTheme === "Modern") color = getDefaultColor(event);
    else if (colorTheme === "Classic") color = "white";
    else if (colorTheme === "Custom") {
      if (customType === "Year") {
        opacity
          ? (color = colors[String(event.filterId)[0]] ?? getDefaultColor(event))
          : (color = "white");
      } else if (customType === "Subject") {
        opacity ? (color = getSubjectColor(event)) : (color = "white");
      }
    }

    return color;
  }

  function saveTheme() {
    let theme = localStorage.getItem("theme");
    const colors = localStorage.getItem("colors");
    const opacity = localStorage.getItem("opacity");
    const customType = localStorage.getItem("customType");
    const subjectColors: SubjectColor[] =
      JSON.parse(localStorage.getItem("subjectColors")) ?? [];

    // error proof checks
    colors &&
      colors.split(",").length !== defaultColors.length &&
      localStorage.setItem("colors", mergeColors(colors.split(",")).join(","));
    !theme && localStorage.setItem("theme", "Modern");
    !customType && localStorage.setItem("customType", "Subject");

    if (theme !== "Modern" && theme !== "Classic" && theme !== "Custom") {
      localStorage.setItem("theme", "Modern");
      theme = "Modern";
    }

    setColorTheme(theme);
    if (theme === "Custom") {
      setCustomType(customType);

      switch (customType) {
        case "Year": {
          colors ? setColors(colors.split(",")) : setColors(defaultColors);
          opacity ? setOpacity(opacity === "true") : setOpacity(true);
          break;
        }
        case "Subject": {
          opacity ? setOpacity(opacity === "true") : setOpacity(true);
          subjectColors && setSubjectColors(subjectColors);
          break;
        }
      }
    }
  }

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
  }, [shifts, selectedFilters]);

  useEffect(() => {
    formatEvents();
  }, [selectedFilters, formatEvents]);

  useEffect(() => {
    saveTheme();
  }, []);

  const minDate = new Date();
  minDate.setHours(8, 0, 0);

  const maxDate = new Date();
  maxDate.setHours(20, 0, 0);

  const { resolvedTheme } = useTheme();

  return (
    <Layout
      isHome={false}
      filters={filters}
      handleFilters={(myFilters) => {
        setSelectedFilters(myFilters);
      }}
      saveTheme={saveTheme}
    >
      <div className="h-full">
        <Head>
          <title>Schedule | Calendarium</title>
          <meta name="description" content="Your weekly schedule." />
          <link rel="icon" href="/favicon-calendarium.ico" />~
        </Head>

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
              border:
                "2px solid " + (resolvedTheme === "dark" ? "#171717" : "white"),
              backgroundColor: getBgColor(event),
              color: getTextColor(event),
              fontWeight: "500",
              padding: "0.5rem",
              borderRadius: "12px",
            };

            return { style: newStyle };
          }}
          formats={formats}
          dayLayoutAlgorithm={"no-overlap"}
          events={events}
          className={styles.schedule}
        />

        <div className="mt-2 font-display text-sm">
          <b>Source:</b>{" "}
          <a
            href="https://alunos.uminho.pt/pt/estudantes/paginas/infouteishorarios.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:text-blue-500 hover:underline"
          >
            Horários UMinho <i className="bi bi-box-arrow-up-right" />
          </a>
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
