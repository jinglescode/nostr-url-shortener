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
  return (
    <NDKProvider
      relayUrls={["wss://relay.damus.io", "wss://relay.nostr.band"]}
    >
      {loginSiger && <LoadNdk />}
      {children}
    </NDKProvider>
  );
}
