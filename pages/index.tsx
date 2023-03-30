import { useState } from "react";

import * as fs from "fs";

import Head from "next/head";

import moment from "moment-timezone";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Layout from "../components/Layout";
import EventModal from "../components/EventModal";

import styles from "../styles/Home.module.css";

const localizer = momentLocalizer(moment);

export default function Home({ events, filters }) {
  const configureDates = (event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);

    return event;
  };

  const [Events, setEvents] = useState(events.map(configureDates));
  const [Filters, setFilters] = useState(filters);
  const [selectedEvent, setSelectedEvent] = useState<{
    title;
    place;
    start;
    end;
    groupId;
  }>(events[0]);
  const [inspectEvent, setInspectEvent] = useState(false);

  const showNewEvents = (f) => {
    const filters = Object.values(f);
    let newEvents = [...events];

    if (filters.length > 0) {
      newEvents = newEvents.filter((ev) => filters.includes(ev.filterId));
    }

    setEvents(newEvents);
  };

  const handleFilters = (myFilters) => {
    const newFilters = { ...myFilters };
    setFilters(newFilters);
    showNewEvents(newFilters);
  };

  const handleSelection = (event) => {
    setSelectedEvent(event);
    setInspectEvent(!inspectEvent);
  };

  const colors = [
    "#f07c54",
    "#f0c954",
    "#7b54f0",
    "#f0547b",
    "#5ac77b",
    "#5532a8",
    "#b70a0a",
    "#3408fd",
    "#642580",
    "#FF0000",
    "#1B69EE",
  ];

  const formats = {
    eventTimeRangeFormat: () => {
      return "";
    },
  };

  return (
    <Layout
      isHome
      filters={filters}
      handleFilters={(myFilters) => handleFilters(myFilters)}
    >
      <div>
        <Head>
          <title>Events | Calendarium</title>
          <meta name="Calendarium" content="Calendar of events and exams" />
          <link rel="icon" href="/favicon-calendarium.ico" />
        </Head>

        <div id="APP" className={styles.calendar}>
          <Calendar
            localizer={localizer}
            selected={selectedEvent}
            onSelectEvent={(event) => handleSelection(event)}
            defaultDate={new Date()}
            defaultView="month"
            views={["day", "week", "month"]}
            eventPropGetter={(event: { title; start; end; groupId }) => {
              const newStyle = {
                backgroundColor: colors[event.groupId],
                fontWeight: "500",
                borderRadius: "10px",
                border: "2px solid white",
              };

              return { style: newStyle };
            }}
            formats={formats}
            events={Events}
            style={{ fontFamily: "Inter" }}
          />
        </div>

        {inspectEvent && (
          <EventModal
            selectedEvent={selectedEvent}
            setInspectEvent={setInspectEvent}
            inspectEvent={inspectEvent}
          />
        )}
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
