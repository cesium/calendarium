import { useState } from "react";
import * as fs from "fs";
import FeedbackForm from "../components/FeedbackForm";
import Head from "next/head";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";

import styles from "../styles/Home.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Layout from "../components/Layout";
import CheckBox from "../components/CheckBox";
import EventModal from "../components/EventModal";

const localizer = momentLocalizer(moment);

export default function Home({ events, filters }) {
  /*
  We set the timezone to UTC. This needs to be done
  because react-big-calendar displays the times in
  local time, but in the json they are read in UTC. 
  
  So if the json says an event is from
  14:00 to 16:00, if we are in France in the summer
  it would display from 16:00 to 18:00
  
  We don't want that, we always want
  the same result no matter the timezone.

  Bamako is the capital of Mali, which is in UTC and
  (very important) does not implement day light savings

  Refer to https://github.com/cesium/calendarium/pull/39
  */
  moment.tz.setDefault("Africa/Bamako");

  const configureDates = (event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);

    return event;
  };

  const [Events, setEvents] = useState(events.map(configureDates));
  const [Filters, setFilters] = useState(filters);
  const [selectedEvent, setSelectedEvent] = useState<{
    title;
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
  ];

  return (
    <Layout isHome>
      <div className="Home">
        <div className={styles.container}>
          <Head>
            <title>Home | Calendarium</title>
            <meta name="Calendarium" content="Calendar of events and exams" />
            <link rel="icon" href="/favicon-calendarium.ico" />
          </Head>

          <div id="APP">
            <Calendar
              localizer={localizer}
              selected={selectedEvent}
              onSelectEvent={(event) => handleSelection(event)}
              defaultDate={new Date()}
              defaultView="month"
              eventPropGetter={(event: { title; start; end; groupId }) => {
                const newStyle = {
                  backgroundColor: colors[event.groupId],
                  border: "none",
                };

                return { style: newStyle };
              }}
              events={Events}
              style={{ height: "90vh" }}
            />
          </div>

          {inspectEvent && (
            <EventModal
              selectedEvent={selectedEvent}
              setInspectEvent={setInspectEvent}
            />
          )}

          <div className={styles.filter}>
            <CheckBox
              filters={filters}
              handleFilters={(myFilters) => handleFilters(myFilters)}
            />
          </div>
        </div>
      </div>
      <FeedbackForm />
    </Layout>
  );
}

export async function getStaticProps() {
  //Refer to the above comment
  moment.tz.setDefault("Africa/Bamako");
  const filters = JSON.parse(fs.readFileSync("data/filters.json", "utf-8"));
  const events = JSON.parse(fs.readFileSync("data/events.json", "utf-8"));
  return {
    props: {
      events: events,
      filters: filters,
    },
  };
}
