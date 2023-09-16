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
import { reduceOpacity } from "../utils/utils";
import { SubjectColor } from "../components/Settings/Settings";
import { defaultColors } from "../utils/utils";

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

  const [theme, setTheme] = useState<string>("Modern");
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

    if (theme === "Modern") color = reduceOpacity(getDefaultColor(event));
    else if (theme === "Classic") color = getDefaultColor(event);
    else if (theme === "Custom") {
      if (customType === "Year") {
        opacity
          ? (color = reduceOpacity(colors[String(event.filterId)[0]]))
          : (color = colors[String(event.filterId)[0]]);
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

    if (theme === "Modern") color = getDefaultColor(event);
    else if (theme === "Classic") color = "white";
    else if (theme === "Custom") {
      if (customType === "Year") {
        opacity
          ? (color = colors[String(event.filterId)[0]])
          : (color = "white");
      } else if (customType === "Subject") {
        opacity ? (color = getSubjectColor(event)) : (color = "white");
      }
    }

    return color;
  }

  function saveTheme() {
    const theme = localStorage.getItem("theme");
    const colors = localStorage.getItem("colors");
    const opacity = localStorage.getItem("opacity");
    const customType = localStorage.getItem("customType");
    const subjectColors: SubjectColor[] =
      JSON.parse(localStorage.getItem("subjectColors")) ?? [];

    theme && setTheme(theme);
    !customType && localStorage.setItem("customType", "Subject");

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

  useEffect(() => {
    saveTheme();
  }, []);

  const minDate = new Date();
  minDate.setHours(8, 0, 0);

  const maxDate = new Date();
  maxDate.setHours(20, 0, 0);

  return (
    <Layout
      isHome={false}
      filters={filters}
      handleFilters={(myFilters) => {
        setSelectedFilters(myFilters);
      }}
      saveTheme={saveTheme}
    >
      <div>
        <Head>
          <title>Schedule | Calendarium</title>
          <meta name="description" content="Your weekly schedule." />
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
                backgroundColor: getBgColor(event),
                color: getTextColor(event),
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
