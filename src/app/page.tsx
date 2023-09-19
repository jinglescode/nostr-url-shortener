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

      <div className="fixed bottom-0 right-0 flex flex-col-reverse p-2">
        <a
          href="https://www.producthunt.com/posts/w3-url-shortener?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-w3&#0045;url&#0045;shortener"
          target="_blank"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=415280&theme=light"
            alt="W3&#0032;URL&#0032;Shortener - Decentralized&#0044;&#0032;fast&#0032;and&#0032;free&#0032;URL&#0032;shortener | Product Hunt"
            style={{ width: "250px", height: "54px" }}
          />
        </a>
      </div>
    </NDKWrapper>
  );
}
