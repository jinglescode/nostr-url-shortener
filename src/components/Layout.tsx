import { BACKGROUND_IMAGES } from "@/constants/backgroundImages";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const selectedImage =
    BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
  return (
    <main
      className={`w-full bg-cover bg-center`}
      style={{ backgroundImage: `url(${selectedImage})` }}
    >
      <div className="w-full h-screen flex flex-col backdrop-blur-sm">
        <div className="h-14">
          <Header />
        </div>
        <div className="px-4 w-full flex flex-1 justify-center items-center">
          {children}
        </div>
        <div className="h-14">
          <Footer />
        </div>
      </div>
    </main>
  );
}
