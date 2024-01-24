import moment from "moment-timezone";

import { IEventDTO } from "../dtos";
import { sheets_v4 } from "googleapis";

export function reduceOpacity(hexColor) {
  // Convert HEX color code to RGBA color code
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);
  let a = 0.25; // 25% opacity
  let rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

  return rgbaColor;
}

export const defaultColors = [
  "#ed7950", // cesium
  "#4BC0D9", // 1st year
  "#7b54f0", // 2nd year
  "#f0547b", // 3rd year
  "#5ac77b", // 4th year
  "#395B50", // 5th year
  "#b70a0a", // uminho
  "#3408fd", // sei
  "#642580", // coderdojo
  "#FF0000", // join
  "#1B69EE", // jordi
  "#FF499E", // codeweek
];

export async function getEvents(
  sheets: sheets_v4.Sheets, fixDST: boolean = false
): Promise<IEventDTO[]> {
  const range = "Eventos!A2:I999";
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  let events: IEventDTO[] = [];
  const rows: string[][] = response.data.values;
  if (rows.length) {
    /* Look, Netlify has some freaking problem with daylight savings, and it just won't get the Europe/Lisbon DST right.
     * That said, the following code manually fixes what Netlify messes up, by pretty much checking if the dates are
     * between the DST period for Portugal (manually set bellow) and, if so, subtracting 1 hour from the date.
     *
     * Is this optimal? No. Have I tried to fix it in a better way? Yes. Did I succeed? No.
     *
     * Do we need to update the DST period every year? Yes. Is it a big deal? No.
     *
     * Do I give up fixing this issue? Yes.
     *
     * If you have a better solution, please, PLEASE, let me know.
     * */

    // check if the date is between the DST period for Portugal, and if so, subtract 1 hour
    const fixDSTDates = (date: Date) => {
      if (fixDST)
        date.getTime() > dstStart.getTime() &&
          date.getTime() < dstEnd.getTime() &&
          date.setHours(date.getHours() - 1);
      return date;
    };

    // convert a date to a string in the format "YYYY-MM-DD HH:MM"
    const dateToString = (date: Date) => {
      return moment(date).format("YYYY-MM-DD HH:mm");
    };

    // DST period for Portugal, current: 26/03/2023 - 29/10/2023
    const dstStart = new Date(new Date().getFullYear(), 2, 26);
    const dstEnd = new Date(new Date().getFullYear(), 9, 29);

    events = rows.map((row: string[]) => {
      // dates that will ultimatly be passed into `events`
      let startString: string = undefined;
      let endString: string = undefined;

      // check if the date rows exist in the first place, before messing with them
      if (row[3] && row[4] && row[5] && row[6]) {
        // auxiliary variables needed to perform operations on Date objects
        let start: Date = new Date(row[3] + " " + row[4]);
        let end: Date = new Date(row[5] + " " + row[6]);

        // fix DST if necessary
        start = fixDSTDates(start);
        end = fixDSTDates(end);

        // convert the dates back to strings.
        // this is needed because the contents of `events` need to be serializable, and Date objects are not
        // they need to be serialized because of `getServerSideProps()`
        startString = dateToString(start);
        endString = dateToString(end);
      }

      /* The End. */

      return {
        title: row[0] ?? undefined,
        place: row[1] ?? undefined,
        link: row[2] ?? undefined,
        start: startString,
        end: endString,
        groupId: row[7] ? parseInt(row[7]) : undefined,
        filterId: row[8] ? parseInt(row[8]) : undefined,
      };
    });

    return events.filter(
      (e) =>
        e.title != undefined &&
        e.start != undefined &&
        e.end != undefined &&
        e.groupId != undefined &&
        e.filterId != undefined
    ); // filter out invalid/incomplete events
  }
}
