import { NextApiRequest, NextApiResponse } from "next";

import { google } from "googleapis";

import { IEventDTO } from "../../../dtos";
import { getEvents } from "../../../utils";

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
  const eventsData: IEventDTO[] = await getEvents(sheets);

  // Convert data into JSON
  const data = JSON.stringify(eventsData);

  // Send JSON data
  res.status(200).send(data);
};

export default API;
