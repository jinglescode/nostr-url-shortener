import { headers } from "next/headers";

export function getURL(): string {
  const headersInstance = headers()
  const hostName = headersInstance.get("x-forwarded-host") || headersInstance.get("host");
  const siteURL = `https://${hostName}/`;
  return siteURL;
}