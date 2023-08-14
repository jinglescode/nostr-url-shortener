import NDKWrapper from "@/components/NDKWrapper";
import HomePage from "@/components/HomePage";
import { headers } from "next/headers";

async function getURL(): Promise<string> {
  const headersInstance = headers()
  const hostName = headersInstance.get("x-forwarded-host") || headersInstance.get("host");
  const siteURL = `https://${hostName}/`;
  return siteURL;
}

export default async function Home(context: any) {
  const siteURL = await getURL();
  return (
    <NDKWrapper loginSiger={true}>
      <HomePage siteURL={siteURL} />
    </NDKWrapper>
  );
}
