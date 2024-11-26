"use client";
import Image from "next/image";
import {
  ArrowDownIcon,
  ArrowPathIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  DocumentDuplicateIcon,
  InformationCircleIcon,
  RocketLaunchIcon,
  SignalIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useEffect, useRef, useState } from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nanoid } from "nanoid";
import { useClipboard } from "@/hooks/useCopyClipboard";
import { useUserLinksPost } from "@/hooks/useUserLinksPost";
import removeHttp from "@/utils/removeHttp";
import { sessionStore } from "../site/sessionStore";
import { replaceDots } from "@/utils/replaceDots";
import Imagelogo from "@/images/w3.svg";
import QrContainer from "../site/QrContainer";
import { checkUrlWebRiskSafe } from "@/utils/checkUrlWebRiskSafe";
import { NOSTR_PREFIXES } from "@/constants/nostr-prefixes";

export default function LinkTextInput({
  fireConfetti,
  siteURL,
}: {
  fireConfetti: () => void;
  siteURL: string;
}) {
  const { ndk, signer } = useNDK();
  const {
    mutate,
    isSuccess,
    isError,
    reset: resetMutation,
  } = useUserLinksPost();

  const [input, setInput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const [userNip05, setUserNip05] = useState<string | undefined>(undefined);
  const [displayWithuserNip05, setDisplayWithUserNip05] = useState<
    string | undefined
  >(undefined);
  const [showCustomSlug, setShowCustomSlug] = useState<boolean>(false);
  const [customSlug, setCustomSlug] = useState<string>("");
  const [showCancelCustomSlug, setShowCancelCustomSlug] =
    useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const isUserSignIn = sessionStore((state) => state.isUserSignIn);

  const { onCopy: copyUrl } = useClipboard(`${siteURL}${id}`);
  const inputRef = useRef();

  useEffect(() => {
    async function get() {
      if (isUserSignIn && signer) {
        const user = await signer.user();
        user.ndk = ndk;
        await user.fetchProfile();
        const profile = user.profile;
        if (profile.nip05 && profile.nip05.length > 0) {
          let nip05 = profile.nip05;
          if (nip05.slice(0, 2) == "_@") {
            nip05 = nip05.slice(2);
          }
          setUserNip05(nip05);
          nip05 = removeHttp(window.location.href) + replaceDots(nip05) + "/";
          setDisplayWithUserNip05(nip05);
        }
      }
    }
    get();
  }, [isUserSignIn, signer]);

  async function shortenUrl() {
    if (!signer || publishing || input.length === 0) return;

    // clean up inputs
    let url = input.trim();

    const isNostr = NOSTR_PREFIXES.find((p) => url.startsWith(p));

    if (isNostr) {
      url = `https://njump.me/${url}`;
    } else if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    // check if url is safe
    // const urlIsSafe = await checkUrlWebRiskSafe(url);
    if (isNostr === undefined) { // && urlIsSafe === false
      return;
    }

    setSuccess(false);
    setPublishing(true);

    // create event
    let id = nanoid(8);
    if (showCustomSlug) {
      id = `${userNip05}/${customSlug}`;
    }

    id = replaceDots(id);

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

  function reset() {
    setInput("");
    setSuccess(false);
    setPublishing(false);
    setCopied(false);
    setId(undefined);
    setCustomSlug("");
    setShowCustomSlug(false);
    resetMutation();
  }

  async function paste() {
    const text = await navigator.clipboard.readText();
    setInput(text);
  }

  useEffect(() => {
    if (isSuccess) {
      fireConfetti();
      setSuccess(true);
      setPublishing(false);
    }
    if (isError) {
      setPublishing(false);
      reset();
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    // @ts-ignore
    inputRef.current?.focus();
  }, [signer]);

  return (
    <div className="flex flex-col w-full items-center gap-4">
      <div className="w-full rounded-md bg-white bg-opacity-80 shadow-2xl backdrop-blur backdrop-filter transition-all drop-shadow-xl">
        <div className="flex rounded-md shadow-sm h-12">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-0">
              {signer ? (
                <Image
                  src={Imagelogo}
                  alt="logo"
                  className="h-10 w-10"
                  unoptimized
                  width={32}
                  height={32}
                />
              ) : (
                <SignalIcon
                  className="h-6 w-6 text-gray-medium ml-3"
                  aria-hidden="true"
                />
              )}
            </div>
            {id ? (
              <div
                className="h-12 w-full bg-transparent pl-11 pr-4 text-gray-dark items-center flex cursor-pointer"
                onClick={() => {
                  setCopied(true);
                  copyUrl();
                }}
              >
                {removeHttp(siteURL)}
                <div className="font-bold text-gray-dark whitespace-nowrap">
                  {id}
                </div>
              </div>
            ) : (
              <input
                type="url"
                name="url"
                id="input_url"
                className="block w-full bg-transparent rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-dark border-transparent focus:border-transparent focus:ring-0"
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

          {input.length == 0 && (
            <button
              type="button"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 bg-transparent text-sm text-gray-dark disabled:hidden"
              onClick={paste}
            >
              <ClipboardDocumentIcon className="h-6 w-6 text-gray-medium hover:text-gray-dark" />
            </button>
          )}

          {(publishing || !showCustomSlug) && !success && (
            <button
              type="button"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 bg-transparent text-sm text-gray-dark disabled:hidden"
              onClick={shortenUrl}
              disabled={!signer || input.length === 0}
            >
              {publishing ? (
                <ArrowPathIcon
                  className={`w-8 h-8 animate-spin text-gray-medium`}
                />
              ) : (
                <RocketLaunchIcon className="h-6 w-6 text-gray-medium hover:text-gray-dark" />
              )}
            </button>
          )}

          {/* {userNip05 && !success && (
            <button
              type="button"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 bg-transparent text-sm text-gray-dark disabled:hidden"
              onClick={() => setShowCustomSlug(!showCustomSlug)}
              disabled={!signer || publishing}
            >
                <AdjustmentsVerticalIcon
                  className={`h-6 w-6 hover:text-gray-dark ${
                    showCustomSlug ? "text-primary" : "text-gray-medium"
                  }`}
                />
            </button>
          )} */}
        </div>

        {success && (
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 items-center z-50">
            <>
              <button
                onClick={() => {
                  setShowInfo(true);
                }}
              >
                <InformationCircleIcon className="h-8 w-8 text-gray-medium" />
              </button>
              {copied ? (
                <CheckIcon className="h-8 w-8 text-primary" />
              ) : (
                <button
                  onClick={() => {
                    setCopied(true);
                    copyUrl();
                  }}
                >
                  <DocumentDuplicateIcon className="h-8 w-8 text-gray-medium" />
                </button>
              )}
            </>
          </div>
        )}
      </div>

      {!publishing && showCustomSlug && !success && (
        <>
          <button
            onMouseOver={() => setShowCancelCustomSlug(true)}
            onMouseOut={() => setShowCancelCustomSlug(false)}
            onClick={() => setShowCustomSlug(!showCustomSlug)}
          >
            {showCancelCustomSlug ? (
              <XMarkIcon className="h-6 w-6 text-red-400" />
            ) : (
              <ArrowDownIcon className="h-6 w-6 text-white" />
            )}
          </button>

          <div className="w-full rounded-md bg-white bg-opacity-80 shadow-2xl backdrop-blur backdrop-filter transition-all drop-shadow-xl">
            <div className="flex rounded-md shadow-sm h-12">
              <span className="inline-flex items-center pl-3 text-gray-medium sm:text-sm whitespace-nowrap">
                {displayWithuserNip05}
              </span>
              <input
                type="url"
                name="slug"
                id="input_slug"
                className="block bg-transparent border-0 focus:ring-0 w-full pl-0"
                placeholder="your custom link"
                onChange={(e) => setCustomSlug(e.target.value)}
                value={customSlug}
                onKeyUp={(e) => e.key === "Enter" && shortenUrl()}
                disabled={!signer || publishing}
              />

              {showCustomSlug && !success && (
                <button
                  type="button"
                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 bg-transparent text-sm text-gray-dark disabled:hidden"
                  onClick={shortenUrl}
                  disabled={
                    !signer || input.length === 0 || customSlug.length === 0
                  }
                >
                  {publishing ? (
                    <ArrowPathIcon
                      className={`w-8 h-8 animate-spin text-gray-medium`}
                    />
                  ) : (
                    <RocketLaunchIcon className="h-6 w-6 text-gray-medium hover:text-gray-dark" />
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {!showCustomSlug && userNip05 && !success && (
        <button
          type="button"
          className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 bg-transparent text-sm text-white disabled:hidden"
          onClick={() => {
            setShowCustomSlug(!showCustomSlug);
            setShowCancelCustomSlug(false);
          }}
          disabled={!signer || publishing}
        >
          Create custom link?
        </button>
      )}

      {success && (
        <button className="text-gray-dark" onClick={() => reset()}>
          create another link?
        </button>
      )}

      <QrContainer show={showInfo} setShow={setShowInfo} url={id} />
    </div>
  );
}
