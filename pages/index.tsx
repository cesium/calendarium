import { useEffect, useState } from "react";

import * as fs from "fs";

import Head from "next/head";

import moment from "moment-timezone";

import { Calendar, Navigate, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Layout from "../components/Layout";
import EventModal from "../components/EventModal";
import styles from "../styles/events.module.css";
import { IEventDTO } from "../dtos";
import { reduceOpacity, defaultColors } from "../utils";
import { SubjectColor } from "../types";

import { google, sheets_v4 } from "googleapis";

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
    let theme = localStorage.getItem("theme");
    const colors = localStorage.getItem("colors");
    const opacity = localStorage.getItem("opacity");
    const customType = localStorage.getItem("customType") ?? "Year";
    const subjectColors: SubjectColor[] =
      JSON.parse(localStorage.getItem("subjectColors")) ?? [];

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
          <meta name="description" content="Your exams, due dates and more." />
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
          <div
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              marginTop: "0.5rem",
              paddingBottom: "1rem",
            }}
          >
            <text className="font-bold">Something missing?</text> Help us add it{" "}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfpk0mJowLtjPdJo99NOVDD5G8IX0UPMWOO6g5ngJ1gZNMsqQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-blue-500 hover:underline"
            >
              here
            </a>
          </div>
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

async function getEvents(sheets: sheets_v4.Sheets): Promise<IEventDTO[]> {
  const range = "Eventos!A2:I999";
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  let events: IEventDTO[] = [];
  const rows: string[][] = response.data.values;
  if (rows.length) {
    /* Look, Netlify has some freaking problem with daylight savings, and it just won't get the Europe/Lisbon DST right.
     * That said, the following code manually fixes what Netlify messes up, by pretty much checking if the dates are
     * between the DST period for Portugal (manually set bellow) and, if so, subtracting 1 hour from the date.
     *
     * Is this optimal? No. Have I tried to fix it in a better way? Yes. Did I succeed? No.
     *
     * Do we need to update the DST period every year? Yes. Is it a big deal? No.
     *
     * Do I give up fixing this issue? Yes.
     *
     * If you have a better solution, please, PLEASE, let me know.
     * */

    // check if the date is between the DST period for Portugal, and if so, subtract 1 hour
    const fixDST = (date: Date) => {
      date.getTime() > dstStart.getTime() &&
        date.getTime() < dstEnd.getTime() &&
        date.setHours(date.getHours() - 1);
      return date;
    };

    // convert a date to a string in the format "YYYY-MM-DD HH:MM"
    // no, there isn't a js function that converts Date to String in this format
    const dateToString = (date: Date) => {
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
      );
    };

    // DST period for Portugal, current: 26/03/2023 - 29/10/2023
    const dstStart = new Date(new Date().getFullYear(), 2, 26);
    const dstEnd = new Date(new Date().getFullYear(), 9, 29);

    events = rows.map((row: string[]) => {
      // dates that will ultimatly be passed into `events`
      let startString: string = undefined;
      let endString: string = undefined;

      // check if the date rows exist in the first place, before messing with them
      if (row[3] && row[4] && row[5] && row[6]) {
        // auxiliary variables needed to perform operations on Date objects
        let start: Date = new Date(row[3] + " " + row[4]);
        let end: Date = new Date(row[5] + " " + row[6]);

        // fix DST if necessary
        start = fixDST(start);
        end = fixDST(end);

        // convert the dates back to strings.
        // this is needed because the contents of `events` need to be serializable, and Date objects are not
        // they need to be serialized because of `getServerSideProps()`
        startString = dateToString(start);
        endString = dateToString(end);
      }

      /* The End. */

      return {
        title: row[0] ?? undefined,
        place: row[1] ?? undefined,
        link: row[2] ?? undefined,
        start: startString,
        end: endString,
        groupId: row[7] ? parseInt(row[7]) : undefined,
        filterId: row[8] ? parseInt(row[8]) : undefined,
      };
    });

    return events.filter(
      (e) => e.title && e.start && e.end && e.groupId && e.filterId
    ); // filter out invalid/incomplete events
  }
}

export async function getServerSideProps() {
  const target = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
  const jwt = new google.auth.JWT(
    process.env.GS_CLIENT_EMAIL,
    null,
    (process.env.GS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    target
  );
  const sheets = google.sheets({ version: "v4", auth: jwt });

  const events = await getEvents(sheets);

  const filters = JSON.parse(fs.readFileSync("data/filters.json", "utf-8"));

  return {
    props: {
      events: events,
      filters: filters,
    },
  };
}
