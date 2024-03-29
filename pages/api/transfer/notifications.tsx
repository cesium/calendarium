import { NextApiRequest, NextApiResponse } from "next";

import { google, sheets_v4 } from "googleapis";

import { INotDTO } from "../../../dtos";

async function getNotifications(sheets: sheets_v4.Sheets): Promise<INotDTO[]> {
  const range = "Notificações!A2:D999";
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  const rows: string[][] = response.data.values;
  const notifications: INotDTO[] = rows
    .filter((row) => row.length === 4)
    .map((row) => ({
      type: row[0] || undefined,
      description: row[1] || undefined,
      date: row[2] + " " + row[3] || undefined,
    }))
    .filter(
      (n) =>
        n.type !== undefined &&
        n.description !== undefined &&
        n.date !== undefined
    );

  return notifications;
}

const API = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const { GS_CLIENT_EMAIL, GS_PRIVATE_KEY } = process.env;
    if (!GS_CLIENT_EMAIL || !GS_PRIVATE_KEY) {
      throw new Error("GS_CLIENT_EMAIL and/or GS_PRIVATE_KEY is missing.");
    }
    // Connect to Google API
    const target = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
    const jwt = new google.auth.JWT(
      GS_CLIENT_EMAIL,
      null,
      (GS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      target
    );
    const sheets = google.sheets({ version: "v4", auth: jwt });

    // Fetch event data
    const notificationData: INotDTO[] = await getNotifications(sheets);

    // Convert data into JSON
    const data = JSON.stringify(notificationData);

    // Send JSON data
    res.status(200).send(data);
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

export default API;
