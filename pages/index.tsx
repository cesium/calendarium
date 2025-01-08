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
import useColorTheme from "../hooks/useColorTheme";

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
  const [Filters, setFilters] = useState<number[]>(filters);
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

  const handleFilters = useCallback(
    (myFilters: number[]) => {
      const showNewEvents = (filters: number[]) => {
        let newEvents = [...fetchedEvents];

        if (filters.length > 0) {
          newEvents = newEvents.filter(
            (ev) => filters.includes(ev.filterId) || ev.filterId === -1
          ); // -1 is an id dedicated to always active events
        }

        setEvents(newEvents);
      };
      setFilters(myFilters);
      showNewEvents(myFilters);
    },
    [fetchedEvents]
  );

  const handleSelection = (event) => {
    setSelectedEvent(event);
    setInspectEvent(!inspectEvent);
  };

  // THEMES

  const { fetchTheme, getBgColor, getTextColor } = useColorTheme(filters);

  // INITIALIZATION

  useEffect(() => {
    handleData();
  }, [handleData]);

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
      isEvents
      filters={filters}
      handleFilters={handleFilters}
      fetchTheme={fetchTheme}
      handleData={handleData}
    >
      <div className="h-full pt-4 sm:pt-6">
        <Head>
          <title>Events | Calendarium</title>
          <meta name="description" content="Your exams, due dates and more." />
          <link rel="icon" href="/favicon-calendarium.ico" />
        </Head>
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
        {selectedEvent && (
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

export const getStaticProps = async () => {
  const filters = JSON.parse(fs.readFileSync("data/filters.json", "utf-8"));

  return {
    props: {
      filters: filters,
    },
  };
};
