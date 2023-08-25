import { headerLinks } from "@/constants/headerLinks";
import { UserIcon } from "@heroicons/react/20/solid";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useEffect, useState } from "react";
import { sessionStore } from "./sessionStore";
import Tooltip from "./Tooltip";

export default function Header() {
  const [hasExtension, setHasExtension] = useState<boolean>(false);
  const [userNpub, setUserNpub] = useState<string>("");
  const { ndk, loginWithNip07 } = useNDK();

  const isUserSignIn = sessionStore((state) => state.isUserSignIn);
  const setisUserSignIn = sessionStore((state) => state.setisUserSignIn);

  async function login() {
    try {
      const user = await loginWithNip07();
      if (user) {
        setUserNpub(user.npub);
        setisUserSignIn(true);
      }
    } catch (e) {}
  }

  useEffect(() => {
    if (window.nostr) setHasExtension(true);
  }, []);

  return (
    <div className="bg-white/0 border-t border-white/0 flex items-center justify-end w-full p-4">
      <div className="flex space-x-2 justify-center">
        {hasExtension && (
          <Tooltip info={isUserSignIn ? "Connected" : "Connect NIP7"}>
            <button
              onClick={() => !isUserSignIn && login()}
              className={`p-1 rounded-md ${
                isUserSignIn
                  ? "bg-gray-dark text-gray-light"
                  : "text-gray-700 hover:text-gray-medium bg-white/60"
              }`}
              disabled={!ndk}
            >
              <UserIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </Tooltip>
        )}

        {headerLinks.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-gray-700 hover:text-gray-medium bg-white/60 p-1 rounded-md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Tooltip info={item.name}>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </Tooltip>
          </a>
        ))}
      </div>
    </div>
  );
}
