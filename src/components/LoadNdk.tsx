import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useEffect } from "react";

export default function LoadNdk() {
  const { ndk, signer, loginWithSecret } = useNDK();
  useEffect(() => {
    async function login() {
      if (ndk && signer === undefined && process.env.NEXT_PUBLIC_NSEC) {
        const user = await loginWithSecret(process.env.NEXT_PUBLIC_NSEC);
      }
    }
    login();
  }, [ndk]);
  return <></>;
}
