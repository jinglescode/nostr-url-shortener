import { NDKFilter } from "@nostr-dev-kit/ndk";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useQuery } from "@tanstack/react-query";

export function useUserLinks(author: string | undefined) {
  const { ndk, fetchEvents } = useNDK();
  const { status, data, error, isFetching } = useQuery(
    ["userLinks", author],
    async () => {
      const filter: NDKFilter = {
        //@ts-ignore
        kinds: [1994],
        authors: [author],
      };
      const events = await fetchEvents(filter);

      const links = events.map((event) => {
        const dTags = event.tags.filter((t) => t[0] === "d");
        const rTags = event.tags.filter((t) => t[0] === "r");
        return {
          id: dTags[0][1],
          url: rTags[0][1],
          eid: event.id,
        };
      });
      return links;
    },
    {
      enabled: !!author && !!ndk,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 1000 * 60 * 60 * 24 * 7,
      staleTime: 1000 * 60 * 60 * 24 * 1,
    }
  );

  return { status, data, error, isFetching };
}
