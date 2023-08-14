import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import { useRouter } from "next/navigation";
import Layout from "./Layout";
import { AtSymbolIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { getSupportedImageFormatClientSide } from "@/utils/getSupportedImageFormatClientSide";

export default function LinkPage() {
  const { ndk } = useNDK();
  const params = useParams();
  const { push } = useRouter();
  const [notFound, setNotFound] = useState<boolean>(false);
  const imageFormat = getSupportedImageFormatClientSide();

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
    fetchData();
  }, [ndk, params.slug, push]);

  if (!notFound) return <></>;

  if (notFound)
    return (
      <Layout imageFormat={imageFormat}>
        <div className="flex-1 flex flex-col justify-center items-center mx-auto max-w-2xl w-full gap-2">
          <AtSymbolIcon className="h-24 w-24 text-white" />

          {/* <h2 className="text-3xl font-mono font-bold tracking-tight text-white sm:text-4xl font-outline">
            URL Shortener
          </h2> */}

          <div className="w-full rounded-xl bg-white bg-opacity-80 shadow-2xl backdrop-blur backdrop-filter transition-all drop-shadow-xl">
            <div className="h-20 w-full bg-transparent pl-4 pr-4 text-gray-900 items-center flex flex-col justify-center">
              <span>This URL does not exist.</span>
              <Link href={`/`} className="text-gray-700">
                Shorten another URL<span> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
}
