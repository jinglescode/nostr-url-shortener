"use client";
import { NDKProvider } from "@nostr-dev-kit/ndk-react";
import LoadNdk from "@/components/LoadNdk";
import { DEFAULT_RELAYS } from "@/constants/relays";

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
    <NDKProvider relayUrls={relayUrls}>
      {loginSiger && <LoadNdk />}
      {children}
    </NDKProvider>
  );
}
