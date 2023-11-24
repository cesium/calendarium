import { NextApiRequest, NextApiResponse } from "next";

import { IFormatedEvent } from "../..";
import { IEventDTO, IFilterDTO } from "../../../dtos";
import { getEvents } from "../../../utils";

import ical from "ical-generator";
import { ICalEventData } from "ical-generator";

import path from "path";
import fsPromises from "fs/promises";

import { google } from "googleapis";

/* Academic year starts in September, thus:
 * Current month < September => September of previous year (current year - 1)
 * Current month >= September => September of current year */
const academicYear: Date = new Date(
  new Date().getMonth() < 8
    ? new Date().getFullYear() - 1
    : new Date().getFullYear(),
  8,
  1
); // 8 = September (0-11)

// Convert events to ICS format
function convertEventsToICS(events: IFormatedEvent[]) {
  const icsEvents: ICalEventData[] = events.map((event) => {
    const allDay: boolean =
      event.start.getHours() === 0 && event.end.getHours() === 0;

    const icsEvent: ICalEventData = {
      summary: event.title,
      description: event.link,
      location: event.place,
      start: event.start,
      end: event.end,
      allDay: allDay,
    };

    return icsEvent;
  });

  return icsEvents;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "text/calendar");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=calendarium-events.ics"
  );

  // Fetch filter data from JSON
  const filterFilePath = path.join(process.cwd(), "data/filters.json");
  const filtersBuffer = await fsPromises.readFile(filterFilePath);
  const filters: IFilterDTO[] = JSON.parse(filtersBuffer as unknown as string);

  // Fetch filter names
  const filtersNames: string[] = filters.map((f) => f.name);

  // Fetch query keys
  const queryKeys: string[] = Object.keys(req.query);

  // Check if the API request is valid
  const valid: boolean =
    queryKeys.length > 0 &&
    queryKeys.map((key) => filtersNames.includes(key)).every((v) => v === true);

  if (valid) {
    // Connect to Google API
    const target = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
    const jwt = new google.auth.JWT(
      process.env.GS_CLIENT_EMAIL,
      null,
      (process.env.GS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      target
    );
    const sheets = google.sheets({ version: "v4", auth: jwt });

    // Fetch event data
    const eventsData: IEventDTO[] = await getEvents(sheets);

    // Converts the start and end date strings of an event into Date objects
    const configureDates = (event) => {
      event.start = new Date(event.start);
      event.end = new Date(event.end);
      return event;
    };

    // Convert date strings into Date objects, for all events
    const events: IFormatedEvent[] = eventsData.map(configureDates);

    // Convert query keys (filter names) into filter ids
    const checked: number[] = queryKeys.map(
      (key) => filters.find((f) => f.name === key).id
    );

    // Filter events based on the query params
    const filteredEvents: IFormatedEvent[] = events.filter(
      (event: IFormatedEvent) => {
        return (
          (checked.includes(event.filterId) || event.filterId === -1) &&
          event.start >= academicYear
        );
      }
    );

    // Convert events to ICS format
    const icsEvents: ICalEventData[] = convertEventsToICS(filteredEvents);

    // Create ICS file and return it
    const calendar = ical({
      name: "Calendarium - Events",
      events: icsEvents,
      timezone: "Europe/Lisbon",
    });

    // Send ICS file
    res.status(200).send(calendar.toString());
  } else res.status(400).send("Invalid request\n");
};
