import { NextApiRequest, NextApiResponse } from "next";

import * as fs from "fs";

import { IFormatedEvent } from "..";
import { IFormatedShift } from "../schedule";

import { createEvents, DateArray, EventAttributes } from "ics";

import moment from "moment";

// Converts Date object into DateArray type, needed by "ics" package
function buildDateArray(date: Date): DateArray {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
}

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

// Handle the export of events (Event page)
function handleEventExport(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=calendarium-events.ics"
  );

  // Check if the API request is valid
  const valid: boolean =
    !Array.isArray(req.query.subjects) && req.query.subjects !== "";

  // Fetch event data from JSON
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
    // Parse the subjects query string
    const subjectsInput: string = req.query.subjects as string;
    const subjects: number[] = subjectsInput.split(",").map(Number);

    // Filter events based on the query params
    const filteredEvents: IFormatedEvent[] = events.filter(
      (event: IFormatedEvent) => {
        return subjects.includes(event.filterId) || event.filterId === -1;
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
}

// Convert shifts to ICS format
function convertShiftsToICS(shifts: IFormatedShift[]) {
  const icsShifts: EventAttributes[] = shifts.map((shift: IFormatedShift) => {
    const s: DateArray = buildDateArray(shift.start);
    const e: DateArray = buildDateArray(shift.end);

    // Fetch filter data from JSON
    const filters = JSON.parse(fs.readFileSync("data/filters.json", "utf-8"));
    const filter = filters.find((filter) => filter.id === shift.filterId);

    const icsShift: EventAttributes = {
      title: `${filter.name} - ${shift.shift}`,
      description: shift.title,
      location: `${shift.building.includes("CP") ? "" : "Ed. "}${
        shift.building
      } - ${shift.room}`,
      start: s,
      end: e,
      startInputType: "local",
      endInputType: "local",
      recurrenceRule: "FREQ=WEEKLY;INTERVAL=1",
    };

    return icsShift;
  });

  return icsShifts;
}

// Handle export of a schedule (Schedule page)
function handleScheduleExport(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=calendarium-schedule.ics"
  );

  // Check if the API request is valid
  const valid: boolean =
    !Array.isArray(req.query.classes) && req.query.classes !== "";

  // Fetch shift data from JSON
  const shiftsData = JSON.parse(fs.readFileSync("data/shifts.json", "utf-8"));

  // Convert the start and end date strings of a shift into Date objects
  const configureDates = (shift) => {
    const [startHour, startMinute] = shift.start.split(":");
    const [endHour, endMinute] = shift.end.split(":");

    shift.start = moment()
      .day(shift.day + 1)
      .hour(startHour)
      .minute(startMinute)
      .toDate();
    shift.end = moment()
      .day(shift.day + 1)
      .hour(endHour)
      .minute(endMinute)
      .toDate();

    return shift;
  };

  // Convert date strings into Date objects, for all shifts
  const shifts = shiftsData.map(configureDates);

  if (valid) {
    // Parse the classes query string
    const classesInput: string = req.query.classes as string;
    const classesString: string[] = classesInput.split(";");
    const classes: { id: number; shift: string }[] = classesString.map(
      (classString) => {
        const [id, shift] = classString.split(",");
        return { id: Number(id), shift: shift };
      }
    );

    // Filter shifts based on the query params
    const filteredShifts: IFormatedShift[] = shifts.filter(
      (s: IFormatedShift) => {
        return classes.find((c) => c.id === s.filterId && c.shift === s.shift);
      }
    );

    // Convert shifts to ICS format
    const icsShifts: EventAttributes[] = convertShiftsToICS(filteredShifts);

    // Create ICS file and return it
    createEvents(icsShifts, (error, value) => {
      if (error) {
        console.log(error);
        return;
      }

      res.status(200).send(value);
    });
  } else res.status(400).send("Invalid request\n");
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "text/calendar");

  if (req.query.subjects) handleEventExport(req, res);
  else if (req.query.classes) handleScheduleExport(req, res);
  else res.status(400).send("Invalid request\n");
};
