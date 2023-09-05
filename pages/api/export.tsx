import { NextApiRequest, NextApiResponse } from "next";

import * as fs from "fs";

import { IFormatedEvent } from "..";
import { IFormatedShift } from "../schedule";

import { createEvents, DateArray, EventAttributes } from "ics";

import moment from "moment";

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
      startInputType: "local",
      endInputType: "local",
    };

    return icsEvent;
  });

  return icsEvents;
}

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

function convertShiftsToICS(shifts: IFormatedShift[]) {
  const icsShifts: EventAttributes[] = shifts.map((shift: IFormatedShift) => {
    const s: DateArray = [
      shift.start.getFullYear(),
      shift.start.getMonth() + 1,
      shift.start.getDate(),
      shift.start.getHours(),
      shift.start.getMinutes(),
    ];
    const e: DateArray = [
      shift.end.getFullYear(),
      shift.end.getMonth() + 1,
      shift.end.getDate(),
      shift.end.getHours(),
      shift.end.getMinutes(),
    ];

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

  // Convert the start and end date strings of a shift into Date objectse
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
    const classesInput: string = req.query.classes as string;
    const classesString: string[] = classesInput.split(";");
    const classes: { id: number; shift: string }[] = classesString.map(
      (classString) => {
        const [id, shift] = classString.split(",");
        return { id: Number(id), shift: shift };
      }
    );

    const filteredShifts: IFormatedShift[] = shifts.filter(
      (s: IFormatedShift) => {
        return classes.find((c) => c.id === s.filterId && c.shift === s.shift);
      }
    );

    const icsShifts: EventAttributes[] = convertShiftsToICS(filteredShifts);

    createEvents(icsShifts, (error, value) => {
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

  if (req.query.subjects) handleEventExport(req, res);
  else if (req.query.classes) handleScheduleExport(req, res);
  else res.status(400).send("Invalid request");
};
