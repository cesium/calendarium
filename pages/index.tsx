import { useState } from "react";
import Image from "next/image";
import * as fs from "fs";
import FeedbackForm from "../components/FeedbackForm";
import Navbar from "../components/Navbar";
import Head from "next/head";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/en-gb";
import styles from "../styles/Home.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import BasicModal from "../components/Modal";
import CheckBox from "../components/CheckBox";

const localizer = momentLocalizer(moment);

export default function Home({ events, filters }) {
  const configureDates = (event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);
    return event;
  };

  const [Events, setEvents] = useState(events.map(configureDates));
  const [Filters, setFilters] = useState(filters);
  const [selected, setSelected] = useState();
  const [open, setOpen] = useState(false);

  const showNewEvents = (f) => {
    const filters = Object.values(f);
    let newEvents = [...events];

    if (filters.length > 0) {
      newEvents = newEvents.filter((ev) => filters.includes(ev.filterId));
    }

    setEvents(newEvents);
  };

  //Function to update the Filters state
  const handleFilters = (myFilters) => {
    const newFilters = { ...myFilters };
    setFilters(newFilters);
    showNewEvents(newFilters);
  };

  // Function to update a selected event
  const handleSelected = (mySelected) => {
    setSelected(mySelected);
    setOpen(!open);
  };
  return (
    <div className="Home">
      <div className={styles.container}>
        <Head>
          <title>Calendarium</title>
          <meta name="Calendarium" content="Calendar of events and exams" />
          <link rel="icon" href="/calendar-icon.ico" />~
        </Head>
        <Navbar />

        <div id="APP" className={styles.calendar}>
          <Calendar
            localizer={localizer}
            selected={selected}
            onSelectEvent={handleSelected}
            //Establishing some default definitions
            defaultDate={new Date()}
            defaultView="month"
            //Custom event colors by their year (groupID)
            eventPropGetter={(event) => {
              var colors = [
                "#f07c54",
                "#f0c954",
                "#7b54f0",
                "#f0547b",
                "#5ac77b",
                "#5532a8",
                "#b70a0a",
              ];

              let newStyle = {
                backgroundColor: colors[event.groupId],
                border: "none",
              };

              return { style: newStyle };
            }}
            events={Events}
            min={new Date(2022, 0, 1, 8, 0)}
            max={new Date(2022, 0, 1, 21, 0)}
            style={{ height: "90vh" }}
          />
        </div>
        {open && <BasicModal content={selected} />}
        <div className={styles.filter}>
          <CheckBox
            filters={filters}
            handleFilters={(myFilters) => handleFilters(myFilters)}
          />
        </div>
      </div>
      <div className="textbox">
        <FeedbackForm />
      </div>
      <div className={styles.footer}>
        <Image
          width={21}
          height={21}
          src="/cesium-LIGHT.svg"
          alt="Logo do Cesium"
        />
      </div>
    </div>
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
