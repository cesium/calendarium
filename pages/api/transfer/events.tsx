import { NextApiRequest, NextApiResponse } from "next";

import { google } from "googleapis";

import { IEventDTO } from "../../../dtos";
import { getEvents } from "../../../utils";

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
    let eventsData: IEventDTO[] = await getEvents(sheets);

    if (req.query.filterId) {
      eventsData = eventsData.filter(
        (event) => event.filterId === Number(req.query.filterId as string)
      );
    }

    if (req.query.groupId) {
      eventsData = eventsData.filter((event) =>
        typeof req.query.groupId === "string"
          ? event.groupId === Number(req.query.groupId)
          : req.query.groupId.includes(event.groupId.toString())
      );
    }

    // Convert data into JSON
    const data = JSON.stringify(eventsData);

    // Send JSON data
    res.status(200).send(data);
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

export default API;
