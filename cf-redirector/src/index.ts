import { SimplePool } from "nostr-tools";
import { Filter } from "nostr-tools";

export interface Env {
  NOSTR_RELAYS: string;
  NOSTR_REDIRECT_KV_CACHE: KVNamespace;
}

const DEFAULT_RELAYS = [
  "wss://relay.damus.io",
  "wss://relay.nostr.band",
  "wss://nos.lol",
];
const REF_KIND: number = 1994;

function createRedirectResponse(redirectUrl: string): Response {
  return new Response(null, {
    status: 301,
    headers: {
      Location: redirectUrl,
    },
  });
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Since we can also handle redirets on the Vercel, it is safe to pass through on Exceptions
    ctx.passThroughOnException();

    const url = new URL(request.url);

    // First we check if CloudFlare cache has the request already, and return it
    const cache = caches.default;
    const cacheKey = new Request(url, request);
    const cacheResponse = await cache.match(cacheKey);
    if (cacheResponse) {
      return cacheResponse;
    }

    // If URL path is /, we pass through the request, as well as all paths that have extensions
    if (
      url.pathname === "/" ||
      url.pathname.includes(".") ||
      url.pathname.startsWith("/_next/") ||
      url.pathname === "/get" ||
      url.pathname === "/check"
    ) {
      return fetch(request);
    }

    // If not, we check KV cache for the request path, and if found, construct a redirect response
    const kvCacheResponse = await env.NOSTR_REDIRECT_KV_CACHE.get(
      url.pathname,
      "text"
    );

    let redirectUrl: string;
    // Define response_redirect here so we can use it in both if and else blocks
    if (kvCacheResponse) {
      redirectUrl = kvCacheResponse;
    } else {
      // If not found in KV cache, we check if the request path is a Nostr Relay
      const pool = new SimplePool();
      const relays = env.NOSTR_RELAYS
        ? env.NOSTR_RELAYS.split(",").map((s) => s.trim())
        : DEFAULT_RELAYS;

      if (!pool) {
        // If not found in KV cache, and not a Nostr Relay, we pass through the request
        throw new Error("Cannot connect to Nostr Relay");
      }
      const filter: Filter = {
        kinds: [REF_KIND],
        "#d": [url.pathname.slice(1)],
      };

      let nostr_event;
      try {
        nostr_event = await pool.get(relays, filter);
      } catch (e) {
        throw new Error("Cannot fetch event from Nostr Relays");
      }

      if (!nostr_event) {
        // If not found in KV cache, and not a Nostr Relay, we pass through the request
        throw new Error(
          "Not Found: " +
            JSON.stringify(filter) +
            " " +
            JSON.stringify(nostr_event)
        );
      } else {
        // Print debug info and close the pool
        console.log(JSON.stringify(nostr_event));
        pool.close(relays);
      }

      const rTags = nostr_event.tags.filter((t) => t[0] === "r");
      try {
        redirectUrl = new URL(rTags[0][1]).toString();
      } catch (e) {
        throw new Error("Not Found");
      }

      // Store the redirect URL in KV cache
      ctx.waitUntil(env.NOSTR_REDIRECT_KV_CACHE.put(url.pathname, redirectUrl));
    }

    // Get the hostname of the redirect URL
    const redirectHostname = new URL(redirectUrl).hostname;

    // Check for direct loop or if it's redirecting back to the same hostname
    if (url.toString() === redirectUrl || url.hostname === redirectHostname) {
      return new Response("Detected potential redirect loop", { status: 400 });
    }

    const response_redirect = createRedirectResponse(redirectUrl);

    // Cache the response for 1 day
    response_redirect.headers.append("Cache-Control", "max-age=86400, public");
    ctx.waitUntil(cache.put(cacheKey, response_redirect.clone()));
    return response_redirect;
  },
};
