"use client";

import { useState } from "react";
import Confetti from "./Confetti";
import LinkTextInput from "./LinkTextInput";
import Layout from "../site/Layout";
import UserLinks from "./UserLinks";

export default function HomePage({
  siteURL,
  imageFormat,
}: {
  siteURL: string;
  imageFormat: "avif" | "webp" | "jpeg";
}) {
  const [triggerConfetti, setTriggerConfetti] = useState<number>(0);

  function fireConfetti() {
    setTriggerConfetti(triggerConfetti + 1);
  }

  return (
    <Layout imageFormat={imageFormat}>
      <div className="flex flex-col justify-center items-center mx-auto max-w-2xl w-full gap-8">
        <LinkTextInput fireConfetti={fireConfetti} siteURL={siteURL} />
        <UserLinks />
      </div>

      <Confetti triggerConfetti={triggerConfetti} />
    </Layout>
  );
}
