import { headerLinks } from "@/constants/headerLinks";
import { UserIcon } from "@heroicons/react/20/solid";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useState } from "react";

export default function Header() {
  const [userNpub, setUserNpub] = useState<string>("");
  const [isUserSignIn, setisUserSignIn] = useState<boolean>(false);
  const { ndk, loginWithNip07 } = useNDK();

  async function login() {
    const user = await loginWithNip07();
    if (user) {
      setUserNpub(user.npub);
      setisUserSignIn(true);
    }
  }

  return (
    <div className="bg-white/0 border-t border-white/0 flex items-center justify-end w-full p-4">
      <div className="flex space-x-6 justify-center">
        <button
          title={
            isUserSignIn
              ? `You are connected ${userNpub}`
              : "Login with Extension"
          }
          onClick={() => !isUserSignIn && login()}
          className={`bg-white/60 p-1 rounded-md ${
            isUserSignIn
              ? "text-green-600 cursor-help"
              : "text-gray-700 hover:text-gray-600"
          }`}
          disabled={!ndk}
        >
          <UserIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        {headerLinks.map((item) => (
          <a
            title={item.name}
            key={item.name}
            href={item.href}
            className="text-gray-700 hover:text-gray-600 bg-white/60 p-1 rounded-md"
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
