"use client";
import { useUserLinks } from "@/hooks/useUserLinks";
import { getPublicKeys } from "@/utils/getPublicKeys";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useEffect, useState } from "react";
import { sessionStore } from "../site/sessionStore";
import Link from "next/link";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useUserLinksPost } from "@/hooks/useUserLinksPost";
import { TrashIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserLinks({}) {
  const { mutate, isSuccess, isError } = useUserLinksPost();

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

  function deleteLink(eventId: string) {
    const event = new NDKEvent();
    event.kind = 5;
    event.tags = [["e", eventId]];

    mutate(event);
  }

  // useEffect(() => {
  //   console.log(isSuccess);
  // }, [isSuccess, isError]);

  if (data === undefined) return <></>;

  return (
    <div className="rounded-md bg-white bg-opacity-80 shadow-2xl backdrop-blur backdrop-filter transition-all drop-shadow-xl overflow-y-scroll max-h-96 w-full">
      <table className="min-w-full divide-y divide-gray-300 h-12 table-auto overflow-y-scroll">
        <tbody>
          {data.map((url, i) => (
            <tr
              key={url.id}
              className={classNames(
                i === 0 ? "" : "border-t border-gray-200",
                "text-gray-600 text-sm"
              )}
            >
              <td className="flex p-4">
                <span className="text-gray-600">{window.location.href}</span>
                <Link href={`${window.location.href}${url.id}`} target="_blank">
                  <div className="font-medium text-gray-900">{url.id}</div>
                </Link>
              </td>
              <td className="p-4">
                <Link href={`${url.url}`} target="_blank">
                  <p className="max-w-xs truncate">{url.url}</p>
                </Link>
              </td>
              <td className="p-4">
                <button onClick={() => deleteLink(url.eid)}>
                  <TrashIcon className="h-5 w-5 text-red-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
