import { NextApiRequest, NextApiResponse } from "next";

import { IFormatedEvent } from "../..";
import { IEventDTO, IFilterDTO } from "../../../dtos";

import ical from "ical-generator";
import { ICalEventData } from "ical-generator";

import path from "path";
import fsPromises from "fs/promises";

import { google } from "googleapis";

const academicYear: Date = new Date(new Date().getFullYear(), 8, 1); // 8 = September (0-11)

// Fetch event data from Google Sheets
async function getEvents(): Promise<IEventDTO[]> {
  const target = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
  const jwt = new google.auth.JWT(
    process.env.GS_CLIENT_EMAIL,
    null,
    (process.env.GS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    target
  );
  const sheets = google.sheets({ version: "v4", auth: jwt });

  const range = "Eventos!A2:I999";
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  let events: IEventDTO[] = [];
  const rows: string[][] = response.data.values;
  if (rows.length) {
    events = rows.map((row: string[]) => ({
      title: row[0],
      place: row[1] ?? undefined,
      link: row[2] ?? undefined,
      start: row[3] + " " + row[4],
      end: row[5] + " " + row[6],
      groupId: parseInt(row[7]),
      filterId: parseInt(row[8]),
    }));

    return events;
  }

  return events;
}

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
    // Fetch event data
    const eventsData: IEventDTO[] = await getEvents();

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
