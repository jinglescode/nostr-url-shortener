"use client";
import {
  ArrowPathIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  LinkIcon,
  SignalIcon,
} from "@heroicons/react/20/solid";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useEffect, useRef, useState } from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nanoid } from "nanoid";
import { useClipboard } from "@/hooks/useCopyClipboard";
import { useUserLinksPost } from "@/hooks/useUserLinksPost";

export default function LinkTextInput({
  fireConfetti,
  siteURL,
}: {
  fireConfetti: () => void;
  siteURL: string;
}) {
  const { ndk, signer } = useNDK();
  const { mutate, isSuccess, isError } = useUserLinksPost();

  const [input, setInput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const { onCopy: copyUrl } = useClipboard(`${siteURL}${id}`);
  const inputRef = useRef();

  async function shortenUrl() {
    if (!signer || publishing || input.length === 0) return;
    setSuccess(false);
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
      setId(id);
      mutate(event);
    } catch (e) {}
  }

  useEffect(() => {
    if (isSuccess) {
      fireConfetti();
      setSuccess(true);
      setPublishing(false);
    }
    if (isError) {
      setPublishing(false);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    // @ts-ignore
    inputRef.current?.focus();
  }, [signer]);

  return (
    <div className="w-full rounded-md bg-white bg-opacity-80 shadow-2xl backdrop-blur backdrop-filter transition-all drop-shadow-xl">
      <div className="flex rounded-md shadow-sm h-12">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {signer ? (
              <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            ) : (
              <SignalIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </div>
          {id ? (
            <div
              className="h-12 w-full bg-transparent pl-11 pr-4 text-gray-900 items-center flex cursor-pointer"
              onClick={() => {
                setCopied(true);
                copyUrl();
              }}
            >
              {siteURL}
              {id}
            </div>
          ) : (
            <input
              type="url"
              name="url"
              id="url_input"
              className="block w-full bg-transparent rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 border-transparent focus:border-transparent focus:ring-0"
              placeholder={
                signer
                  ? "enter url you want to shorten"
                  : ndk
                  ? "Connecting to signer... (or sign in with NIP07)"
                  : "Connecting to relays..."
              }
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyUp={(e) => e.key === "Enter" && shortenUrl()}
              disabled={!signer || publishing}
              // @ts-ignore
              ref={inputRef}
            />
          )}
        </div>
        {!success && (
          <button
            type="button"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 bg-transparent text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:bg-opacity-80 disabled:text-gray-400"
            onClick={shortenUrl}
            disabled={!signer || publishing || input.length === 0}
          >
            {publishing ? (
              <ArrowPathIcon className={`w-8 h-8 animate-spin text-gray-400`} />
            ) : (
              <kbd className="">Enter</kbd>
            )}
          </button>
        )}
      </div>

      {success && (
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 items-center z-50">
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
        </div>
      )}
    </div>
  );
}
