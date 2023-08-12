import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-screen bg-[url('https://images.unsplash.com/photo-1554629947-334ff61d85dc')] bg-cover bg-center">
      <div className="w-full h-full flex flex-col justify-center items-center backdrop-blur-sm">
        <Header />
        <div className="px-4 w-full">{children}</div>
        <Footer />
      </div>
    </main>
  );
}
