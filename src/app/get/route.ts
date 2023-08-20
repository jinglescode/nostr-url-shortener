import { NextRequest, NextResponse } from "next/server";

import { nanoid } from "nanoid";

import {
  getPublicKey,
  getEventHash,
  getSignature,
  SimplePool,
} from "nostr-tools";
import { DEFAULT_RELAYS } from "@/constants/relays";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const id = req.nextUrl.searchParams.get("id");

  const relays =
    process.env.NEXT_PUBLIC_RELAY_URLS?.split(",") || DEFAULT_RELAYS;

  const pool = new SimplePool();

  if (url) {
    const sk = process.env.NEXT_PUBLIC_SK;

    if (sk === undefined) {
      return NextResponse.json(
        { error: "No secret key" },
        {
          status: 400,
        }
      );
    }

    let pk = getPublicKey(sk);

    const _id = nanoid(8);

    let event = {
      pubkey: pk,
      kind: 1994,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["d", _id],
        ["r", url],
      ],
      content: "",
      id: "",
      sig: "",
    };

    event.id = getEventHash(event);
    event.sig = getSignature(event, sk);

    try {
      await Promise.all(pool.publish(relays, event));
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to publish to at least one relay in the pool" },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      id: _id,
      url: `${req.headers.get("host")}/${_id}`,
      eid: event.id,
    });
  }

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

  return NextResponse.json(
    { error: `Usage: ${req.headers.get("host")}/get?url=<full url here>` },
    {
      status: 400,
    }
  );
}
