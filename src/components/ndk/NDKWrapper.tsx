"use client";
import { NDKProvider } from "@nostr-dev-kit/ndk-react";
import { DEFAULT_RELAYS } from "@/constants/relays";
import LoadNdk from "./LoadNdk";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function NDKWrapper({
  children,
  loginSiger = false,
}: {
  children: React.ReactNode;
  loginSiger?: boolean;
}) {
  const relayUrls =
    process.env.NEXT_PUBLIC_RELAY_URLS?.split(",") || DEFAULT_RELAYS;
  return (
    <QueryClientProvider client={queryClient}>
      <NDKProvider relayUrls={relayUrls}>
        {loginSiger && <LoadNdk />}
        {children}
      </NDKProvider>
    </QueryClientProvider>
  );
}
