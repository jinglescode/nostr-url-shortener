"use client"
import { NDKProvider } from "@nostr-dev-kit/ndk-react";
import LoadNdk from "@/components/LoadNdk";

export default function NDKWrapper({
  children,
  loginSiger = false,
}: {
  children: React.ReactNode;
  loginSiger?: boolean;
}) {
  const relayUrls = process.env.NEXT_PUBLIC_RELAY_URLS?.split(',') || ["wss://relay.damus.io", "wss://relay.nostr.band"];
  return (
    <NDKProvider
      relayUrls={relayUrls}
    >
      {loginSiger && <LoadNdk />}
      {children}
    </NDKProvider>
  );
}
