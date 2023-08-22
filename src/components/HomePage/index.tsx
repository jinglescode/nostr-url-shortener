"use client";

import { useState } from "react";
import Confetti from "./Confetti";
import LinkTextInput from "./LinkTextInput";
import Layout from "../site/Layout";

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
      <div className="flex flex-col justify-center items-center mx-auto max-w-2xl w-full gap-2">
        <div className="w-full rounded-md bg-white bg-opacity-80 shadow-2xl backdrop-blur backdrop-filter transition-all drop-shadow-xl">
          <LinkTextInput fireConfetti={fireConfetti} siteURL={siteURL} />
        </div>
      </div>
      <Confetti triggerConfetti={triggerConfetti} />
    </Layout>
  );
}
