import { NextApiRequest, NextApiResponse } from "next";

import { google, sheets_v4 } from "googleapis";

import { INotDTO } from "../../../dtos";

async function getNotifications(sheets: sheets_v4.Sheets): Promise<INotDTO[]> {
  const range = "Notificações!A2:D999";
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  let notifications: INotDTO[] = [];
  const rows: string[][] = response.data.values;
  if (rows.length) {
    notifications = rows.map((row) => {
      return {
        type: row[0] ?? undefined,
        description: row[1] ?? undefined,
        date: row[2] + " " + row[3] ?? undefined,
      };
    });
  }

  return notifications.filter(
    (n) =>
      n.type !== undefined &&
      n.description !== undefined &&
      n.date !== undefined
  );
}

const API = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "application/json");

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
  const notificationData: INotDTO[] = await getNotifications(sheets);

  // Convert data into JSON
  const data = JSON.stringify(notificationData);

  // Send JSON data
  res.status(200).send(data);
};

export default API;
