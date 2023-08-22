import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUserLinksPost() {
  const queryClient = useQueryClient();

  const { ndk, signPublishEvent } = useNDK();

  return useMutation(
    async (event: NDKEvent) => {
      if (!ndk) return undefined;
      const success = await signPublishEvent(event);
      if (success) return event;
      return undefined;
    },
    {
      onSettled: (event) => {
        if (event) {
          queryClient.invalidateQueries(["userLinks", event.pubkey]);
        }
      },
    }
  );
}
