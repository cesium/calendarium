import { NextRequest, NextResponse } from "next/server";

import { google } from "googleapis";

import { IEventDTO } from "../../../../dtos";
import { getEvents } from "../../../../utils";

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;

    if (searchParams.get("filterId")) {
      eventsData = eventsData.filter(
        (event) => event.filterId === Number(searchParams.get("filterId"))
      );
    }

    if (searchParams.get("groupId")) {
      const groupIdParam = searchParams.get("groupId");
      eventsData = eventsData.filter((event) =>
        groupIdParam ? event.groupId === Number(groupIdParam) : true
      );
    }

    return NextResponse.json(eventsData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    console.error(e);
    return new NextResponse(null, { status: 500 });
  }
}
