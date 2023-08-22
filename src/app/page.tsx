import HomePage from "@/components/HomePage";
import NDKWrapper from "@/components/ndk/NDKWrapper";
import { getSupportedImageFormat } from "@/utils/getSupportedImageFormat";
import { getURL } from "@/utils/getURL";

export default async function Home(context: any) {
  const siteURL = getURL();
  const imageFormat = getSupportedImageFormat();
  return (
    <NDKWrapper loginSiger={true}>
      <HomePage siteURL={siteURL} imageFormat={imageFormat} />
    </NDKWrapper>
  );
}
