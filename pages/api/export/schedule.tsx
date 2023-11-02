import { NextApiRequest, NextApiResponse } from "next";

import { IFormatedShift } from "../../schedule";
import { IShiftDTO, IFilterDTO } from "../../../dtos";

import ical from "ical-generator";
import { ICalEventData, ICalEventRepeatingFreq } from "ical-generator";

import moment from "moment";

import path from "path";
import fsPromises from "fs/promises";

// Convert shifts to ICS format
function convertShiftsToICS(
  shifts: IFormatedShift[],
  filters: IFilterDTO[],
  end: false | Date
) {
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
        until: end ? end : undefined, // If end date is not defined, don't set a limit
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
  const queryEntriesData: [string, string | string[]][] = Object.entries(
    req.query
  );

  /* Normalize the format of queryEntries, this is needed because the deployed version of the app
   * will, for a reason I'm yet to understand, parse the query as [string, string][] instead of [string, string | string[]][].
   * For example: - local environment: [["CP",["T1","PL1"]],["DSS",["T1","TP1"]]]
   *              - deployed environment: [["CP","T1, PL1"],["DSS","T1, TP1"]]
   */
  const queryEntries: [string, string | string[]][] = queryEntriesData.map(
    (entry: [string, string | string[]]) => {
      const [key, value] = entry;

      if (!Array.isArray(value) && value.includes(",") && value.includes(" ")) {
        return [key, value.split(",").map((v) => v.trim())];
      }
      if (!Array.isArray(value) && value.includes(",")) {
        return [key, value.split(",")];
      }

      return entry;
    }
  );

  // Check if the API request is valid
  const valid: boolean =
    queryEntries.length > 0 &&
    queryEntries.every((entry) => {
      const [key, value] = entry;

      if (key === "start" || key === "end")
        return (
          !Array.isArray(value) && moment(value, "YYYY-MM-DD", true).isValid()
        );

      const filter = filters.find((f) => f.name === key);

      return (
        filter &&
        (Array.isArray(value)
          ? value.every((v) => filter.shifts.includes(v))
          : filter.shifts.includes(value))
      );
    });

  // Get start and end dates
  const startDate: [string, string | string[]] =
    queryEntries.find((entry) => entry[0] === "start") ?? null;
  const endDate: [string, string | string[]] =
    queryEntries.find((entry) => entry[0] === "end") ?? null;
  const start: false | Date = startDate
    ? moment(startDate[1] as string, "YYYY-MM-DD", true).toDate()
    : false;
  const end: false | Date = endDate
    ? moment(endDate[1] as string, "YYYY-MM-DD", true).toDate()
    : false;

  // Get query entries related to filters (exclude start and end dates)
  const queryEntriesFilters: [string, string | string[]][] =
    queryEntries.filter((entry) => {
      return entry[0] !== "start" && entry[0] !== "end";
    });

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

      shift.start = (start ? moment(start) : moment()) // If start date is not defined, use today's date
        .day(shift.day + 1)
        .hour(+startHour)
        .minute(+startMinute)
        .toDate();
      shift.end = (start ? moment(start) : moment()) // ""
        .day(shift.day + 1)
        .hour(+endHour)
        .minute(+endMinute)
        .toDate();

      return shift;
    };

    // Convert date strings into Date objects, for all shifts
    const shifts: IFormatedShift[] = shiftsData.map(configureDates);

    // Convert query entries into {id: number, shift: string} objects
    const checked: { id: number; shift: string }[] = queryEntriesFilters
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
      filters,
      end
    );

    // Create ICS file and return it
    const calendar = ical({
      name: "Calendarium - Schedule",
      events: icsShifts,
      timezone: "Europe/Lisbon",
    });

    // Send ICS file
    res.status(200).send(calendar.toString());
  } else res.status(400).send("Invalid request\n");
};
