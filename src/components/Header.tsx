import { headerLinks } from "@/constants/headerLinks";

export default function Header() {
  return (
    <div className="bg-white/0 border-t border-white/0 flex items-center justify-between w-full p-4">
      <div className="flex space-x-6 order-2 justify-center">
        {headerLinks.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-gray-700 hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">{item.name}</span>
            <item.icon className="h-6 w-6" aria-hidden="true" />
          </a>
        ))}
      </div>
      <p className="mt-8 text-md leading-7 text-gray-700 md:order-1 md:mt-0">
        {/* Powered by <a href="https://nostr.com/" target="_blank" rel="noopener noreferrer">NOSTR</a> */}
      </p>
    </div>
  );
}
