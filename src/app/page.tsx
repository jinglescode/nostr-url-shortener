"use client";

import NDKWrapper from "@/components/NDKWrapper";
import HomePage from "@/components/HomePage";

export default function Home() {
  return (
    <NDKWrapper loginSiger={true}>
      <HomePage />
    </NDKWrapper>
  );
}
