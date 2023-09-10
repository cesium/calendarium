import { useEffect, useState } from "react";

import * as fs from "fs";

import Head from "next/head";

import moment from "moment-timezone";

import { Calendar, Navigate, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Layout from "../components/Layout";
import EventModal from "../components/EventModal";
import styles from "../styles/Home.module.css";
import { IEventDTO } from "../dtos";
import { reduceOpacity, defaultColors } from "../utils/utils";
import { SubjectColor } from "../components/Settings/Settings";

export interface IFormatedEvent {
  title: string;
  place: string;
  link: string;
  start: Date;
  end: Date;
  groupId: number;
  filterId: number;
}

const localizer = momentLocalizer(moment);

export default function Home({ events, filters }) {
  // EVENT RELATED

  const configureDates = (event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);

    return event;
  };

  const [Events, setEvents] = useState<IFormatedEvent[]>(
    events.map(configureDates)
  );
  const [Filters, setFilters] = useState(filters);
  const [selectedEvent, setSelectedEvent] = useState<IEventDTO>(events[0]);
  const [inspectEvent, setInspectEvent] = useState<boolean>(false);

  const showNewEvents = (f) => {
    const filters = Object.values(f);
    let newEvents = [...events];

    if (filters.length > 0) {
      newEvents = newEvents.filter(
        (ev) => filters.includes(ev.filterId) || ev.filterId === -1
      ); // -1 is an id dedicated to always active events
    }

    setEvents(newEvents);
  };

  const handleFilters = (myFilters: number[]) => {
    const newFilters = { ...myFilters };
    setFilters(newFilters);
    showNewEvents(newFilters);
  };

  const handleSelection = (event) => {
    setSelectedEvent(event);
    setInspectEvent(!inspectEvent);
  };

  // THEMES

  const [theme, setTheme] = useState<string>("Modern");
  const [colors, setColors] = useState<string[]>(defaultColors);
  const [opacity, setOpacity] = useState<boolean>(true);
  const [subjectColors, setSubjectColors] = useState<SubjectColor[]>([]);
  const [customType, setCustomType] = useState<string>("Year");

  // note: returns the default color if it was not found in the subjectColors array
  function getSubjectColor(event: IFormatedEvent) {
    const color = subjectColors.find(
      (sc) => sc.filterId === event.filterId
    )?.color;
    return color ? color : defaultColors[event.groupId];
  }

  function getBgColor(event: IFormatedEvent) {
    let color: string = "#000000";

    if (theme === "Modern") color = reduceOpacity(defaultColors[event.groupId]);
    else if (theme === "Classic") color = defaultColors[event.groupId];
    else if (theme === "Custom") {
      if (customType === "Year") {
        opacity
          ? (color = reduceOpacity(colors[event.groupId]))
          : (color = colors[event.groupId]);
      } else if (customType === "Subject") {
        opacity
          ? (color = reduceOpacity(getSubjectColor(event)))
          : (color = getSubjectColor(event));
      }
    }

    return color;
  }

  function getTextColor(event: IFormatedEvent) {
    let color: string = "#000000";

    if (theme === "Modern") color = defaultColors[event.groupId];
    else if (theme === "Classic") color = "white";
    else if (theme === "Custom") {
      if (customType === "Year") {
        opacity ? (color = colors[event.groupId]) : (color = "white");
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
    const customType = localStorage.getItem("customType") ?? "Year";
    const subjectColors: SubjectColor[] =
      JSON.parse(localStorage.getItem("subjectColors")) ?? [];

    theme && setTheme(theme);

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

  useEffect(() => {
    saveTheme();
  }, []);

  // RELATED TO react-big-calendar

  const formats = {
    eventTimeRangeFormat: () => {
      return "";
    },
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HH\\h", culture).replace(/^0+/, ""),
  };

  const minDate = new Date();
  minDate.setHours(8, 0, 0);

  const maxDate = new Date();
  maxDate.setHours(20, 0, 0);

  const CustomToolbar = ({ label, onNavigate, onView }) => {
    const [activeView, setActiveView] = useState("month");

    const handleViewChange = (view) => {
      onView(view);
      setActiveView(view);
    };

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={() => onNavigate(Navigate.TODAY)}>
            <i className="bi bi-calendar3-event"></i>
          </button>
          <button type="button" onClick={() => onNavigate(Navigate.PREVIOUS)}>
            <i className="bi bi-caret-left-fill"></i>
          </button>
          <button type="button" onClick={() => onNavigate(Navigate.NEXT)}>
            <i className="bi bi-caret-right-fill"></i>
          </button>
        </span>
        <span className="rbc-toolbar-label">{label}</span>
        <span className="rbc-btn-group">
          <button
            type="button"
            className={activeView === "week" && "rbc-active"}
            onClick={() => handleViewChange("week")}
          >
            <i className="bi bi-calendar3-week"></i>
          </button>
          <button
            type="button"
            className={activeView === "month" && "rbc-active"}
            onClick={() => handleViewChange("month")}
          >
            <i className="bi bi-calendar3"></i>
          </button>
        </span>
      </div>
    );
  };

  return (
    <Layout
      isHome
      filters={filters}
      handleFilters={(myFilters) => handleFilters(myFilters)}
      saveTheme={saveTheme}
    >
      <div>
        <Head>
          <title>Events | Calendarium</title>
          <meta name="Calendarium" content="Calendar of events and exams" />
          <link rel="icon" href="/favicon-calendarium.ico" />
        </Head>

        <div id="APP" className={styles.calendar}>
          <Calendar
            className={styles.react_big_calendar}
            localizer={localizer}
            selected={selectedEvent}
            onSelectEvent={(event) => handleSelection(event)}
            defaultDate={new Date()}
            defaultView="month"
            views={["day", "week", "month"]}
            min={minDate}
            max={maxDate}
            eventPropGetter={(event: IFormatedEvent) => {
              const newStyle = {
                backgroundColor: getBgColor(event),
                color: getTextColor(event),
              };

              return { style: newStyle };
            }}
            formats={formats}
            dayLayoutAlgorithm={"no-overlap"}
            events={Events}
            components={{
              toolbar: CustomToolbar,
            }}
          />
        </div>

        <EventModal
          selectedEvent={selectedEvent}
          setInspectEvent={setInspectEvent}
          inspectEvent={inspectEvent}
        />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const filters = JSON.parse(fs.readFileSync("data/filters.json", "utf-8"));
  const events = JSON.parse(fs.readFileSync("data/events.json", "utf-8"));
  return {
    props: {
      events: events,
      filters: filters,
    },
  };
}
