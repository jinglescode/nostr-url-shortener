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

export default function HomePage() {
  const [triggerConfetti, setTriggerConfetti] = useState<number>(0);

  function fireConfetti() {
    setTriggerConfetti(triggerConfetti + 1);
  }

  return (
    <Layout>
      <Main fireConfetti={fireConfetti} />
      <Confetti triggerConfetti={triggerConfetti} />
    </Layout>
  );
}

function Main({ fireConfetti }: { fireConfetti: () => void }) {
  return (
    <div className="flex flex-col justify-center items-center mx-auto max-w-2xl w-full gap-2">
      {/* <AtSymbolIcon className="h-24 w-24 text-white" /> */}

      {/* <h2 className="text-3xl font-mono font-bold tracking-tight text-white sm:text-4xl font-outline">
        URL Shortener
      </h2> */}

      <div className="w-full rounded-xl bg-white bg-opacity-80 shadow-2xl backdrop-blur backdrop-filter transition-all drop-shadow-xl">
        <NewLink fireConfetti={fireConfetti} />
      </div>
    </div>
  );
}

function NewLink({ fireConfetti }: { fireConfetti: () => void }) {
  const { signer, signPublishEvent } = useNDK();

  const [input, setInput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [clickedEffect, setClickedEffect] = useState(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [publishing, setPublishing] = useState<boolean>(false);
  const { onCopy: copyUrl } = useClipboard(
    `${process.env.NEXT_PUBLIC_SITE_URL}${id}`
  );
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

    const res = await signPublishEvent(event);

    if (res) {
      setId(id);
      fireConfetti();
    }

    setPublishing(false);
  }

  useEffect(() => {
    // @ts-ignore
    inputRef.current?.focus();
  }, [signer]);

  return (
    <div className="relative">
      {signer ? (
        <LinkIcon
          className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-600"
          aria-hidden="true"
        />
      ) : (
        <SignalIcon
          className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-600"
          aria-hidden="true"
        />
      )}

      {id ? (
        <div className="h-12 w-full bg-transparent pl-11 pr-4 text-gray-900 items-center flex">
          {process.env.NEXT_PUBLIC_SITE_URL}
          {id}
        </div>
      ) : (
        <input
          className="h-12 w-full bg-transparent pl-11 pr-4 text-gray-900 outline-none placeholder:text-gray-600"
          placeholder={
            signer ? "enter url you want to shorten" : "Connecting to relays..."
          }
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyUp={(e) => e.key === "Enter" && shortenUrl()}
          disabled={!signer || publishing}
          // @ts-ignore
          ref={inputRef}
        />
      )}

      {signer && (
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 items-center">
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

          {!id && !publishing && (
            <button
              onClick={shortenUrl}
              className="inline-flex items-center rounded border border-gray-400 px-2 font-sans text-xs text-gray-600 h-8"
            >
              <kbd className="">enter</kbd>
            </button>
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
  }, [triggerConfetti]);

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
