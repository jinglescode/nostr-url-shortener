import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupportedImageFormatClientSide } from "@/utils/getSupportedImageFormatClientSide";
import Layout from "../site/Layout";

export default function LinkPage() {
  const { ndk } = useNDK();
  const params = useParams();
  const { push } = useRouter();
  const [notFound, setNotFound] = useState<boolean>(false);
  const [imageFormat, setImageFormat] = useState<"avif" | "webp" | "jpeg">(
    "jpeg"
  ); // default to 'jpeg'

  useEffect(() => {
    async function fetchData() {
      if (!ndk) return;
      const filter: NDKFilter = {
        kinds: [1994],
        "#d": [params.slug],
      };

      const event = await ndk.fetchEvent(filter);

      if (event) {
        const rTags = event.tags.filter((t: string[]) => t[0] === "r");
        try {
          push(rTags[0][1]);
        } catch (e) {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    }

    async function determineImageFormat() {
      const format = await getSupportedImageFormatClientSide();
      setImageFormat(format);
    }

    fetchData();
    determineImageFormat();
  }, [ndk, params.slug, push]);

  if (!notFound) return <></>;

  if (notFound)
    return (
      <Layout imageFormat={imageFormat}>
        <div className="flex-1 flex flex-col justify-center items-center mx-auto max-w-2xl w-full gap-2">
          <div className="w-full rounded-xl bg-white bg-opacity-80 shadow-2xl backdrop-blur backdrop-filter transition-all drop-shadow-xl">
            <div className="h-20 w-full bg-transparent pl-4 pr-4 text-gray-dark items-center flex flex-col justify-center">
              <span>This URL does not exist.</span>
              <Link href={`/`} className="text-gray-medium">
                Shorten another URL<span> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
}
