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

const localizer = momentLocalizer(moment);

export default function Home({ events, filters }) {
  const configureDates = (event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);

    return event;
  };

  const [Events, setEvents] = useState(events.map(configureDates));
  const [Filters, setFilters] = useState(filters);
  const [selectedEvent, setSelectedEvent] = useState<IEventDTO>(events[0]);
  const [inspectEvent, setInspectEvent] = useState<boolean>(false);

  const defaultColors = [
    "#f07c54", // cesium
    "#4BC0D9", // 1st year
    "#7b54f0", // 2nd year
    "#f0547b", // 3rd year
    "#5ac77b", // 4th year
    "#395B50", // 5th year
    "#b70a0a", // uminho
    "#3408fd", // sei
    "#642580", // coderdojo
    "#FF0000", // join
    "#1B69EE", // jordi
  ];

  const [theme, setTheme] = useState<string>("Modern");
  const [colors, setColors] = useState<string[]>(defaultColors);
  const [opacity, setOpacity] = useState<boolean>(true);

  function reduceOpacity(hexColor) {
    // Convert HEX color code to RGBA color code
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);
    let a = 0.25; // 25% opacity
    let rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

    return rgbaColor;
  }

  function saveTheme() {
    const theme = localStorage.getItem("theme");
    const colors = localStorage.getItem("colors");
    const opacity = localStorage.getItem("opacity");

    switch (theme) {
      case "Modern": {
        setColors(defaultColors);
        setOpacity(true);
        break;
      }
      case "Classic": {
        setColors(defaultColors);
        setOpacity(false);
        break;
      }
      case "Custom": {
        setColors(colors.split(","));
        setOpacity(opacity === "true");
        break;
      }
    }
  }

  useEffect(() => {
    saveTheme();
  }, []);

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

  const formats = {
    eventTimeRangeFormat: () => {
      return "";
    },
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "h A", culture).replace(/^0+/, ""),
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
            eventPropGetter={(event: { title; start; end; groupId }) => {
              const newStyle = {
                backgroundColor: opacity
                  ? reduceOpacity(colors[event.groupId])
                  : colors[event.groupId],
                color: opacity ? colors[event.groupId] : "white",
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
  //Refer to the above comment
  const filters = JSON.parse(fs.readFileSync("data/filters.json", "utf-8"));
  const events = JSON.parse(fs.readFileSync("data/events.json", "utf-8"));
  return {
    props: {
      events: events,
      filters: filters,
    },
  };
}
