import NDKWrapper from "@/components/NDKWrapper";
import HomePage from "@/components/HomePage";
import { headers } from "next/headers";

async function getURL(): Promise<string> {
  const headersInstance = headers()
  const hostName = headersInstance.get("x-forwarded-host") || headersInstance.get("host");
  const siteURL = `https://${hostName}/`;
  return siteURL;
}

async function getSupportedImageFormat(): Promise<'avif' | 'webp' | 'jpeg'> {
  const headersInstance = headers();
  const accept = headersInstance.get("accept") || '';

  const formatMap: Record<string, 'avif' | 'webp' | 'jpeg'> = {
    'image/avif': 'avif',
    'image/webp': 'webp'
  };

  for (let mime in formatMap) {
    if (accept.includes(mime)) {
      return formatMap[mime];
    }
  }

  return 'jpeg';  // default
}

export default async function Home(context: any) {
  const siteURL = await getURL();
  const imageFormat = await getSupportedImageFormat();
  return (
    <NDKWrapper loginSiger={true}>
      <HomePage siteURL={siteURL} imageFormat={imageFormat} />
    </NDKWrapper>
  );
}
