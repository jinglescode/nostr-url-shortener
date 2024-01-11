import { NextRequest, NextResponse } from "next/server";

import { nanoid } from "nanoid";

import { DEFAULT_RELAYS } from "@/constants/relays";
import NDK, { NDKPrivateKeySigner, NDKEvent } from "@nostr-dev-kit/ndk";
import { checkUrlWebRiskSafe } from "@/utils/checkUrlWebRiskSafe";

const getCorsHeaders = () => {
  const headers = {
    "Access-Control-Allow-Methods": `GET`,
    "Access-Control-Allow-Origin": `*`,
  };
  return headers;
};

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  const relays =
    process.env.NEXT_PUBLIC_RELAY_URLS?.split(",") || DEFAULT_RELAYS;

  if (url) {
    const urlIsSafe = await checkUrlWebRiskSafe(url);
    if (urlIsSafe === false) {
      return NextResponse.json(
        { error: "Unsafe URL" },
        {
          status: 400,
        }
      );
    }

    const sk = process.env.NEXT_PUBLIC_SK;

    const signer = new NDKPrivateKeySigner(sk);

    const ndk = new NDK({
      explicitRelayUrls: relays,
      signer: signer,
    });
    await ndk.connect();

    if (sk === undefined) {
      return NextResponse.json(
        { error: "No secret key" },
        {
          status: 400,
        }
      );
    }

    const _id = nanoid(8);

    const event = new NDKEvent();
    event.tags = [
      ["d", _id],
      ["r", url],
    ];
    event.content = url;
    event.kind = 1994;
    event.ndk = ndk;
    event.sign();
    await event.publish();

    const publishedEvent = event.rawEvent();

    return NextResponse.json(
      {
        id: _id,
        url: `${req.headers.get("host")}/${_id}`,
        eid: publishedEvent.id,
      },
      {
        status: 200,
        headers: getCorsHeaders(),
      }
    );
  }

  return NextResponse.json(
    { error: `Usage: ${req.headers.get("host")}/get?url=<full url here>` },
    {
      status: 400,
      headers: getCorsHeaders(),
    }
  );
}
