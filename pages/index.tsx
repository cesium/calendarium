import { useEffect, useState, useCallback } from "react";

import * as fs from "fs";

import Head from "next/head";

import moment from "moment-timezone";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Layout from "../components/Layout";
import EventModal from "../components/EventModal";
import CustomToolbar from "../components/CustomToolbar";
import styles from "../styles/events.module.css";
import { IEventDTO } from "../dtos";
import { reduceOpacity, defaultColors, mergeColors } from "../utils";
import { SubjectColor } from "../types";

const localizer = momentLocalizer(moment);

const edKey = "eventData";
const luKey = "lastUpdateEvents";

// Fetch event data using the API
async function getData(): Promise<IEventDTO[]> {
  const response = await fetch(`/api/transfer/events`);
  const data = await response.text();
  const events: IEventDTO[] = JSON.parse(data);
  return events;
}

export default function Home({ filters }) {
  // EVENT RELATED

  const [fetchedEvents, setFetchedEvents] = useState<IEventDTO[]>([]); // events fetched from the API
  const [events, setEvents] = useState<IEventDTO[]>([]); // events to be displayed
  const [Filters, setFilters] = useState(filters);
  const [selectedEvent, setSelectedEvent] = useState<IEventDTO>(events[0]);
  const [inspectEvent, setInspectEvent] = useState<boolean>(false);

  const configureDates = (events: IEventDTO[]) => {
    events.forEach((event) => {
      event.start = new Date(event.start);
      event.end = new Date(event.end);
    });
    return events;
  };

  // Fetch event data
  const handleData = useCallback(async (update: boolean = false) => {
    // fetch data from localStorage if it exists
    const localData = localStorage.getItem(edKey);

    // fetch last update date
    let lastUpdate: Date = new Date(localStorage.getItem(luKey)) || new Date(); // current date if lastUpdate is null
    const now: Date = new Date();
    const diff: number = now.getTime() - lastUpdate.getTime(); // difference in milliseconds
    const diffMin: number = diff / (1000 * 60); // difference in minutes

    let data: IEventDTO[];

    // only fetch data if it's been more than 60 minutes since last update
    // or if there is no data in localStorage
    if (!localData || diffMin >= 60 || update) {
      data = await getData();
      localStorage.setItem(edKey, JSON.stringify(data));
      localStorage.setItem(
        luKey,
        moment(new Date()).format("YYYY-MM-DD HH:mm")
      );
    } else {
      data = JSON.parse(localData);
    }

    // update events
    setFetchedEvents(configureDates(data));
    /* update events to be displayed
     *
     * because handleData() is async, the first call to handleFilters() made by EventFilters when the page is loaded
     * will occur before the events are fetched (handleData() finishes executing), so the events will be empty
     *
     * to fix this, we need to make sure to update the events that need to be displayed after the events are fetched.
     * also, we can't rely on the "Filters" value that was set on the first call to handleFilters(), because its value was
     * empty ([]) when handleData() was called, and that's the value that handleData() knows.
     *
     * this is why we go to the localStorage, which is normally the responsibility of EventFilters.
     */
    const stored: number[] = JSON.parse(localStorage.getItem("checked")) ?? [];
    let newEvents = [...data];
    if (stored.length > 0) {
      newEvents = newEvents.filter(
        (ev) => stored.includes(ev.filterId) || ev.filterId === -1
      ); // -1 is an id dedicated to always active events
    }
    setEvents(newEvents);
  }, []);

  useEffect(() => {
    handleData();
  }, [handleData]);

  const handleFilters = useCallback(
    (myFilters: number[]) => {
      const showNewEvents = (f) => {
        const filters = Object.values(f);

        let newEvents = [...fetchedEvents];

        if (filters.length > 0) {
          newEvents = newEvents.filter(
            (ev) => filters.includes(ev.filterId) || ev.filterId === -1
          ); // -1 is an id dedicated to always active events
        }

        setEvents(newEvents);
      };

      const newFilters = { ...myFilters };
      setFilters(newFilters);
      showNewEvents(newFilters);
    },
    [fetchedEvents]
  );

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
  function getSubjectColor(event: IEventDTO) {
    const color = subjectColors.find(
      (sc) => sc.filterId === event.filterId
    )?.color;
    return color ? color : defaultColors[event.groupId];
  }

  function getBgColor(event: IEventDTO) {
    let color: string = "#000000";

    if (theme === "Modern") color = reduceOpacity(defaultColors[event.groupId]);
    else if (theme === "Classic") color = defaultColors[event.groupId];
    else if (theme === "Custom") {
      if (customType === "Year") {
        opacity
          ? (color = reduceOpacity(
              colors[event.groupId] ?? defaultColors[event.groupId]
            ))
          : (color = colors[event.groupId] ?? defaultColors[event.groupId]);
      } else if (customType === "Subject") {
        opacity
          ? (color = reduceOpacity(getSubjectColor(event)))
          : (color = getSubjectColor(event));
      }
    }

    return color;
  }

  function getTextColor(event: IEventDTO) {
    let color: string = "#000000";

    if (theme === "Modern") color = defaultColors[event.groupId];
    else if (theme === "Classic") color = "white";
    else if (theme === "Custom") {
      if (customType === "Year") {
        opacity
          ? (color = colors[event.groupId] ?? defaultColors[event.groupId])
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
    const customType = localStorage.getItem("customType") ?? "Year";
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

    setTheme(theme);
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

  return (
    <Layout
      isHome
      filters={filters}
      handleFilters={handleFilters}
      saveTheme={saveTheme}
    >
      <Head>
        <title>Events | Calendarium</title>
        <meta name="description" content="Your exams, due dates and more." />
        <link rel="icon" href="/favicon-calendarium.ico" />
      </Head>
      <div id="events" className="h-full">
        <Calendar
          className={styles.calendar}
          localizer={localizer}
          selected={selectedEvent}
          onSelectEvent={(event) => handleSelection(event)}
          defaultDate={new Date()}
          defaultView="month"
          views={["week", "month", "day"]}
          min={minDate}
          max={maxDate}
          eventPropGetter={(event: IEventDTO) => {
            const newStyle = {
              backgroundColor: getBgColor(event),
              color: getTextColor(event),
            };

            return { style: newStyle };
          }}
          formats={formats}
          dayLayoutAlgorithm={"no-overlap"}
          events={events}
          components={{
            toolbar: CustomToolbar,
          }}
        />

        <footer className="mt-2 font-display text-sm">
          <button
            className="transition-colors hover:text-blue-500"
            onClick={() => handleData(true)}
            title="Sync event data (updates every hour)"
            data-umami-event="sync-button"
          >
            <i className="bi bi-arrow-repeat" />
          </button>
          {" · "}
          <span className="font-medium">Something missing?</span> Help us{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfpk0mJowLtjPdJo99NOVDD5G8IX0UPMWOO6g5ngJ1gZNMsqQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-blue-500 hover:underline"
            data-umami-event="event-missing-button"
          >
            add it
          </a>
        </footer>
      </div>
      {selectedEvent && (
        <EventModal
          selectedEvent={selectedEvent}
          setInspectEvent={setInspectEvent}
          inspectEvent={inspectEvent}
        />
      )}
    </Layout>
  );
}

export const getStaticProps = async () => {
  const filters = JSON.parse(fs.readFileSync("data/filters.json", "utf-8"));

  return {
    props: {
      filters: filters,
    },
  };
};
