import { NextApiRequest, NextApiResponse } from "next";

import { IFormatedShift } from "../../schedule";
import { IShiftDTO, IFilterDTO } from "../../../dtos";

import ical from "ical-generator";
import { ICalEventData, ICalEventRepeatingFreq } from "ical-generator";

import moment from "moment";

import path from "path";
import fsPromises from "fs/promises";

// Convert shifts to ICS format
function convertShiftsToICS(shifts: IFormatedShift[], filters: IFilterDTO[]) {
  const icsShifts: ICalEventData[] = shifts.map((shift) => {
    const filter = filters.find((filter) => filter.id === shift.filterId);

    const icsShift: ICalEventData = {
      summary: `${filter.name} - ${shift.shift}`,
      description: shift.title,
      location: `${shift.building.includes("CP") ? "" : "Ed. "}${
        shift.building
      } - ${shift.room}`,
      start: shift.start,
      end: shift.end,
      repeating: {
        freq: "WEEKLY" as ICalEventRepeatingFreq,
        interval: 1,
      },
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
  const filterFilePath = path.join(process.cwd(), "data/filters.json");
  const filtersBuffer = await fsPromises.readFile(filterFilePath);
  const filters: IFilterDTO[] = JSON.parse(filtersBuffer as unknown as string);

  // Fetch query keys
  const queryEntries: [string, string | string[]][] = Object.entries(req.query);

  // Check if the API request is valid
  const valid: boolean =
    queryEntries.length > 0 &&
    queryEntries
      .map((entry) => {
        const [key, value] = entry;
        const filter = filters.find((f) => f.name === key);

        if (!filter)
          // Filter not found, invalid query parameter
          return false;

        if (Array.isArray(value))
          // Handle array of values
          return value.every((v) => filter.shifts.includes(v));
        // Handle single value
        else return filter.shifts.includes(value);
      })
      .every((v) => v === true);

  if (valid) {
    // Fetch shift data from JSON
    const shiftsFilePath = path.join(process.cwd(), "data/shifts.json");
    const shiftsBuffer = await fsPromises.readFile(shiftsFilePath);
    const shiftsData: IShiftDTO[] = JSON.parse(
      shiftsBuffer as unknown as string
    );

    // Convert the start and end date strings of a shift into Date objects
    const configureDates = (shift) => {
      const [startHour, startMinute] = shift.start.split(":");
      const [endHour, endMinute] = shift.end.split(":");

      shift.start = moment()
        .day(shift.day + 1)
        .hour(+startHour)
        .minute(+startMinute)
        .toDate();
      shift.end = moment()
        .day(shift.day + 1)
        .hour(+endHour)
        .minute(+endMinute)
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
    const icsShifts: ICalEventData[] = convertShiftsToICS(
      filteredShifts,
      filters
    );

    // Create ICS file and return it
    const calendar = ical({ name: "Calendarium-Schedule", events: icsShifts });

    // Send ICS file
    res.status(200).send(calendar.toString());
  } else res.status(400).send("Invalid request\n");
};
