import { NextApiRequest, NextApiResponse } from "next";

import * as fs from "fs";

import { IFormatedShift } from "../../schedule";
import { IShiftDTO, IFilterDTO } from "../../../dtos";

import { createEvents, DateArray, EventAttributes } from "ics";

import moment from "moment";

import { buildDateArray } from "../../../utils/utils";

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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "text/calendar");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=calendarium-schedule.ics"
  );

  // Fetch filter data from JSON
  const filters: IFilterDTO[] = JSON.parse(
    fs.readFileSync("data/filters.json", "utf-8")
  );

  // Fetch query keys
  const queryEntries: [string, string | string[]][] = Object.entries(req.query);

  // Check if the API request is valid
  const valid: boolean =
    queryEntries.length > 0 &&
    queryEntries
      .map((entry) => {
        const [key, value] = entry;
        const filter = filters.find((f) => f.name === key);

        return (
          filter &&
          (Array.isArray(value)
            ? (value as string[])
                .map((v) => filter.shifts.includes(v))
                .every((v) => v === true)
            : filter.shifts.includes(value))
        );
      })
      .every((v) => v === true);

  if (valid) {
    // Fetch shift data from JSON
    const shiftsData: IShiftDTO[] = JSON.parse(
      fs.readFileSync("data/shifts.json", "utf-8")
    );

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
    const shifts: IFormatedShift[] = shiftsData.map(configureDates);

    // Convert query entries into {id: number, shift: string} objects
    const checked: { id: number; shift: string }[] = queryEntries
      .map((entry) => {
        const [key, value] = entry;
        const filter = filters.find((f) => f.name === key);

        if (Array.isArray(value)) {
          return (value as string[]).map((v) => ({ id: filter.id, shift: v }));
        } else {
          return [{ id: filter.id, shift: value }];
        }
      })
      .flat();

    // Filter shifts based on the query params
    const filteredShifts: IFormatedShift[] = shifts.filter((s) => {
      return checked.find((c) => c.id === s.filterId && c.shift === s.shift);
    });

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
};
