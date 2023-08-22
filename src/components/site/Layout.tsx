import { BACKGROUND_IMAGES } from "@/constants/backgroundImages";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect, useState } from "react";

export default function Layout({ children, imageFormat }: { children: React.ReactNode, imageFormat: 'avif' | 'webp' | 'jpeg' }) {
  const [selectedImage, setSelectedImage] = useState<string>("");

  // useEffect(() => {
  //   const _selectedImage =
  //     BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
  //   setSelectedImage(_selectedImage + `&fm=${imageFormat}`);
  // }, [imageFormat]);

  return (
    <main
      className={`w-full bg-cover bg-center overflow-hidden`}
      style={{ backgroundImage: `url(${selectedImage})` }}
    >
      <div className="w-full h-screen flex flex-col">
        <div className="h-14">
          <Header />
        </div>
        <div className="px-4 w-full h-full flex flex-1 justify-center items-center">
          {children}
        </div>
        <div className="h-14">
          <Footer />
        </div>
      </div>
    </main>
  );
}
