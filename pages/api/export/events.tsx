import { NextApiRequest, NextApiResponse } from "next";

import * as fs from "fs";

import { IFormatedEvent } from "../..";
import { IEventDTO, IFilterDTO } from "../../../dtos";

import { createEvents, DateArray, EventAttributes } from "ics";

import { buildDateArray } from "../../../utils/utils";

// Convert events to ICS format
function convertEventsToICS(events: IFormatedEvent[]) {
  const icsEvents: EventAttributes[] = events.map((event: IFormatedEvent) => {
    const s: DateArray = buildDateArray(event.start);
    const e: DateArray = buildDateArray(event.end);

    const icsEvent: EventAttributes = {
      title: event.title,
      location: event.place,
      start: s,
      end: e,
      url: event.link,
      startInputType: "local",
      endInputType: "local",
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
  const filters: IFilterDTO[] = JSON.parse(
    fs.readFileSync("data/filters.json", "utf-8")
  );
  // Fetch filter names
  const filtersNames: string[] = filters.map((f) => f.name);

  // Fetch query keys
  const queryKeys: string[] = Object.keys(req.query);

  // Check if the API request is valid
  const valid: boolean =
    queryKeys.length > 0 &&
    queryKeys.map((key) => filtersNames.includes(key)).every((v) => v === true);

  if (valid) {
    // Fetch event data from JSON
    const eventsData: IEventDTO[] = JSON.parse(
      fs.readFileSync("data/events.json", "utf-8")
    );

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
        return checked.includes(event.filterId) || event.filterId === -1;
      }
    );

    // Convert events to ICS format
    const icsEvents: EventAttributes[] = convertEventsToICS(filteredEvents);

    // Create ICS file and return it
    createEvents(icsEvents, (error, value) => {
      if (error) {
        console.log(error);
        return;
      }

      res.status(200).send(value);
    });
  } else res.status(400).send("Invalid request\n");
};
