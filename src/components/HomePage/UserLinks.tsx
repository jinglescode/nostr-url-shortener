"use client";
import { useUserLinks } from "@/hooks/useUserLinks";
import { getPublicKeys } from "@/utils/getPublicKeys";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useEffect, useState } from "react";
import { sessionStore } from "../site/sessionStore";
import Link from "next/link";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useUserLinksPost } from "@/hooks/useUserLinksPost";
import { CheckIcon, LinkIcon, TrashIcon } from "@heroicons/react/20/solid";
import copy from "copy-to-clipboard";
import removeHttp from "@/utils/removeHttp";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserLinks({}) {
  const { mutate, isSuccess, isError } = useUserLinksPost();

  const isUserSignIn = sessionStore((state) => state.isUserSignIn);
  const [userPk, setUserPk] = useState<string | undefined>(undefined);

  const [deletingEvent, setDeletingEvent] = useState<string>("");
  const [deletedEvents, setDeletedEvents] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | undefined>(undefined);

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

  function deleteLink(eventId: string) {
    if (eventId) {
      const event = new NDKEvent();
      event.kind = 5;
      event.tags = [["e", eventId]];
      setDeletingEvent(eventId);
      mutate(event);
    }
  }

  function copyUrl(url: string, index) {
    const didCopy = copy(url);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(undefined);
    }, 5000);
  }

  useEffect(() => {
    if (isSuccess) {
      setDeletedEvents([...deletedEvents, deletingEvent]);
      setDeletingEvent("");
    }
  }, [isSuccess, isError]);

  if (data === undefined) return <></>;

  return (
    <div className="rounded-md bg-white bg-opacity-80 shadow-2xl backdrop-blur backdrop-filter transition-all drop-shadow-xl max-h-96 w-full">
      <div className="divide-y divide-gray-light max-h-96 overflow-y-scroll w-full">
        {data
          .filter((url) => !deletedEvents.includes(url.eid))
          .map((url, i) => (
            <div
              key={url.id}
              className={classNames(
                i === 0 ? "" : "border-t border-gray-light",
                "text-gray-dark text-sm flex w-full overflow-x-hidden gap-2 p-4 py-3 items-center"
              )}
            >
              <div>
                <button
                  onClick={() => copyUrl(`${window.location.href}${url.id}`, i)}
                >
                  {copiedIndex === i ? (
                    <CheckIcon className="h-5 w-5 text-primary" />
                  ) : (
                    <LinkIcon
                      className="h-5 w-5 text-gray-medium"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
              <div className="">
                <Link
                  href={`${window.location.href}${url.id}`}
                  target="_blank"
                  className="flex hover:underline"
                >
                  <span className="text-gray-medium">
                    {removeHttp(window.location.href)}
                  </span>
                  <div className="font-bold text-gray-dark whitespace-nowrap">
                    {url.id}
                  </div>
                </Link>
              </div>
              <div className="flex-grow overflow-x-hidden truncate">
                <Link
                  href={`${url.url}`}
                  target="_blank"
                  className="hover:underline"
                >
                  <p className="truncate">{removeHttp(url.url)}</p>
                </Link>
              </div>
              <div className="flex-1 flex flex-row-reverse">
                <button onClick={() => deleteLink(url.eid)}>
                  <TrashIcon className="h-5 w-5 text-gray-medium hover:text-red-400" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
