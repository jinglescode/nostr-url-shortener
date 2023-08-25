import React from "react";

export default function Tooltip({
  children,
  info,
}: {
  children: React.ReactNode;
  info: React.ReactNode;
}) {
  return (
    <div className="group relative cursor-pointer">
      <div className="absolute invisible top-8 -left-6 group-hover:visible bg-white/80 text-black mb-1 p-2 rounded-md border border-primary">
        <p className="text-brand-gray text-sm font-light whitespace-nowrap">{info}</p>
      </div>
      <span className="hover:cursor-pointer">{children}</span>
    </div>
  );
}
