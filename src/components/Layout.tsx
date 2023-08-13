import { BACKGROUND_IMAGES } from "@/constants/backgroundImages";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const _selectedImage =
      BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
    setSelectedImage(_selectedImage);
  }, []);

  return (
    <main
      className={`w-full bg-cover bg-center`}
      style={{ backgroundImage: `url(${selectedImage})` }}
    >
      <div className="w-full h-screen flex flex-col backdrop-blur-sm">
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
