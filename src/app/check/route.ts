import { NextRequest, NextResponse } from "next/server";

import { DEFAULT_RELAYS } from "@/constants/relays";
import NDK, { NDKFilter } from "@nostr-dev-kit/ndk";

const getCorsHeaders = () => {
  const headers = {
    "Access-Control-Allow-Methods": `GET`,
    "Access-Control-Allow-Origin": `*`,
  };
  return headers;
};

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const url = req.nextUrl.searchParams.get("url");
  const pubkey = req.nextUrl.searchParams.get("pubkey");

  const relays =
    process.env.NEXT_PUBLIC_RELAY_URLS?.split(",") || DEFAULT_RELAYS;

  const ndk = new NDK({
    explicitRelayUrls: relays,
  });
  await ndk.connect();

  if (id) {
    const filter: NDKFilter = {
      //@ts-ignore
      kinds: [1994],
      "#d": [id],
    };

    const event = await ndk.fetchEvent(filter);

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
    const filter: NDKFilter = {
      //@ts-ignore
      kinds: [1994],
      "#r": [url],
    };
    const event = await ndk.fetchEvent(filter);

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

  if (pubkey) {
    const filter: NDKFilter = {
      //@ts-ignore
      kinds: [1994],
      authors: [pubkey],
    };
    let events = await ndk.fetchEvents(filter);
    events = Array.from(new Set(events.values()));

    const allUrls = events.map((event) => {
      const dTags = event.tags.filter((t) => t[0] === "d");
      const rTags = event.tags.filter((t) => t[0] === "r");
      return {
        id: dTags[0][1],
        url: rTags[0][1],
        eid: event.id,
      };
    });

    return NextResponse.json(allUrls, {
      status: 200,
      headers: getCorsHeaders(),
    });
  }

  return NextResponse.json(
    {
      error: `Usage: ${req.headers.get(
        "host"
      )}/check?url=<full url here> or ${req.headers.get(
        "host"
      )}/check?id=<id here> or ${req.headers.get(
        "host"
      )}/check?pubkey=<pubkey here>`,
    },
    {
      status: 400,
      headers: getCorsHeaders(),
    }
  );
}
