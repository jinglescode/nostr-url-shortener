import { NextRequest, NextResponse } from "next/server";

import { SimplePool } from "nostr-tools";
import { DEFAULT_RELAYS } from "@/constants/relays";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const url = req.nextUrl.searchParams.get("url");

  const relays =
    process.env.NEXT_PUBLIC_RELAY_URLS?.split(",") || DEFAULT_RELAYS;

  const pool = new SimplePool();

  if (id) {
    let event = await pool.get(relays, {
      kinds: [1994],
      "#d": [id],
    });
    if (event) {
      const dTags = event.tags.filter((t) => t[0] === "d");
      const rTags = event.tags.filter((t) => t[0] === "r");
      if (rTags.length > 0) {
        return NextResponse.json({
          id: dTags[0][1],
          url: rTags[0][1],
          eid: event.id,
        });
      }
    }
  }

  if (url) {
    let event = await pool.get(relays, {
      kinds: [1994],
      "#r": [url],
    });
    if (event) {
      const dTags = event.tags.filter((t) => t[0] === "d");
      const rTags = event.tags.filter((t) => t[0] === "r");
      if (rTags.length > 0) {
        return NextResponse.json({
          id: dTags[0][1],
          url: rTags[0][1],
          eid: event.id,
        });
      }
    }
  }

  return NextResponse.json(
    {
      error: `Usage: ${req.headers.get(
        "host"
      )}/check?url=<full url here> or ${req.headers.get(
        "host"
      )}/check?id=<id here>`,
    },
    {
      status: 400,
    }
  );
}
