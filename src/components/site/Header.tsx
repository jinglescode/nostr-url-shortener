import { headerLinks } from "@/constants/headerLinks";
import { UserIcon } from "@heroicons/react/20/solid";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useEffect, useState } from "react";
import { sessionStore } from "./sessionStore";

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
          <button
            title={
              isUserSignIn
                ? `You are connected ${userNpub}`
                : "Login with Extension"
            }
            onClick={() => !isUserSignIn && login()}
            className={`p-1 rounded-md ${
              isUserSignIn
                ? "bg-gray-dark cursor-help text-gray-light"
                : "text-gray-700 hover:text-gray-medium bg-white/60"
            }`}
            disabled={!ndk}
          >
            <UserIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        )}

        {headerLinks.map((item) => (
          <a
            title={item.name}
            key={item.name}
            href={item.href}
            className="text-gray-700 hover:text-gray-medium bg-white/60 p-1 rounded-md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <item.icon className="h-6 w-6" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}
