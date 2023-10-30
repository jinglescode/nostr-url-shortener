import removeHttp from "@/utils/removeHttp";
import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function QrContainer({
  show,
  setShow,
  url,
}: {
  show: boolean;
  setShow: any;
  url?: string;
}) {
  const [qrCode, setQrCode] = useState<string | undefined>(undefined);

  async function generate() {
    const generateQR = async (text) => {
      try {
        const data = await QRCode.toDataURL(text);
        setQrCode(data);
      } catch (err) {
        console.error(err);
      }
    };
    await generateQR(`${window.location.href}${url}`);
  }

  useEffect(() => {
    if (url) {
      generate();
    }
  }, [url]);

  return (
    <div className={show ? "" : "hidden"}>
      <div className="relative z-10">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  onClick={() => setShow(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <div className="mx-auto flex flex-col items-center justify-center">
                    <img src={qrCode} className="h-64 w-64" />
                    <Link
                      href={`${window.location.href}${url}`}
                      target="_blank"
                      className="flex hover:underline"
                    >
                      <span className="text-gray-medium">
                        {removeHttp(window.location.href)}
                      </span>
                      <div className="font-bold text-gray-dark whitespace-nowrap">
                        {url}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
