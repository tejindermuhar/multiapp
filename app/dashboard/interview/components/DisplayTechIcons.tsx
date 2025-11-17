"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TechIconProps {
  techstack: string[];
}

const DisplayTechIcons = ({ techstack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<string[]>([]);
  const [failedIcons, setFailedIcons] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!techstack || techstack.length === 0) return;

    const icons = techstack.slice(0, 5).map((tech) => {
      const normalized = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
      return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${normalized}/${normalized}-original.svg`;
    });

    setTechIcons(icons);
  }, [techstack]);

  const handleImageError = (index: number) => {
    setFailedIcons(prev => new Set(prev).add(index));
  };

  if (!techstack || techstack.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {techIcons.map((icon, index) => (
        <div
          key={index}
          className={cn(
            "relative w-8 h-8 rounded-lg bg-gray-100 p-1.5 flex items-center justify-center"
          )}
        >
          {failedIcons.has(index) ? (
            <span className="text-xs font-semibold text-gray-600">
              {techstack[index].substring(0, 2).toUpperCase()}
            </span>
          ) : (
            <Image
              src={icon}
              alt={techstack[index]}
              width={24}
              height={24}
              className="object-contain"
              onError={() => handleImageError(index)}
            />
          )}
        </div>
      ))}
      {techstack.length > 5 && (
        <div className="text-xs text-gray-500 font-medium">
          +{techstack.length - 5} more
        </div>
      )}
    </div>
  );
};

export default DisplayTechIcons;
