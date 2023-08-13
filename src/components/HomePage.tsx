import {
  ArrowPathIcon,
  AtSymbolIcon,
  DocumentDuplicateIcon,
  LinkIcon,
  SignalIcon,
} from "@heroicons/react/20/solid";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useEffect, useRef, useState } from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nanoid } from "nanoid";
import { useClipboard } from "@/hooks/useCopyClipboard";
import Layout from "./Layout";

export default function HomePage() {
  return (
    <Layout>
      <Main />
    </Layout>
  );
}

function Main() {
  return (
    <div className="flex flex-col justify-center items-center mx-auto max-w-2xl w-full gap-2">
      <AtSymbolIcon className="h-24 w-24 text-white" />

      {/* <h2 className="text-3xl font-mono font-bold tracking-tight text-white sm:text-4xl font-outline">
        URL Shortener
      </h2> */}

      <div className="w-full rounded-xl bg-white bg-opacity-80 shadow-2xl backdrop-blur backdrop-filter transition-all drop-shadow-xl">
        <NewLink />
      </div>
    </div>
  );
}

function NewLink() {
  const { signer, signPublishEvent } = useNDK();

  const [input, setInput] = useState<string>("");
  const [clickedEffect, setClickedEffect] = useState(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [publishing, setPublishing] = useState<boolean>(false);
  const { onCopy: copyUrl } = useClipboard(
    `${process.env.NEXT_PUBLIC_SITE_URL}${id}`
  );
  const inputRef = useRef();

  async function shortenUrl() {
    if (!signer || publishing) return;

    setPublishing(true);

    const id = nanoid(8);

    const event = new NDKEvent();
    event.kind = 1994;
    event.tags = [
      ["d", id],
      ["r", input],
    ];

    const res = await signPublishEvent(event);

    if (res) {
      setId(id);
      setPublishing(false);
    }
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
            <button
              onClick={() => {
                setClickedEffect(true);
                copyUrl();
              }}
              className={`${clickedEffect && "animate-wiggle"}`}
              onAnimationEnd={() => setClickedEffect(false)}
            >
              <DocumentDuplicateIcon className="h-8 w-8 text-gray-400" />
            </button>
          )}
          {!id && publishing && (
            <ArrowPathIcon
              className={`inline-block w-8 h-8 animate-spin text-gray-400`}
            />
          )}

          {!id && !publishing && (
            <button
              onClick={shortenUrl}
              className="inline-flex items-center rounded border border-gray-400 px-1 font-sans text-xs text-gray-600 h-8"
            >
              <kbd className="">enter</kbd>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
