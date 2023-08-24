"use client";

import { useEffect, useState } from "react";
import Confetti from "./Confetti";
import LinkTextInput from "./LinkTextInput";
import Layout from "../site/Layout";
import UserLinks from "./UserLinks";
import { ListBulletIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useUserLinks } from "@/hooks/useUserLinks";
import { sessionStore } from "../site/sessionStore";
import { getPublicKeys } from "@/utils/getPublicKeys";

export default function HomePage({
  siteURL,
  imageFormat,
}: {
  siteURL: string;
  imageFormat: "avif" | "webp" | "jpeg";
}) {
  const [triggerConfetti, setTriggerConfetti] = useState<number>(0);
  const [view, setView] = useState<number>(0);

  const isUserSignIn = sessionStore((state) => state.isUserSignIn);
  const [userPk, setUserPk] = useState<string | undefined>(undefined);

  const { signer } = useNDK();
  const { data } = useUserLinks(userPk);

  useEffect(() => {
    async function get() {
      if (isUserSignIn && signer) {
        const user = await signer.user();
        const pks = getPublicKeys(user.npub);
        setUserPk(pks.pk);
      }
    }
    get();
  }, [isUserSignIn, signer]);

  function fireConfetti() {
    setTriggerConfetti(triggerConfetti + 1);
  }

  return (
    <Layout imageFormat={imageFormat}>
      <div className="flex flex-col justify-center items-center mx-auto max-w-2xl w-full gap-8">
        {data && data.length > 0 && (
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 gap-2 ${
                view == 0
                  ? "bg-gray-dark text-gray-light"
                  : "bg-gray-light text-gray-medium"
              }`}
              onClick={() => setView(0)}
            >
              <PlusIcon
                className={`h-5 w-5 ${
                  view === 0 ? "text-gray-light" : "text-gray-medium"
                }`}
              />
              New Link
            </button>
            <button
              type="button"
              className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 gap-2  ${
                view == 1
                  ? "bg-gray-dark text-gray-light"
                  : "bg-gray-light text-gray-medium"
              }`}
              onClick={() => setView(1)}
            >
              <ListBulletIcon
                className={`h-5 w-5 ${
                  view === 1 ? "text-gray-light" : "text-gray-medium"
                }`}
              />
              Your Links
            </button>
          </span>
        )}

        {view == 0 && (
          <LinkTextInput fireConfetti={fireConfetti} siteURL={siteURL} />
        )}
        {view == 1 && <UserLinks />}
      </div>

      <Confetti triggerConfetti={triggerConfetti} />
    </Layout>
  );
}
