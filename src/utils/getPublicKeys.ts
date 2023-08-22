import { nip19 } from "nostr-tools";

export const getPublicKeys = (
  hexOrNpub: string
): { pk: string; npub: string } => {
  const publicKeys = { pk: "", npub: "" };
  if (isNpub(hexOrNpub)) {
    publicKeys.npub = hexOrNpub;
    let { type, data } = nip19.decode(hexOrNpub);
    publicKeys.pk = data as string;
  } else if (isHexPubkey(hexOrNpub)) {
    publicKeys.pk = hexOrNpub;
    publicKeys.npub = nip19.npubEncode(hexOrNpub);
  } else {
    throw new Error("Invalid hexOrNpub");
  }
  return publicKeys;
};

export const isNpub = (hexOrNpub: string): boolean => {
  return hexOrNpub.startsWith("npub1");
};

export const isHexPubkey = (hexOrNpub: string): boolean => {
  return !isNpub(hexOrNpub);
};