import { NextApiRequest, NextApiResponse } from "next";

import * as fs from "fs";

import { IFormatedEvent } from "..";

import { createEvents, DateArray, EventAttributes } from "ics";

// Convert events to ICS format
function convertEventsToICS(events: IFormatedEvent[]) {
  const icsEvents: EventAttributes[] = events.map((event: IFormatedEvent) => {
    const s: DateArray = [
      event.start.getFullYear(),
      event.start.getMonth() + 1,
      event.start.getDate(),
      event.start.getHours(),
      event.start.getMinutes(),
    ];
    const e: DateArray = [
      event.end.getFullYear(),
      event.end.getMonth() + 1,
      event.end.getDate(),
      event.end.getHours(),
      event.end.getMinutes(),
    ];

    const icsEvent: EventAttributes = {
      title: event.title,
      location: event.place,
      start: s,
      end: e,
      url: event.link,
      startInputType: "utc",
      endInputType: "utc",
    };

    return icsEvent;
  });

  return icsEvents;
}

function handleEventExport(req: NextApiRequest, res: NextApiResponse) {
  // Check if the API request is valid
  const valid = !Array.isArray(req.query.subjects) && req.query.subjects !== "";

  // Get event data from JSON
  const eventsData = JSON.parse(fs.readFileSync("data/events.json", "utf-8"));

  // Converts the start and end date strings of an event into Date objects
  const configureDates = (event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);

    return event;
  };

  // Convert date strings into Date objects, for all events
  const events = eventsData.map(configureDates);

  if (valid) {
    const subjectsInput: string = req.query.subjects as string;
    const subjects: number[] = subjectsInput.split(",").map(Number);

    const filteredEvents: IFormatedEvent[] = events.filter(
      (event: IFormatedEvent) => {
        return subjects.includes(event.filterId) || event.filterId === -1;
      }
    );

    const icsEvents: EventAttributes[] = convertEventsToICS(filteredEvents);

    createEvents(icsEvents, (error, value) => {
      if (error) {
        console.log(error);
        return;
      }

      res.status(200).send(value);
    });
  } else res.status(400).send("Invalid request");
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "text/calendar");
  res.setHeader("Content-Disposition", "attachment; filename=calendarium.ics");

  if (req.query.subjects) handleEventExport(req, res);
  else if (req.query.classes) res.send("handle schedule export");
  else res.status(400).send("Invalid request");
};
