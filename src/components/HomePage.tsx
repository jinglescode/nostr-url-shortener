"use client";
import {
  ArrowPathIcon,
  AtSymbolIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  LinkIcon,
  SignalIcon,
} from "@heroicons/react/20/solid";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nanoid } from "nanoid";
import { useClipboard } from "@/hooks/useCopyClipboard";
import Layout from "./Layout";

import ReactCanvasConfetti from "react-canvas-confetti";

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
      <Main fireConfetti={fireConfetti} siteURL={siteURL} />
      <Confetti triggerConfetti={triggerConfetti} />
    </Layout>
  );
}

function Main({
  fireConfetti,
  siteURL,
}: {
  fireConfetti: () => void;
  siteURL: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center mx-auto max-w-2xl w-full gap-2">
      {/* <AtSymbolIcon className="h-24 w-24 text-white" /> */}

      {/* <h2 className="text-3xl font-mono font-bold tracking-tight text-white sm:text-4xl font-outline">
        URL Shortener
      </h2> */}

      <div className="w-full rounded-md bg-white bg-opacity-80 shadow-2xl backdrop-blur backdrop-filter transition-all drop-shadow-xl">
        <NewLink fireConfetti={fireConfetti} siteURL={siteURL} />
      </div>
    </div>
  );
}

function NewLink({
  fireConfetti,
  siteURL,
}: {
  fireConfetti: () => void;
  siteURL: string;
}) {
  const { ndk, signer, signPublishEvent } = useNDK();

  const [input, setInput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [publishing, setPublishing] = useState<boolean>(false);

  const { onCopy: copyUrl } = useClipboard(`${siteURL}${id}`);
  const inputRef = useRef();

  async function shortenUrl() {
    if (!signer || publishing || input.length === 0) return;

    setPublishing(true);

    // clean up inputs

    let url = input.trim();

    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    // create event

    const id = nanoid(8);

    const event = new NDKEvent();
    event.kind = 1994;
    event.tags = [
      ["d", id],
      ["r", url],
    ];

    try {
      const res = await signPublishEvent(event);
      if (res) {
        setId(id);
        fireConfetti();
      }
    } catch (e) { }
    setPublishing(false);
  }

  useEffect(() => {
    // @ts-ignore
    inputRef.current?.focus();
  }, [signer]);

  return (
    <div className="relative">
      {id ? (
        <div className="h-12 w-full bg-transparent pl-11 pr-4 text-gray-900 items-center flex">
          {siteURL}
          {id}
        </div>
      ) : (
        <div className="flex rounded-md shadow-sm h-12">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {signer ? (
                <LinkIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              ) : (
                <SignalIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              )}
            </div>
            <input
              type="url"
              name="url"
              id="url_input"
              className="block w-full bg-transparent rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              placeholder={
                signer ? "enter url you want to shorten" : ndk ? 'Connecting to signer... (or sign in with NIP07)' : "Connecting to relays..."
              }
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyUp={(e) => e.key === "Enter" && shortenUrl()}
              disabled={!signer || publishing}
              // @ts-ignore
              ref={inputRef}
            />
          </div>
          {!id && !publishing && (
            <button
              type="button"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 bg-transparent text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:bg-opacity-80"
              onClick={shortenUrl}
            >
              <kbd className="">Enter</kbd>
            </button>
          )}
        </div>
      )}

      {signer && (
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 items-center z-50">
          {id && (
            <>
              {copied ? (
                <CheckIcon className="h-8 w-8 text-green-400" />
              ) : (
                <button
                  onClick={() => {
                    setCopied(true);
                    copyUrl();
                  }}
                >
                  <DocumentDuplicateIcon className="h-8 w-8 text-gray-400" />
                </button>
              )}
            </>
          )}
          {!id && publishing && (
            <ArrowPathIcon
              className={`inline-block w-8 h-8 animate-spin text-gray-400`}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Confetti({ triggerConfetti }: { triggerConfetti: number }) {
  const refAnimationInstance = useRef(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      // @ts-ignore
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  useEffect(() => {
    if (triggerConfetti != 0) {
      fire();
    }
  }, [fire, triggerConfetti]);

  return (
    <ReactCanvasConfetti
      refConfetti={getInstance}
      style={{
        position: "fixed",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
      }}
    />
  );
}
